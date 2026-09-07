/**
 * UI.JS - Gerenciamento de Interface Gráfica
 * Manipulação da DOM, atualização de status e interação com usuário
 */

class UIManager {
    constructor() {
        this.consoleElement = document.getElementById('console');
        this.willBar = document.getElementById('willBar');
        this.energyBar = document.getElementById('energyBar');
        this.willValue = document.getElementById('willValue');
        this.energyValue = document.getElementById('energyValue');
        this.credits = document.getElementById('credits');
        this.dayTurn = document.getElementById('dayTurn');
        this.currentOrbit = document.getElementById('currentOrbit');
        this.asteroidInfo = document.getElementById('asteroidInfo');
        this.rawMaterialsList = document.getElementById('rawMaterialsList');
        this.refinedMaterialsList = document.getElementById('refinedMaterialsList');
        
        // Botões
        this.scanBtn = document.getElementById('scanBtn');
        this.prospectBtn = document.getElementById('prospectBtn');
        this.nextAsteroidBtn = document.getElementById('nextAsteroidBtn');
        this.refineryBtn = document.getElementById('refineryBtn');
        this.sellBtn = document.getElementById('sellBtn');
        
        // Selects
        this.orbitSelect = document.getElementById('orbitSelect');
        
        // Modais
        this.refineryModal = document.getElementById('refineryModal');
        this.sellModal = document.getElementById('sellModal');
        this.confirmRefinery = document.getElementById('confirmRefinery');
        this.cancelRefinery = document.getElementById('cancelRefinery');
        this.confirmSell = document.getElementById('confirmSell');
        this.cancelSell = document.getElementById('cancelSell');
        
        this.setupEventListeners();
    }

    /**
     * Configura listeners de eventos dos botões
     */
    setupEventListeners() {
        this.scanBtn.addEventListener('click', () => this.handleScan());
        this.prospectBtn.addEventListener('click', () => this.handleProspect());
        this.nextAsteroidBtn.addEventListener('click', () => this.handleNextAsteroid());
        this.refineryBtn.addEventListener('click', () => this.handleRefinery());
        this.sellBtn.addEventListener('click', () => this.handleSell());
        
        this.confirmRefinery.addEventListener('click', () => this.confirmRefineryProcess());
        this.cancelRefinery.addEventListener('click', () => this.closeRefineryModal());
        this.confirmSell.addEventListener('click', () => this.confirmSellProcess());
        this.cancelSell.addEventListener('click', () => this.closeSellModal());
    }

    /**
     * Handler: Escaneia asteroide
     */
    handleScan() {
        const orbit = this.orbitSelect.value;
        
        if (!orbit) {
            this.addConsoleLog('⚠️ Selecione uma órbita primeiro!', 'warning');
            return;
        }

        game.selectOrbit(orbit);
        const asteroid = game.scanAsteroid();
        
        if (asteroid) {
            this.updateAsteroidInfo(asteroid);
            this.addConsoleLog(`✓ Asteroide ${asteroid.asteroidType} detectado!`, 'success');
        }
    }

    /**
     * Handler: Prospeita asteroide
     */
    handleProspect() {
        if (!game.currentAsteroid) {
            this.addConsoleLog('⚠️ Escaneie um asteroide primeiro!', 'warning');
            return;
        }

        const result = game.prospectAsteroid(1);
        
        if (result && result.success) {
            this.addConsoleLog(`✓ Prospeção concluída! ${Object.keys(result.materials).length} minerais extraídos.`, 'success');
            this.updateAllUI();
        } else {
            this.addConsoleLog('✗ Falha na prospeção!', 'danger');
        }
    }

    /**
     * Handler: Navega para próximo asteroide
     */
    handleNextAsteroid() {
        if (!game.player.currentOrbit) {
            this.addConsoleLog('⚠️ Nenhuma órbita selecionada!', 'warning');
            return;
        }

        const travelResult = game.travelToAsteroid();
        
        if (travelResult && travelResult.success) {
            this.addConsoleLog(`✓ Viagem concluída em ${travelResult.travelTimeHours.toFixed(1)} horas!`, 'success');
            this.updateAllUI();
            
            // Automaticamente escaneia próximo asteroide
            setTimeout(() => this.handleScan(), 500);
        } else if (travelResult) {
            this.addConsoleLog(`✗ Viagem falhou: ${travelResult.reason}`, 'danger');
        }
    }

    /**
     * Handler: Abre modal de refinaria
     */
    handleRefinery() {
        const rawInventory = economy.rawInventory;
        
        if (Object.keys(rawInventory).length === 0) {
            this.addConsoleLog('⚠️ Nenhum material bruto para processar!', 'warning');
            return;
        }

        this.showRefineryModal(rawInventory);
    }

    /**
     * Handler: Abre modal de venda
     */
    handleSell() {
        const inventory = economy.inventory;
        
        if (Object.keys(inventory).length === 0) {
            this.addConsoleLog('⚠️ Nenhum material refinado para vender!', 'warning');
            return;
        }

        this.showSellModal(inventory);
    }

    /**
     * Mostra modal de processamento de refinaria
     * @param {object} materials
     */
    showRefineryModal(materials) {
        let content = '<table class="w-full text-sm">';
        content += '<tr><th class="text-left">Material</th><th class="text-right">Volume (m³)</th></tr>';
        
        for (const [material, volume] of Object.entries(materials)) {
            content += `<tr><td>${material}</td><td class="text-right">${volume.toFixed(2)}</td></tr>`;
        }
        
        content += '</table>';
        document.getElementById('refineryContent').innerHTML = content;
        this.refineryModal.classList.remove('hidden');
    }

    /**
     * Confirma processamento de refinaria
     */
    confirmRefineryProcess() {
        const result = game.processRefinery();
        
        if (result && result.success) {
            this.addConsoleLog('✓ Processamento de refinaria concluído!', 'success');
            this.closeRefineryModal();
            this.updateAllUI();
        } else {
            this.addConsoleLog('✗ Falha no processamento!', 'danger');
        }
    }

    /**
     * Fecha modal de refinaria
     */
    closeRefineryModal() {
        this.refineryModal.classList.add('hidden');
    }

    /**
     * Mostra modal de venda
     * @param {object} inventory
     */
    showSellModal(inventory) {
        let content = '<table class="w-full text-sm">';
        content += '<tr><th class="text-left">Material</th><th class="text-right">Qtd (ton)</th><th class="text-right">Preço/ton</th><th class="text-right">Total</th></tr>';
        
        let totalValue = 0;
        
        for (const [material, quantity] of Object.entries(inventory)) {
            const price = economy.getPrice(material);
            const subtotal = price * quantity;
            totalValue += subtotal;
            
            content += `<tr>
                <td>${material}</td>
                <td class="text-right">${quantity.toFixed(2)}</td>
                <td class="text-right">$${price}</td>
                <td class="text-right text-yellow-400 font-bold">$${subtotal.toFixed(0)}</td>
            </tr>`;
        }
        
        content += `<tr class="border-t border-cyan-600 font-bold"><td colspan="3">TOTAL:</td><td class="text-right text-yellow-400">$${totalValue.toFixed(0)}</td></tr>`;
        content += '</table>';
        
        document.getElementById('sellContent').innerHTML = content;
        this.sellModal.classList.remove('hidden');
    }

    /**
     * Confirma venda de inventário
     */
    confirmSellProcess() {
        const sale = economy.sellAllInventory(1.0);
        
        this.addConsoleLog(`✓ Venda concluída! Ganho: $${sale.revenue.toFixed(0)} MT`, 'success');
        this.closeSellModal();
        this.updateAllUI();
    }

    /**
     * Fecha modal de venda
     */
    closeSellModal() {
        this.sellModal.classList.add('hidden');
    }

    /**
     * Atualiza informações do asteroide escaneado
     * @param {Asteroid} asteroid
     */
    updateAsteroidInfo(asteroid) {
        const status = asteroid.getStatus();
        
        let html = `
            <div class="space-y-2">
                <p><span class="text-cyan-300">Tipo:</span> <span class="font-bold">${status.asteroidType}</span></p>
                <p><span class="text-cyan-300">Órbita:</span> <span class="font-bold">${status.orbitType}</span></p>
                <p><span class="text-cyan-300">Distância:</span> <span class="font-bold">${status.distance.toLocaleString()} km</span></p>
                <p><span class="text-cyan-300">Volume:</span> <span class="font-bold">${status.volume.toLocaleString()} m³</span></p>
                <p><span class="text-cyan-300">Massa Total:</span> <span class="font-bold">${status.totalMassTons.toLocaleString()} ton</span></p>
                <p><span class="text-cyan-300">Densidade:</span> <span class="font-bold">${status.density} kg/m³</span></p>
                <p><span class="text-cyan-300">Dureza:</span> <span class="font-bold">FR ${status.hardness}</span></p>
                <div class="pt-2 border-t border-cyan-600">
                    <p class="text-cyan-300 text-sm font-bold mb-2">Composição:</p>
        `;
        
        for (const [material, volume] of Object.entries(status.composition)) {
            const percentage = (volume / status.volume * 100).toFixed(1);
            html += `<p class="text-xs ml-2">• ${material}: ${volume.toFixed(0)} m³ (${percentage}%)</p>`;
        }
        
        html += '</div></div>';
        
        this.asteroidInfo.innerHTML = html;
    }

    /**
     * Atualiza barra de recursos
     */
    updateResourceBars() {
        const playerStatus = game.player.getStatus();
        
        // WILL
        const willPercent = (playerStatus.will / playerStatus.maxWill) * 100;
        this.willBar.style.width = willPercent + '%';
        this.willValue.textContent = `${Math.floor(playerStatus.will)} / ${playerStatus.maxWill}`;
        
        // Energy
        const energyPercent = (playerStatus.energy / playerStatus.maxEnergy) * 100;
        this.energyBar.style.width = energyPercent + '%';
        this.energyValue.textContent = `${Math.floor(playerStatus.energy)} / ${playerStatus.maxEnergy}`;
    }

    /**
     * Atualiza informações do dia/turno
     */
    updateDayTurnInfo() {
        const playerStatus = game.player.getStatus();
        this.dayTurn.textContent = `${playerStatus.day}/${playerStatus.turn}`;
        
        const orbitNames = {
            'asteroid_belt': 'Asteroid Belt',
            'kuiper_belt': 'Kuiper Belt',
            'oort_cloud': 'Oort Cloud',
            null: 'None'
        };
        
        this.currentOrbit.textContent = orbitNames[playerStatus.currentOrbit] || 'None';
    }

    /**
     * Atualiza créditos
     */
    updateCredits() {
        this.credits.textContent = economy.playerCredits.toLocaleString();
    }

    /**
     * Atualiza lista de materiais brutos
     */
    updateRawMaterialsList() {
        const rawInventory = economy.rawInventory;
        
        if (Object.keys(rawInventory).length === 0) {
            this.rawMaterialsList.innerHTML = '<p class="text-gray-400">Empty</p>';
            return;
        }

        let html = '';
        for (const [material, volume] of Object.entries(rawInventory)) {
            const mass = volume * (game.densityMap[material] || 1000);
            const tons = mass / 1000;
            html += `<p class="text-cyan-300"><span class="text-gray-400">•</span> ${material}: <span class="font-bold">${volume.toFixed(2)}</span> m³ (<span class="text-yellow-400">${tons.toFixed(2)}</span> ton)</p>`;
        }
        
        this.rawMaterialsList.innerHTML = html;
    }

    /**
     * Atualiza lista de materiais refinados
     */
    updateRefinedMaterialsList() {
        const inventory = economy.inventory;
        
        if (Object.keys(inventory).length === 0) {
            this.refinedMaterialsList.innerHTML = '<p class="text-gray-400">Empty</p>';
            return;
        }

        let html = '';
        for (const [material, quantity] of Object.entries(inventory)) {
            const price = economy.getPrice(material);
            const value = price * quantity;
            html += `<p class="text-cyan-300"><span class="text-gray-400">•</span> ${material}: <span class="font-bold">${quantity.toFixed(2)}</span> ton <span class="text-yellow-400">($${value.toFixed(0)})</span></p>`;
        }
        
        this.refinedMaterialsList.innerHTML = html;
    }

    /**
     * Atualiza toda a UI
     */
    updateAllUI() {
        this.updateResourceBars();
        this.updateDayTurnInfo();
        this.updateCredits();
        this.updateRawMaterialsList();
        this.updateRefinedMaterialsList();
    }

    /**
     * Adiciona mensagem ao console
     * @param {string} message
     * @param {string} type - 'info', 'success', 'warning', 'danger'
     */
    addConsoleLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const typeClass = {
            'info': 'text-cyan-300',
            'success': 'text-green-400 font-bold',
            'warning': 'text-yellow-400 font-bold',
            'danger': 'text-red-500 font-bold'
        }[type] || 'text-cyan-300';

        const line = document.createElement('p');
        line.className = typeClass;
        line.textContent = `[${timestamp}] ${message}`;
        
        this.consoleElement.appendChild(line);
        this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
    }

    /**
     * Limpa console
     */
    clearConsole() {
        this.consoleElement.innerHTML = '';
    }

    /**
     * Anima elemento (glitch effect)
     * @param {HTMLElement} element
     */
    animateElement(element) {
        element.classList.add('glitch');
        setTimeout(() => element.classList.remove('glitch'), 300);
    }

    /**
     * Habilita/desabilita botões
     * @param {string} buttonId
     * @param {boolean} enabled
     */
    setButtonEnabled(buttonId, enabled) {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.disabled = !enabled;
        }
    }

    /**
     * Mostra notificação temporária
     * @param {string} message
     * @param {number} duration - em ms
     */
    showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 terminal-bg p-4 rounded text-cyan-300 max-w-sm';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }
}

// Instância global da UI
const ui = new UIManager();

// ============================================
// INICIALIZAÇÃO
// ============================================
function initializeGame() {
    game.startGame();
    ui.updateAllUI();
    ui.addConsoleLog('🎮 Asteroid Prospector iniciado!', 'success');
    ui.addConsoleLog('Selecione uma órbita e comece a explorar.', 'info');
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

// ============================================
// FUNÇÕES DE TESTE (comentar em produção)
// ============================================
function testUI() {
    console.log('=== TESTE DA INTERFACE ===');
    
    initializeGame();
    
    ui.addConsoleLog('Teste de log de info', 'info');
    ui.addConsoleLog('Teste de log de sucesso', 'success');
    ui.addConsoleLog('Teste de log de aviso', 'warning');
    ui.addConsoleLog('Teste de log de erro', 'danger');
    
    setTimeout(() => {
        ui.handleScan();
    }, 500);
    
    setTimeout(() => {
        ui.handleProspect();
    }, 1500);
    
    setTimeout(() => {
        ui.updateAllUI();
    }, 2500);
}

// Descomente para testar:
// testUI();
