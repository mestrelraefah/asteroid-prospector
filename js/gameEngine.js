/**
 * GAMEENGINE.JS - Lógica Core do Jogo
 * Classes para Player, Spaceship, Asteroid, Refinery
 * Mecânica de turnos, viagens e geração procedural
 */

// ============================================
// CLASSE: PLAYER
// ============================================
class Player {
    constructor(name = 'Prospector') {
        this.name = name;
        this.will = 100;
        this.maxWill = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.currentDay = 1;
        this.currentTurn = 1; // Turno do dia (1-2)
        this.willExhaustedToday = 0; // Quantas vezes WILL foi esgotado hoje
        this.currentOrbit = null;
        this.equipment = {
            exoskeleton: null,
            refinery: null
        };
    }

    /**
     * Recupera WILL após descanso
     */
    rest() {
        this.will = this.maxWill;
        this.energy = this.maxEnergy;
    }

    /**
     * Esgota WILL durante atividade
     * @param {number} amount
     * @returns {boolean} Se conseguiu esgotar
     */
    consumeWill(amount) {
        if (this.will >= amount) {
            this.will -= amount;
            return true;
        }
        return false;
    }

    /**
     * Esgota energia da bateria
     * @param {number} amount
     * @returns {boolean}
     */
    consumeEnergy(amount) {
        if (this.energy >= amount) {
            this.energy -= amount;
            return true;
        }
        return false;
    }

    /**
     * Avança para próximo turno/dia
     */
    nextTurn() {
        if (this.currentTurn === 1) {
            this.currentTurn = 2;
        } else {
            this.currentTurn = 1;
            this.currentDay++;
            this.willExhaustedToday = 0;
        }
    }

    /**
     * Obtém status completo do jogador
     */
    getStatus() {
        return {
            name: this.name,
            day: this.currentDay,
            turn: this.currentTurn,
            will: this.will,
            maxWill: this.maxWill,
            energy: this.energy,
            maxEnergy: this.maxEnergy,
            willExhaustedToday: this.willExhaustedToday,
            currentOrbit: this.currentOrbit,
            equipment: this.equipment
        };
    }
}

// ============================================
// CLASSE: SPACESHIP
// ============================================
class Spaceship {
    constructor() {
        this.tonnage = 100;
        this.maxTonnage = 400;
        this.deltaVMax = 120;
        this.deltaV = 120; // Atual
        this.pv = 10000; // Pontos de Vida
        this.pvMax = 10000;
        this.ipBase = 5; // Índice de Proteção
        this.cargoCapacity = 30; // Toneladas
        this.cargoUsed = 0; // Toneladas usadas
        this.cargo = {}; // Materiais na nave {materialName: tonnage}
        this.hoursElapsed = 0;
        this.state = 'safe'; // 'safe', 'in_transit', 'in_peril', 'adrift'
        this.efficiency = 1.0; // Multiplicador de consumo de Delta-V
    }

    /**
     * Calcula consumo de Delta-V para viajar N UTs
     * 1 UT = 150.000 km
     * Consumo base: 1 km/s por 0.01 UT
     * @param {number} distanceUT - Distância em Unidades Táticas
     * @param {string} accelerationType - 'standard', 'max', 'emergency'
     * @returns {number} Delta-V consumido
     */
    calculateDeltaVConsumption(distanceUT, accelerationType = 'standard') {
        let consumption = (distanceUT / 0.01); // 1 km/s por 0.01 UT
        
        // Aplicar modificadores de aceleração
        switch(accelerationType) {
            case 'max':
                consumption *= 1.5; // 50% mais consumo
                break;
            case 'emergency':
                consumption *= 3; // 200% mais consumo
                break;
        }

        // Aplicar eficiência de motores
        consumption *= this.efficiency;

        return consumption;
    }

    /**
     * Viaja para um novo local
     * @param {number} distanceKm - Distância em km
     * @param {string} accelerationType
     * @returns {object} Resultado da viagem
     */
    travel(distanceKm, accelerationType = 'standard') {
        const distanceUT = distanceKm / 150000; // Converte para UTs
        const consumption = this.calculateDeltaVConsumption(distanceUT, accelerationType);

        if (this.deltaV < consumption) {
            this.state = 'adrift';
            return {
                success: false,
                reason: 'insufficient_deltav',
                consumedDeltaV: 0,
                availableDeltaV: this.deltaV,
                requiredDeltaV: consumption
            };
        }

        this.deltaV -= consumption;
        const travelTime = this.calculateTravelTime(distanceKm, accelerationType);
        this.hoursElapsed += travelTime;

        return {
            success: true,
            consumedDeltaV: consumption,
            remainingDeltaV: this.deltaV,
            travelTimeHours: travelTime,
            distanceTraveled: distanceKm
        };
    }

    /**
     * Calcula tempo de viagem em horas
     * @param {number} distanceKm
     * @param {string} accelerationType
     * @returns {number}
     */
    calculateTravelTime(distanceKm, accelerationType = 'standard') {
        let avgVelocity = 50; // km/s padrão
        
        switch(accelerationType) {
            case 'max':
                avgVelocity = 75;
                break;
            case 'emergency':
                avgVelocity = 100;
                break;
        }

        const hours = (distanceKm / avgVelocity) / 3600;
        return hours;
    }

    /**
     * Reabastece combustível
     * @param {number} amount - Delta-V a adicionar
     */
    refuel(amount) {
        this.deltaV = Math.min(this.deltaV + amount, this.deltaVMax);
    }

    /**
     * Repara casco
     * @param {number} amount - PV a restaurar
     */
    repair(amount) {
        this.pv = Math.min(this.pv + amount, this.pvMax);
    }

    /**
     * Adiciona carga à nave
     * @param {string} materialName
     * @param {number} tonnage
     * @returns {boolean}
     */
    addCargo(materialName, tonnage) {
        if (this.cargoUsed + tonnage > this.cargoCapacity) {
            return false;
        }
        
        if (!this.cargo[materialName]) {
            this.cargo[materialName] = 0;
        }
        this.cargo[materialName] += tonnage;
        this.cargoUsed += tonnage;
        return true;
    }

    /**
     * Remove carga da nave
     * @param {string} materialName
     * @param {number} tonnage
     * @returns {boolean}
     */
    removeCargo(materialName, tonnage) {
        if (!this.cargo[materialName] || this.cargo[materialName] < tonnage) {
            return false;
        }
        this.cargo[materialName] -= tonnage;
        this.cargoUsed -= tonnage;
        if (this.cargo[materialName] === 0) {
            delete this.cargo[materialName];
        }
        return true;
    }

    /**
     * Esvazia toda a carga
     */
    unloadAllCargo() {
        const unloaded = { ...this.cargo };
        this.cargo = {};
        this.cargoUsed = 0;
        return unloaded;
    }

    /**
     * Status completo da nave
     */
    getStatus() {
        return {
            tonnage: this.tonnage,
            deltaV: this.deltaV,
            deltaVMax: this.deltaVMax,
            pv: this.pv,
            pvMax: this.pvMax,
            ipBase: this.ipBase,
            cargoCapacity: this.cargoCapacity,
            cargoUsed: this.cargoUsed,
            cargo: { ...this.cargo },
            hoursElapsed: this.hoursElapsed,
            state: this.state,
            efficiency: this.efficiency
        };
    }
}

// ============================================
// CLASSE: ASTEROID
// ============================================
class Asteroid {
    constructor(orbitType) {
        this.orbitType = orbitType; // 'asteroid_belt', 'kuiper_belt', 'oort_cloud'
        this.distance = this.generateDistance();
        this.asteroidType = null;
        this.volume = 0;
        this.density = 0;
        this.composition = {};
        this.hardness = 0;
        
        this.generateAsteroid();
    }

    /**
     * Gera distância até próximo asteroide
     * Fórmula: (1d10 * 100.000) + 400.000 km
     * @returns {number}
     */
    generateDistance() {
        return (rollDice('1d10') * 100000) + 400000;
    }

    /**
     * Gera tipo e características do asteroide
     */
    generateAsteroid() {
        const roll = dice.rollPercentil();

        if (this.orbitType === 'asteroid_belt') {
            this.generateAsteroidBeltType(roll);
        } else if (this.orbitType === 'kuiper_belt' || this.orbitType === 'oort_cloud') {
            this.generateCometaryBody();
        }
    }

    /**
     * Gera asteroide do Cinturão de Asteroides
     * @param {number} roll - Resultado 1d100
     */
    generateAsteroidBeltType(roll) {
        if (roll <= 8) {
            this.asteroidType = 'Metálico';
            this.density = 8000;
            this.hardness = 50;
            this.volume = rollDice('1d10*100000*(10^(1d5))');
        } else if (roll <= 25) {
            this.asteroidType = 'Silicático';
            this.density = 3500;
            this.hardness = 30;
            this.volume = rollDice('1d10*1000000*(10^(1d6))');
        } else {
            this.asteroidType = 'Carbonáceo';
            this.density = 3500;
            this.hardness = 30;
            this.volume = rollDice('1d10*10000000000*(10^(1d2))');
        }

        this.generateComposition();
    }

    /**
     * Gera corpo cometário (Kuiper/Oort)
     */
    generateCometaryBody() {
        this.asteroidType = 'Corpo Cometário';
        this.density = 500;
        this.hardness = 15;
        this.volume = rollDice('1d10*1000*(10^(1d6))');
        this.generateComposition();
    }

    /**
     * Gera composição mineral do asteroide
     */
    generateComposition() {
        this.composition = {};

        if (this.asteroidType === 'Metálico') {
            this.generateMetallicComposition();
        } else if (this.asteroidType === 'Silicático') {
            this.generateSilicateComposition();
        } else if (this.asteroidType === 'Carbonáceo') {
            this.generateCarbonaceousComposition();
        } else if (this.asteroidType === 'Corpo Cometário') {
            this.generateCometaryComposition();
        }
    }

    /**
     * Composição de asteroide metálico
     */
    generateMetallicComposition() {
        const plessita = (85.5 + rollDice('1d10')) / 100;
        const cobalto = (rollDice('1d3') * 0.5) / 100;
        const silicatics = ((rollDice('3d10') - 1) * 0.5) / 100;
        const outros = Math.max(0, (rollDice('1d6') - 1) / 100);

        this.composition['Plessita'] = this.volume * plessita;

        // Separação de Plessita em Tenita e Camacita
        const tenita = this.composition['Plessita'] * 0.5;
        const camacita = this.composition['Plessita'] * 0.5;

        const teniaNiquel = tenita * (0.25 + rollDice('1d10') / 100);
        const teniIron = tenita - teniaNiquel;

        const camacitaNiquel = camacita * (0.04 + rollDice('1d6') / 100);
        const camacitaIron = camacita - camacitaNiquel;

        this.composition['Tenita'] = teniIron;
        this.composition['Níquel (Tenita)'] = teniaNiquel;
        this.composition['Camacita'] = camacitaIron;
        this.composition['Níquel (Camacita)'] = camacitaNiquel;

        this.composition['Cobalto'] = this.volume * cobalto;

        if (rollDice('1d2') === 1) {
            this.composition['Silicatos'] = this.volume * silicatics;
        } else {
            this.composition['Sílica'] = this.volume * silicatics;
        }

        // Outros metais
        const outrosRoll = rollDice('1d5');
        const outrosMinerais = ['Ouro', 'Platina', 'Paládio', 'Irídio', 'Silicatos de Magnésio'];
        this.composition[outrosMinerais[outrosRoll - 1]] = this.volume * outros;
    }

    /**
     * Composição de asteroide silicático
     */
    generateSilicateComposition() {
        const olivina = (45 + rollDice('1d10')) / 100;
        const piroxenio = (25 + rollDice('1d10')) / 100;
        const plagioclasio = (10 + rollDice('1d10')) / 100;
        const plessiCobalt = (5 + rollDice('1d5')) / 100;

        this.composition['Olivina'] = this.volume * olivina;
        this.composition['Piroxênio'] = this.volume * piroxenio;
        this.composition['Plagioclásio'] = this.volume * plagioclasio;
        this.composition['Plessita e Cobalto'] = this.volume * plessiCobalt;

        const othersMinerals = ['Feldspato', 'Troilita', 'Ilmenita', 'Apatita', 'Gelo'];
        const othersRoll = rollDice('1d6') - 1;
        if (othersRoll > 0) {
            this.composition[othersMinerals[rollDice('1d5') - 1]] = this.volume * (othersRoll / 100);
        }
    }

    /**
     * Composição de asteroide carbonáceo
     */
    generateCarbonaceousComposition() {
        // Compostos de Carbono
        const compostosCarbono = (20 + rollDice('2d10')) / 100;
        const carbonoMassa = this.volume * compostosCarbono;

        this.composition['Carvão Mineral'] = carbonoMassa * (rollDice('1d4') * 10 / 100);
        this.composition['Hidrocarbonetos'] = carbonoMassa * (rollDice('2d10') * 2 / 100);
        this.composition['Grafite'] = carbonoMassa * (rollDice('2d10') * 0.2 / 100);
        this.composition['Carboneto de Silício'] = carbonoMassa * (rollDice('2d10') * 0.02 / 100);

        // Óxidos de Ferro
        const oxidosFerro = (10 + rollDice('2d10')) / 100;
        const ferroMassa = this.volume * oxidosFerro;

        this.composition['Hematita'] = ferroMassa * (5 + rollDice('2d10') * 2) / 100;
        this.composition['Magnetita'] = ferroMassa * (rollDice('1d10') * 1.5) / 100;
        this.composition['Maghemita'] = ferroMassa * (rollDice('3d6') * 0.5) / 100;

        // Argilas e Sílicas
        const argilas = (10 + rollDice('2d10')) / 100;
        const silicas = (10 + rollDice('1d10')) / 100;

        this.composition['Argilas'] = this.volume * argilas;
        this.composition['Feldspato'] = this.volume * silicas * (20 + rollDice('2d10')) / 100;
        this.composition['Quartzo'] = this.volume * silicas * (10 + rollDice('1d10')) / 100;

        // Água, Sulfetos e Carbonatos
        const agua = (10 + rollDice('1d10')) / 100;
        this.composition['Água'] = this.volume * agua;
    }

    /**
     * Composição de corpo cometário
     */
    generateCometaryComposition() {
        this.composition['Água'] = this.volume * 0.70;
        this.composition['Amônia'] = this.volume * (rollDice('2d10') / 100);
        this.composition['Metano'] = this.volume * (rollDice('1d10') / 100);

        const outros = (27) / 100;
        const outrosRoll = rollDice('1d3');

        if (outrosRoll === 1) {
            // Poeira
            const poeiraRoll = rollDice('1d3');
            if (poeiraRoll === 1) {
                this.composition['Silicatos'] = this.volume * outros;
            } else if (poeiraRoll === 2) {
                this.composition['Aminoácidos'] = this.volume * outros;
            } else {
                this.composition['Nucleotídeos'] = this.volume * outros;
            }
        } else if (outrosRoll === 2) {
            // Plessita e Cobalto
            this.composition['Plessita e Cobalto'] = this.volume * outros;
        } else {
            // Voláteis
            const volatisRoll = rollDice('1d7');
            const volatiles = ['CO', 'CO2', 'HCN', 'Ácido Cianídrico', 'Formaldeído', 'Etanol', 'Acetona'];
            this.composition[volatiles[volatisRoll - 1]] = this.volume * outros;
        }
    }

    /**
     * Calcula massa total em kg
     * @returns {number}
     */
    getTotalMass() {
        return this.volume * this.density;
    }

    /**
     * Calcula massa total em toneladas
     * @returns {number}
     */
    getTotalMassTons() {
        return this.getTotalMass() / 1000;
    }

    /**
     * Status completo do asteroide
     */
    getStatus() {
        return {
            orbitType: this.orbitType,
            asteroidType: this.asteroidType,
            distance: this.distance,
            volume: this.volume,
            density: this.density,
            totalMass: this.getTotalMass(),
            totalMassTons: this.getTotalMassTons(),
            hardness: this.hardness,
            composition: { ...this.composition }
        };
    }
}

// ============================================
// CLASSE: REFINERY
// ============================================
class Refinery {
    constructor(type = 'basic') {
        this.type = type;
        this.capacity = type === 'advanced' ? 80 : 40; // m³ ou toneladas
        this.willCost = type === 'advanced' ? 0.5 : 1;
        this.throughput = type === 'advanced' ? 640 : 320; // toneladas por ciclo
        this.queue = {};
        this.processed = {};
    }

    /**
     * Adiciona material bruto à fila de processamento
     * @param {string} materialName
     * @param {number} volume - Em m³
     * @returns {boolean}
     */
    addToQueue(materialName, volume) {
        if (!this.queue[materialName]) {
            this.queue[materialName] = 0;
        }
        this.queue[materialName] += volume;
        return true;
    }

    /**
     * Processa material refinando para produto final
     * Retorna dicionário de materiais refinados com pesos em toneladas
     * @param {string} materialName
     * @param {object} densityMap - {materialName: densidade}
     * @returns {object|null}
     */
    processRefiningRecipe(materialName, volume, density) {
        const refined = {};
        const mass = volume * density; // em kg

        // Exemplo de receitas simples de refino
        // Na versão completa, seria uma tabela mais complexa
        
        // Materiais carbonáceos
        if (materialName === 'Carvão Mineral') {
            refined['Carvão Mineral'] = mass / 1000; // Já em toneladas
        } else if (materialName === 'Hidrocarbonetos') {
            refined['Hidrocarbonetos'] = mass / 1000;
        } else if (materialName === 'Plessita') {
            // Separa em Tenita e Camacita
            refined['Tenita'] = (mass * 0.5) / 1000;
            refined['Camacita'] = (mass * 0.5) / 1000;
        } else if (materialName === 'Hematita') {
            refined['Hematita'] = mass / 1000;
        } else if (materialName === 'Água') {
            refined['Água'] = mass / 1000;
        } else {
            // Fallback: mesmo material
            refined[materialName] = mass / 1000;
        }

        return refined;
    }

    /**
     * Processa toda a fila
     * @param {object} densityMap
     * @returns {object} Materiais refinados
     */
    processQueue(densityMap) {
        this.processed = {};

        for (const [material, volume] of Object.entries(this.queue)) {
            const density = densityMap[material] || 1000;
            const refined = this.processRefiningRecipe(material, volume, density);

            for (const [refinedMaterial, tonnage] of Object.entries(refined)) {
                if (!this.processed[refinedMaterial]) {
                    this.processed[refinedMaterial] = 0;
                }
                this.processed[refinedMaterial] += tonnage;
            }
        }

        const result = { ...this.processed };
        this.queue = {};
        this.processed = {};

        return result;
    }

    /**
     * Status da refinaria
     */
    getStatus() {
        return {
            type: this.type,
            capacity: this.capacity,
            willCost: this.willCost,
            throughput: this.throughput,
            queuedMaterials: { ...this.queue },
            processedMaterials: { ...this.processed }
        };
    }
}

// ============================================
// CLASSE: GAME CONTROLLER
// ============================================
class GameController {
    constructor() {
        this.player = new Player('Prospector');
        this.spaceship = new Spaceship();
        this.refinery = null;
        this.currentAsteroid = null;
        this.asteroidHistory = [];
        this.events = [];
        this.gameLogs = [];
        
        this.densityMap = this.createDensityMap();
    }

    /**
     * Cria mapa de densidades para todos os materiais
     */
    createDensityMap() {
        return {
            'Água': 1000,
            'Argilas': 2500,
            'Quartzo': 2650,
            'Olivina': 3300,
            'Piroxênio': 3300,
            'Plagioclásio': 2700,
            'Feldspato': 2650,
            'Amônia': 682,
            'Metano': 422,
            'CO2': 1562,
            'CO': 789,
            'Carvão Mineral': 1500,
            'Hidrocarbonetos': 800,
            'Hematita': 5200,
            'Magnetita': 5180,
            'Maghemita': 4880,
            'Plessita': 8000,
            'Grafite': 2200,
            'Ilmenita': 4700,
            'Troilita': 4800,
            'Apatita': 3200,
            'Cobalto': 8900,
            'Ouro': 19300,
            'Platina': 21450,
            'Paládio': 12020,
            'Irídio': 22560,
            'Silicatos': 3000,
            'Aminoácidos': 1400,
            'Nucleotídeos': 1600,
            'Tenita': 8000,
            'Camacita': 7800,
            'Gelo': 917
        };
    }

    /**
     * Inicia novo jogo
     */
    startGame() {
        this.player = new Player('Prospector');
        this.spaceship = new Spaceship();
        this.refinery = new Refinery('basic');
        this.currentAsteroid = null;
        this.asteroidHistory = [];
        this.events = [];
        this.gameLogs = [];
        this.addLog('[SYSTEM] Jogo iniciado. Bem-vindo ao Asteroid Prospector!');
    }

    /**
     * Seleciona órbita para exploração
     * @param {string} orbitType
     * @returns {boolean}
     */
    selectOrbit(orbitType) {
        const validOrbits = ['asteroid_belt', 'kuiper_belt', 'oort_cloud'];
        if (!validOrbits.includes(orbitType)) {
            return false;
        }
        this.player.currentOrbit = orbitType;
        this.addLog(`[NAVIGATION] Órbita selecionada: ${orbitType}`);
        return true;
    }

    /**
     * Escaneia próximo asteroide na órbita atual
     * @returns {Asteroid|null}
     */
    scanAsteroid() {
        if (!this.player.currentOrbit) {
            this.addLog('[ERROR] Nenhuma órbita selecionada!');
            return null;
        }

        this.currentAsteroid = new Asteroid(this.player.currentOrbit);
        this.asteroidHistory.push(this.currentAsteroid);
        
        this.addLog(`[SCAN] Asteroide detectado: ${this.currentAsteroid.asteroidType}`);
        this.addLog(`[SCAN] Tipo: ${this.currentAsteroid.asteroidType} | Volume: ${this.currentAsteroid.volume.toFixed(0)} m³ | Distância: ${this.currentAsteroid.distance} km`);

        return this.currentAsteroid;
    }

    /**
     * Viaja até o asteroide escaneado
     * @returns {object}
     */
    travelToAsteroid() {
        if (!this.currentAsteroid) {
            this.addLog('[ERROR] Nenhum asteroide escaneado!');
            return null;
        }

        const travelResult = this.spaceship.travel(this.currentAsteroid.distance);
        
        if (!travelResult.success) {
            this.addLog(`[TRAVEL] Falha na viagem: ${travelResult.reason}`);
            return travelResult;
        }

        this.addLog(`[TRAVEL] Viagem concluída! Delta-V restante: ${travelResult.remainingDeltaV.toFixed(1)} km/s`);
        this.player.nextTurn();

        return travelResult;
    }

    /**
     * Prospecta o asteroide (extrai materiais brutos)
     * @param {number} turnsToWork - Quantidade de turnos a trabalhar (1-2)
     * @returns {object}
     */
    prospectAsteroid(turnsToWork = 1) {
        if (!this.currentAsteroid) {
            this.addLog('[ERROR] Nenhum asteroide para prospetar!');
            return null;
        }

        if (turnsToWork > this.player.maxWill) {
            this.addLog('[ERROR] Energia/WILL insuficiente!');
            return null;
        }

        const extractedMaterials = {};
        const willUsed = turnsToWork * 10; // 10 WILL por turno

        if (!this.player.consumeWill(willUsed)) {
            this.addLog('[ERROR] Não há WILL suficiente!');
            return null;
        }

        // Extrai aproximadamente 20% do volume total por turno de trabalho
        const extractionRate = 0.20 * turnsToWork;
        const extractedVolume = this.currentAsteroid.volume * extractionRate;

        for (const [material, volume] of Object.entries(this.currentAsteroid.composition)) {
            const extracted = volume * extractionRate;
            extractedMaterials[material] = extracted;
            economy.addRawMaterial(material, extracted);
        }

        this.addLog(`[PROSPECT] Prospeção completa! Volume extraído: ${extractedVolume.toFixed(0)} m³`);
        this.addLog(`[PROSPECT] WILL utilizado: ${willUsed}. WILL restante: ${this.player.will}`);

        return {
            success: true,
            extractedVolume,
            materials: extractedMaterials,
            willUsed
        };
    }

    /**
     * Processa materiais brutos na refinaria
     * @returns {object}
     */
    processRefinery() {
        if (!this.refinery) {
            this.addLog('[ERROR] Sem refinaria disponível!');
            return null;
        }

        const rawStatus = economy.rawInventory;
        if (Object.keys(rawStatus).length === 0) {
            this.addLog('[ERROR] Nenhum material bruto para processar!');
            return null;
        }

        // Adiciona todos os materiais brutos à fila
        for (const [material, volume] of Object.entries(rawStatus)) {
            this.refinery.addToQueue(material, volume);
        }

        // Processa
        const refined = this.refinery.processQueue(this.densityMap);

        // Adiciona ao inventário refinado
        for (const [material, tonnage] of Object.entries(refined)) {
            economy.addRefinedMaterial(material, tonnage);
        }

        // Remove do inventário bruto
        for (const material of Object.keys(rawStatus)) {
            economy.removeRawMaterial(material, rawStatus[material]);
        }

        this.addLog(`[REFINERY] Processamento concluído!`);
        this.addLog(`[REFINERY] Materiais refinados: ${Object.keys(refined).length}`);

        return { success: true, refined };
    }

    /**
     * Testa risco ocupacional (ao fim de 2 turnos)
     * @returns {object}
     */
    testOccupationalHazard() {
        const roll = dice.rollSingle(10);
        const hazards = [
            'Atmosfera explosiva',
            'Deficiência de oxigênio',
            'Interrupção da energia do sistema de ventilação',
            'Falha na proteção respiratória',
            'Falha na proteção auditiva',
            'Desabamentos',
            'Incêndios',
            'Excesso de fluidos no traje pressurizado',
            'Rompimento de silo de armazenagem',
            'Rompimento de barragem de rejeitos'
        ];

        const hazard = hazards[roll - 1];
        const event = {
            type: 'hazard',
            hazard,
            roll,
            severity: roll <= 3 ? 'low' : roll <= 7 ? 'medium' : 'high',
            resolved: false
        };

        this.events.push(event);
        this.addLog(`[HAZARD] ${hazard} (Severidade: ${event.severity})`);

        return event;
    }

    /**
     * Adiciona log ao sistema
     * @param {string} message
     */
    addLog(message) {
        const timestamp = `[${new Date().toLocaleTimeString()}]`;
        const fullMessage = `${timestamp} ${message}`;
        this.gameLogs.push(fullMessage);
        console.log(fullMessage);
    }

    /**
     * Retorna últimos N logs
     * @param {number} count
     * @returns {array}
     */
    getLastLogs(count = 20) {
        return this.gameLogs.slice(-count);
    }

    /**
     * Status completo do jogo
     */
    getGameStatus() {
        return {
            player: this.player.getStatus(),
            spaceship: this.spaceship.getStatus(),
            currentAsteroid: this.currentAsteroid ? this.currentAsteroid.getStatus() : null,
            economy: economy.getStatus(),
            refinery: this.refinery ? this.refinery.getStatus() : null,
            events: this.events,
            lastLogs: this.getLastLogs(10)
        };
    }
}

// Instância global do controlador de jogo
const game = new GameController();

// ============================================
// TESTES AUTOMATIZADOS (comentar em produção)
// ============================================
function testGameEngine() {
    console.log('=== TESTE DO MOTOR DE JOGO ===');
    
    game.startGame();
    game.selectOrbit('asteroid_belt');
    
    const asteroid = game.scanAsteroid();
    console.log('Asteroide escaneado:', asteroid.getStatus());
    
    const prospect = game.prospectAsteroid(1);
    console.log('Resultado da prospeção:', prospect);
    
    console.log('\nInventário bruto após prospeção:', economy.rawInventory);
    
    const refine = game.processRefinery();
    console.log('Resultado do refino:', refine);
    
    console.log('\nInventário refinado após refino:', economy.inventory);
    console.log('Valor do inventário:', economy.getInventoryValue());
    
    console.log('\nStatus do jogo:', game.getGameStatus());
}

// Descomente para testar:
// testGameEngine();
