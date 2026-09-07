/**
 * MAIN.JS - Orquestração do Sistema e Lógica Adicional de Gameplay
 * Gerencia fluxo de jogo, eventos dinâmicos e progressão
 */

// ============================================
// SISTEMA DE PROGRESSÃO E MISSÕES
// ============================================
class MissionSystem {
    constructor() {
        this.missions = [];
        this.completedMissions = [];
        this.currentMission = null;
        this.initializeMissions();
    }

    /**
     * Inicializa missões disponíveis
     */
    initializeMissions() {
        this.missions = [
            {
                id: 'first_ore',
                title: 'Primeira Coleta',
                description: 'Extraia 100 m³ de material bruto de um asteroide',
                target: 100,
                type: 'raw_extraction',
                reward: 1000,
                completed: false
            },
            {
                id: 'first_refine',
                title: 'Primeiro Refino',
                description: 'Processe material bruto em materiais refinados',
                target: 1,
                type: 'refinery_process',
                reward: 2000,
                completed: false
            },
            {
                id: 'first_sale',
                title: 'Primeira Venda',
                description: 'Venda material refinado no mercado',
                target: 1,
                type: 'material_sale',
                reward: 3000,
                completed: false
            },
            {
                id: 'asteroid_collector',
                title: 'Coletor de Asteroides',
                description: 'Explore 10 asteroides diferentes',
                target: 10,
                type: 'asteroid_exploration',
                reward: 5000,
                completed: false
            },
            {
                id: 'kuiper_explorer',
                title: 'Explorador de Kuiper',
                description: 'Explore pelo menos 1 asteroide no Cinturão de Kuiper',
                target: 1,
                type: 'kuiper_exploration',
                reward: 8000,
                completed: false
            },
            {
                id: 'oort_pioneer',
                title: 'Pioneiro de Oort',
                description: 'Explore a Nuvem de Oort',
                target: 1,
                type: 'oort_exploration',
                reward: 15000,
                completed: false
            }
        ];
    }

    /**
     * Completa uma missão
     * @param {string} missionId
     * @returns {object|null}
     */
    completeMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission || mission.completed) return null;

        mission.completed = true;
        this.completedMissions.push(mission);
        
        return {
            mission: mission.title,
            reward: mission.reward,
            description: mission.description
        };
    }

    /**
     * Obtém progresso de uma missão
     * @param {string} missionId
     * @param {number} progress
     */
    updateMissionProgress(missionId, progress) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) return;

        if (!mission.progress) mission.progress = 0;
        mission.progress = Math.min(progress, mission.target);

        if (mission.progress >= mission.target && !mission.completed) {
            this.completeMission(missionId);
        }
    }

    /**
     * Obtém todas as missões
     * @returns {array}
     */
    getAllMissions() {
        return this.missions.map(m => ({
            ...m,
            progress: m.progress || 0,
            progressPercent: Math.min((m.progress || 0) / m.target * 100, 100)
        }));
    }
}

// ============================================
// SISTEMA DE EVENTOS ALEATÓRIOS
// ============================================
class EventSystem {
    constructor() {
        this.events = [];
        this.eventLog = [];
    }

    /**
     * Gera evento aleatório durante exploração
     * @returns {object}
     */
    generateRandomEvent() {
        const roll = dice.rollSingle(100);
        let event = null;

        if (roll <= 30) {
            event = this.generateHazardEvent();
        } else if (roll <= 50) {
            event = this.generateResourceBonusEvent();
        } else if (roll <= 70) {
            event = this.generateShipDamageEvent();
        } else if (roll <= 85) {
            event = this.generateNavigationEvent();
        } else {
            event = this.generateLuckyEvent();
        }

        this.eventLog.push(event);
        this.events.push(event);
        return event;
    }

    /**
     * Evento de perigo ocupacional
     * @returns {object}
     */
    generateHazardEvent() {
        const hazards = [
            { name: 'Atmosfera explosiva', severity: 'high', damage: 500, damageType: 'equipment' },
            { name: 'Deficiência de oxigênio', severity: 'medium', damage: 200, damageType: 'health' },
            { name: 'Interrupção de ventilação', severity: 'medium', damage: 300, damageType: 'equipment' },
            { name: 'Falha na proteção respiratória', severity: 'high', damage: 400, damageType: 'health' },
            { name: 'Desabamento', severity: 'high', damage: 800, damageType: 'equipment' }
        ];

        const hazard = dice.selectRandom(hazards);
        return {
            type: 'hazard',
            name: hazard.name,
            severity: hazard.severity,
            damage: hazard.damage,
            damageType: hazard.damageType,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Evento de bônus de recursos
     * @returns {object}
     */
    generateResourceBonusEvent() {
        const bonuses = [
            { name: 'Filão de Ouro', material: 'Ouro', amount: rollDice('1d10') },
            { name: 'Depósito de Água', material: 'Água', amount: rollDice('1d100') },
            { name: 'Cristal de Diamante', material: 'Nanodiamantes', amount: rollDice('1d5') },
            { name: 'Bolsão de Metano', material: 'Metano', amount: rollDice('1d50') }
        ];

        const bonus = dice.selectRandom(bonuses);
        return {
            type: 'resource_bonus',
            name: bonus.name,
            material: bonus.material,
            amount: bonus.amount,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Evento de dano à nave
     * @returns {object}
     */
    generateShipDamageEvent() {
        const damages = [
            { name: 'Colisão com detritos', pv: 1000, deltaV: 10 },
            { name: 'Radiação solar extrema', pv: 500, deltaV: 0 },
            { name: 'Falha de propulsor', pv: 0, deltaV: 20 },
            { name: 'Impacto micrometeorito', pv: 800, deltaV: 5 }
        ];

        const damage = dice.selectRandom(damages);
        return {
            type: 'ship_damage',
            name: damage.name,
            pvDamage: damage.pv,
            deltaVLoss: damage.deltaV,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Evento de navegação
     * @returns {object}
     */
    generateNavigationEvent() {
        const events = [
            { name: 'Anomalia gravitacional detectada', effect: 'navigation_bonus', value: 0.9 },
            { name: 'Corrente solar favorável', effect: 'deltav_bonus', value: 10 },
            { name: 'Campo magnético anômalo', effect: 'navigation_penalty', value: 1.2 }
        ];

        const navEvent = dice.selectRandom(events);
        return {
            type: 'navigation',
            name: navEvent.name,
            effect: navEvent.effect,
            value: navEvent.value,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Evento de sorte
     * @returns {object}
     */
    generateLuckyEvent() {
        const luckEvents = [
            { name: 'Bônus de créditos encontrado', credits: rollDice('1d5000') },
            { name: 'Sucata valiosa recuperada', credits: rollDice('2d2000') },
            { name: 'Prêmio de exploração', credits: rollDice('1d3000') }
        ];

        const lucky = dice.selectRandom(luckEvents);
        return {
            type: 'lucky',
            name: lucky.name,
            creditsBonus: lucky.credits,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Obtém últimos N eventos
     * @param {number} count
     * @returns {array}
     */
    getLastEvents(count = 10) {
        return this.eventLog.slice(-count);
    }
}

// ============================================
// SISTEMA DE ACHIEVEMENTS
// ============================================
class AchievementSystem {
    constructor() {
        this.achievements = [];
        this.unlockedAchievements = [];
        this.initializeAchievements();
    }

    /**
     * Inicializa achievements
     */
    initializeAchievements() {
        this.achievements = [
            {
                id: 'first_prospect',
                name: 'Prospector Iniciante',
                description: 'Complete sua primeira prospeção',
                icon: '⛏️',
                unlocked: false
            },
            {
                id: 'millionaire',
                name: 'Milionário',
                description: 'Acumule 1 milhão de créditos',
                icon: '💰',
                unlocked: false
            },
            {
                id: 'collector',
                name: 'Coletor',
                description: 'Colete 10 tipos diferentes de minerais',
                icon: '🔬',
                unlocked: false
            },
            {
                id: 'explorer',
                name: 'Explorador',
                description: 'Explore todas as três órbitas',
                icon: '🚀',
                unlocked: false
            },
            {
                id: 'master_miner',
                name: 'Mestre Prospector',
                description: 'Extraia mais de 10.000 toneladas de material',
                icon: '👑',
                unlocked: false
            }
        ];
    }

    /**
     * Desbloqueia um achievement
     * @param {string} achievementId
     * @returns {object|null}
     */
    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return null;

        achievement.unlocked = true;
        this.unlockedAchievements.push(achievement);
        
        return achievement;
    }

    /**
     * Obtém achievements desbloqueados
     * @returns {array}
     */
    getUnlockedAchievements() {
        return this.unlockedAchievements;
    }

    /**
     * Verifica progresso de achievements
     */
    checkAchievements() {
        const playerStatus = game.player.getStatus();
        const economyStatus = economy.getStatus();

        // Primeiro prospector
        if (game.asteroidHistory.length >= 1 && !this.achievements.find(a => a.id === 'first_prospect')?.unlocked) {
            this.unlockAchievement('first_prospect');
        }

        // Milionário
        if (economy.playerCredits >= 1000000 && !this.achievements.find(a => a.id === 'millionaire')?.unlocked) {
            this.unlockAchievement('millionaire');
        }

        // Coletor
        if (economyStatus.refinedMaterialCount >= 10 && !this.achievements.find(a => a.id === 'collector')?.unlocked) {
            this.unlockAchievement('collector');
        }
    }
}

// ============================================
// SISTEMA DE SALVAMENTO/CARREGAMENTO
// ============================================
class SaveLoadSystem {
    /**
     * Salva o jogo no localStorage
     */
    static saveGame() {
        const gameState = {
            player: game.player,
            spaceship: game.spaceship,
            economy: {
                playerCredits: economy.playerCredits,
                inventory: economy.inventory,
                rawInventory: economy.rawInventory
            },
            asteroidHistory: game.asteroidHistory.map(a => a.getStatus()),
            gameLogs: game.gameLogs,
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('asteroid_prospector_save', JSON.stringify(gameState));
            ui.addConsoleLog('💾 Jogo salvo com sucesso!', 'success');
            return true;
        } catch (e) {
            ui.addConsoleLog('❌ Erro ao salvar jogo!', 'danger');
            return false;
        }
    }

    /**
     * Carrega jogo do localStorage
     */
    static loadGame() {
        try {
            const savedData = localStorage.getItem('asteroid_prospector_save');
            if (!savedData) {
                ui.addConsoleLog('⚠️ Nenhum save encontrado.', 'warning');
                return false;
            }

            const gameState = JSON.parse(savedData);
            
            // Restaura player
            Object.assign(game.player, gameState.player);
            
            // Restaura nave
            Object.assign(game.spaceship, gameState.spaceship);
            
            // Restaura economia
            economy.playerCredits = gameState.economy.playerCredits;
            economy.inventory = gameState.economy.inventory;
            economy.rawInventory = gameState.economy.rawInventory;
            
            ui.addConsoleLog('📂 Jogo carregado com sucesso!', 'success');
            ui.updateAllUI();
            return true;
        } catch (e) {
            ui.addConsoleLog('❌ Erro ao carregar jogo!', 'danger');
            return false;
        }
    }

    /**
     * Limpa save
     */
    static clearSave() {
        localStorage.removeItem('asteroid_prospector_save');
        ui.addConsoleLog('🗑️ Save apagado.', 'info');
    }
}

// ============================================
// GAMEPLAY CONTROLLER
// ============================================
class GameplayController {
    constructor() {
        this.missionSystem = new MissionSystem();
        this.eventSystem = new EventSystem();
        this.achievementSystem = new AchievementSystem();
        this.gameTime = 0; // em horas
        this.totalMaterialExtracted = 0; // em toneladas
        this.totalMaterialRefined = 0;
        this.totalMaterialSold = 0;
        this.isGameOver = false;
        this.gameOverReason = null;
    }

    /**
     * Executa loop de jogo principal
     */
    gameLoop() {
        if (this.isGameOver) {
            this.endGame();
            return;
        }

        // Atualiza achievements
        this.achievementSystem.checkAchievements();

        // Verifica game over
        if (game.spaceship.pv <= 0) {
            this.isGameOver = true;
            this.gameOverReason = 'ship_destroyed';
            ui.addConsoleLog('💥 NAVE DESTRUÍDA! Jogo encerrado.', 'danger');
        }

        // Verifica recursos
        if (economy.playerCredits <= 0 && game.player.will <= 0) {
            this.isGameOver = true;
            this.gameOverReason = 'bankrupt';
            ui.addConsoleLog('💸 FALÊNCIA! Sem créditos ou energia.', 'danger');
        }

        // Auto-save a cada 5 minutos
        if (this.gameTime % 300 === 0 && this.gameTime > 0) {
            SaveLoadSystem.saveGame();
        }

        this.gameTime++;
    }

    /**
     * Encerra o jogo
     */
    endGame() {
        const stats = {
            tempoJogo: this.gameTime,
            créditos: economy.playerCredits,
            asteroidesExplorados: game.asteroidHistory.length,
            materialExtraído: this.totalMaterialExtracted,
            materialRefinado: this.totalMaterialRefined,
            materialVendido: this.totalMaterialSold,
            missõesCompletas: this.missionSystem.completedMissions.length,
            conquistas: this.achievementSystem.unlockedAchievements.length
        };

        ui.addConsoleLog('=== FIM DE JOGO ===', 'info');
        ui.addConsoleLog(`Tempo de jogo: ${stats.tempoJogo} horas`, 'info');
        ui.addConsoleLog(`Créditos finais: $${stats.créditos}`, 'info');
        ui.addConsoleLog(`Asteroides explorados: ${stats.asteroidesExplorados}`, 'info');
        ui.addConsoleLog(`Missões completadas: ${stats.missõesCompletas}/${this.missionSystem.missions.length}`, 'info');
    }

    /**
     * Reinicia o jogo
     */
    restartGame() {
        game.startGame();
        this.missionSystem = new MissionSystem();
        this.eventSystem = new EventSystem();
        this.achievementSystem = new AchievementSystem();
        this.gameTime = 0;
        this.totalMaterialExtracted = 0;
        this.totalMaterialRefined = 0;
        this.totalMaterialSold = 0;
        this.isGameOver = false;
        this.gameOverReason = null;
        
        ui.updateAllUI();
        ui.addConsoleLog('🎮 Novo jogo iniciado!', 'success');
    }

    /**
     * Obtém estatísticas do jogo
     */
    getGameStats() {
        return {
            tempoJogo: this.gameTime,
            créditos: economy.playerCredits,
            asteroidesExplorados: game.asteroidHistory.length,
            materialExtraído: this.totalMaterialExtracted,
            materialRefinado: this.totalMaterialRefined,
            materialVendido: this.totalMaterialSold,
            missõesCompletas: this.missionSystem.completedMissions.length,
            conquistas: this.achievementSystem.unlockedAchievements.length,
            naveHP: game.spaceship.pv,
            deltV: game.spaceship.deltaV,
            will: game.player.will
        };
    }
}

// ============================================
// INICIALIZAÇÃO GLOBAL
// ============================================
const gameplay = new GameplayController();

// Game loop a cada 5 segundos (1 hora de jogo = 5s real)
setInterval(() => {
    gameplay.gameLoop();
}, 5000);

// ============================================
// CONTROLES DE TECLADO
// ============================================
document.addEventListener('keydown', (e) => {
    // S: Salvar
    if (e.key.toLowerCase() === 's' && e.ctrlKey) {
        e.preventDefault();
        SaveLoadSystem.saveGame();
    }

    // L: Carregar
    if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
        e.preventDefault();
        SaveLoadSystem.loadGame();
    }

    // R: Reiniciar
    if (e.key.toLowerCase() === 'r' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (confirm('Deseja reiniciar o jogo?')) {
            gameplay.restartGame();
        }
    }
});

// ============================================
// PAINEL DE DEBUG (comentar em produção)
// ============================================
window.debug = {
    showGameState: () => {
        console.log('=== ESTADO ATUAL DO JOGO ===');
        console.log('Player:', game.player.getStatus());
        console.log('Spaceship:', game.spaceship.getStatus());
        console.log('Economy:', economy.getStatus());
        console.log('Stats:', gameplay.getGameStats());
    },
    
    addCredits: (amount) => {
        economy.playerCredits += amount;
        ui.updateCredits();
        console.log(`+${amount} créditos. Total: ${economy.playerCredits}`);
    },
    
    addMaterial: (material, amount) => {
        economy.addRefinedMaterial(material, amount);
        ui.updateRefinedMaterialsList();
        console.log(`+${amount} ton de ${material}`);
    },
    
    refuelShip: (amount) => {
        game.spaceship.refuel(amount);
        console.log(`Nave reabastecida com ${amount} km/s. Total: ${game.spaceship.deltaV} km/s`);
    },
    
    repairShip: (amount) => {
        game.spaceship.repair(amount);
        console.log(`Nave reparada em ${amount} PV. Total: ${game.spaceship.pv} PV`);
    },
    
    getMissions: () => {
        console.log('Missões:', gameplay.missionSystem.getAllMissions());
    },
    
    getEvents: () => {
        console.log('Eventos recentes:', gameplay.eventSystem.getLastEvents());
    },
    
    getAchievements: () => {
        console.log('Conquistas desbloqueadas:', gameplay.achievementSystem.getUnlockedAchievements());
    },
    
    saveGame: () => SaveLoadSystem.saveGame(),
    loadGame: () => SaveLoadSystem.loadGame(),
    clearSave: () => SaveLoadSystem.clearSave(),
    
    restartGame: () => gameplay.restartGame()
};

// Log de inicialização
console.log('✅ Asteroid Prospector carregado com sucesso!');
console.log('Comandos de debug disponíveis em: window.debug.*');
console.log('Atalhos de teclado: Ctrl+S (salvar), Ctrl+L (carregar), Ctrl+Shift+R (reiniciar)');
