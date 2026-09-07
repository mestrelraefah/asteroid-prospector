/**
 * ECONOMY.JS - Sistema Econômico e Gerenciamento de Recursos
 * Tabelas de preços, custos de equipamentos, combustível e transações
 */

class EconomyManager {
    constructor() {
        this.playerCredits = 10000; // Créditos iniciais em Méritos Terranos (MT)
        this.inventory = {}; // Inventário de materiais refinados
        this.rawInventory = {}; // Inventário de materiais brutos (m³)
        
        this.initializePriceTable();
        this.initializeEquipmentCosts();
    }

    /**
     * TIER 1: Recursos de Grande Volume e Terraformação
     * TIER 2: Minérios Siderúrgicos e Estruturais
     * TIER 3: Ligas Tecnológicas e Compostos Complexos
     * TIER 4: Metais Nobres e Nanomateriais
     */
    initializePriceTable() {
        this.priceTable = {
            // TIER 1
            'Água': 50,
            'Argilas': 100,
            'Quartzo': 100,
            'Olivina': 100,
            'Piroxênio': 100,
            'Plagioclásio': 100,
            'Feldspato': 100,
            'Sílica Comum': 100,
            
            'Amônia': 300,
            'Metano': 300,
            'CO2': 300,
            'CO': 300,
            'Formaldeído': 300,
            'Acetona': 300,
            
            'Carvão Mineral': 350,
            'Hidrocarbonetos': 350,
            'Etano': 350,
            'Propano': 350,
            'Benzeno': 350,
            'Alcanos': 350,

            // TIER 2
            'Hematita': 800,
            'Magnetita': 800,
            'Maghemita': 800,
            'Goethita': 800,
            'Óxidos de Ferro': 800,
            'Lepidocrocita': 800,
            'Akaganeita': 800,
            'Ferrihidrita': 800,
            
            'Plessita': 1200,
            
            'Grafite': 1500,
            
            'Ilmenita': 2000,
            'Troilita': 2000,
            'Apatita': 2000,

            // TIER 3
            'Tenita': 3500,
            'Camacita': 3500,
            
            'Carboneto de Silício': 5000,
            
            'Cobalto': 8500,
            
            'Aminoácidos': 12000,
            'Alcoóis': 12000,
            'Nucleotídeos': 12000,
            
            'Stishovita': 15000,
            'Coesita': 15000,
            'Opala': 15000,
            'Cristobalita': 15000,
            'Calcedônia': 15000,

            // TIER 4
            'Ouro': 45000,
            'Paládio': 65000,
            'Platina': 80000,
            'Irídio': 110000,
            'Nanodiamantes': 160000
        };
    }

    /**
     * Inicializa tabela de custos de equipamentos
     */
    initializeEquipmentCosts() {
        this.equipmentCosts = {
            // Exoesqueletos
            exoskeleton_ko: {
                name: 'Exoesqueleto Classe KO',
                cost: 5000,
                description: 'Perfura Dureza FR 15. Suporta densidade até 500 kg/m³',
                type: 'exoskeleton',
                hardness: 15,
                maxDensity: 500
            },
            exoskeleton_cs: {
                name: 'Exoesqueleto Classe CS',
                cost: 15000,
                description: 'Perfura Dureza FR 30. Suporta densidade até 3500 kg/m³',
                type: 'exoskeleton',
                hardness: 30,
                maxDensity: 3500
            },
            exoskeleton_m: {
                name: 'Exoesqueleto Classe M',
                cost: 35000,
                description: 'Perfura Dureza FR 50. Suporta densidade até 8000 kg/m³',
                type: 'exoskeleton',
                hardness: 50,
                maxDensity: 8000
            },

            // Refinaria
            refinery_basic: {
                name: 'Refinaria Básica',
                cost: 25000,
                description: 'Processa até 40 m³ ou 320 ton por lote. Custo: 1 WILL por processamento',
                type: 'refinery',
                capacity: 40, // m³ ou 320 ton
                willCost: 1,
                throughput: 320 // toneladas por ciclo
            },
            refinery_advanced: {
                name: 'Refinaria Avançada',
                cost: 60000,
                description: 'Processa até 80 m³ ou 640 ton por lote. Custo: 0.5 WILL por processamento',
                type: 'refinery',
                capacity: 80,
                willCost: 0.5,
                throughput: 640
            },

            // Upgrades de Nave
            cargo_expansion_30_50: {
                name: 'Expansão de Silos Nível 1',
                cost: 8000,
                description: 'Aumenta carga útil de 30 ton para 50 ton',
                type: 'ship_upgrade',
                cargoIncrease: 20
            },
            cargo_expansion_50_75: {
                name: 'Expansão de Silos Nível 2',
                cost: 15000,
                description: 'Aumenta carga útil de 50 ton para 75 ton',
                type: 'ship_upgrade',
                cargoIncrease: 25
            },
            cargo_expansion_75_100: {
                name: 'Expansão de Silos Nível 3',
                cost: 25000,
                description: 'Aumenta carga útil de 75 ton para 100 ton',
                type: 'ship_upgrade',
                cargoIncrease: 25
            },

            // Tanques de Propulsão
            deltav_tank_expansion_1: {
                name: 'Tanque Expansor Delta-V Nível 1',
                cost: 12000,
                description: 'Aumenta reserva total de Delta-V em 30 km/s',
                type: 'ship_upgrade',
                deltaVIncrease: 30
            },
            deltav_tank_expansion_2: {
                name: 'Tanque Expansor Delta-V Nível 2',
                cost: 22000,
                description: 'Aumenta reserva total de Delta-V em 60 km/s',
                type: 'ship_upgrade',
                deltaVIncrease: 60
            },

            // Eficiência de Motores
            engine_efficiency_1: {
                name: 'Otimização de Motores Nível 1',
                cost: 18000,
                description: 'Reduz consumo de Delta-V por UT em 10%',
                type: 'ship_upgrade',
                efficiencyReduction: 0.10
            },
            engine_efficiency_2: {
                name: 'Otimização de Motores Nível 2',
                cost: 35000,
                description: 'Reduz consumo de Delta-V por UT em 20%',
                type: 'ship_upgrade',
                efficiencyReduction: 0.20
            },

            // Combustível Iônico
            ionic_fuel_10: {
                name: 'Cartucho Iônico (10 km/s)',
                cost: 500,
                description: 'Fornece 10 km/s de Delta-V',
                type: 'fuel',
                deltaVProvided: 10
            },
            ionic_fuel_50: {
                name: 'Cilindro Iônico (50 km/s)',
                cost: 2000,
                description: 'Fornece 50 km/s de Delta-V',
                type: 'fuel',
                deltaVProvided: 50
            },
            ionic_fuel_100: {
                name: 'Reservatório Iônico (100 km/s)',
                cost: 3500,
                description: 'Fornece 100 km/s de Delta-V',
                type: 'fuel',
                deltaVProvided: 100
            },

            // Reparos
            repair_hull_10: {
                name: 'Reparo de Casco (10% PV)',
                cost: 1000,
                description: 'Restaura 1000 PV da nave',
                type: 'repair',
                pvRestored: 1000
            },
            repair_hull_50: {
                name: 'Reparo Estrutural (50% PV)',
                cost: 4000,
                description: 'Restaura 5000 PV da nave',
                type: 'repair',
                pvRestored: 5000
            },

            // Escudos
            shield_generator_basic: {
                name: 'Gerador de Escudo Básico',
                cost: 20000,
                description: 'Aumenta IP Base em +3',
                type: 'ship_upgrade',
                ipIncrease: 3
            }
        };
    }

    /**
     * Obtém o preço de um material
     * @param {string} materialName
     * @returns {number} Preço em MT
     */
    getPrice(materialName) {
        return this.priceTable[materialName] || 0;
    }

    /**
     * Adiciona material ao inventário refinado
     * @param {string} materialName
     * @param {number} quantity - Em toneladas
     */
    addRefinedMaterial(materialName, quantity) {
        if (!this.inventory[materialName]) {
            this.inventory[materialName] = 0;
        }
        this.inventory[materialName] += quantity;
    }

    /**
     * Remove material do inventário refinado
     * @param {string} materialName
     * @param {number} quantity
     * @returns {boolean} Sucesso
     */
    removeRefinedMaterial(materialName, quantity) {
        if (!this.inventory[materialName] || this.inventory[materialName] < quantity) {
            return false;
        }
        this.inventory[materialName] -= quantity;
        if (this.inventory[materialName] === 0) {
            delete this.inventory[materialName];
        }
        return true;
    }

    /**
     * Adiciona material bruto ao inventário
     * @param {string} materialName
     * @param {number} quantity - Em m³
     */
    addRawMaterial(materialName, quantity) {
        if (!this.rawInventory[materialName]) {
            this.rawInventory[materialName] = 0;
        }
        this.rawInventory[materialName] += quantity;
    }

    /**
     * Remove material bruto do inventário
     * @param {string} materialName
     * @param {number} quantity
     * @returns {boolean}
     */
    removeRawMaterial(materialName, quantity) {
        if (!this.rawInventory[materialName] || this.rawInventory[materialName] < quantity) {
            return false;
        }
        this.rawInventory[materialName] -= quantity;
        if (this.rawInventory[materialName] === 0) {
            delete this.rawInventory[materialName];
        }
        return true;
    }

    /**
     * Calcula valor total do inventário refinado
     * @returns {number} Valor em MT
     */
    getInventoryValue() {
        let totalValue = 0;
        for (const [material, quantity] of Object.entries(this.inventory)) {
            totalValue += this.getPrice(material) * quantity;
        }
        return totalValue;
    }

    /**
     * Vende todo o inventário refinado
     * @param {number} contractBonus - Multiplicador opcional (ex: 1.2 para +20%)
     * @returns {object} {revenue, breakdown}
     */
    sellAllInventory(contractBonus = 1.0) {
        let revenue = 0;
        const breakdown = {};

        for (const [material, quantity] of Object.entries(this.inventory)) {
            const basePrice = this.getPrice(material);
            const totalSale = basePrice * quantity * contractBonus;
            breakdown[material] = {
                quantity,
                unitPrice: basePrice,
                subtotal: totalSale
            };
            revenue += totalSale;
        }

        this.playerCredits += revenue;
        this.inventory = {}; // Limpa inventário

        return { revenue, breakdown };
    }

    /**
     * Vende quantidade específica de um material
     * @param {string} materialName
     * @param {number} quantity
     * @param {number} contractBonus
     * @returns {object|null}
     */
    sellMaterial(materialName, quantity, contractBonus = 1.0) {
        if (!this.removeRefinedMaterial(materialName, quantity)) {
            return null;
        }

        const basePrice = this.getPrice(materialName);
        const totalSale = basePrice * quantity * contractBonus;
        this.playerCredits += totalSale;

        return {
            material: materialName,
            quantity,
            unitPrice: basePrice,
            subtotal: totalSale
        };
    }

    /**
     * Compra um equipamento
     * @param {string} equipmentKey
     * @returns {boolean} Sucesso
     */
    buyEquipment(equipmentKey) {
        const equipment = this.equipmentCosts[equipmentKey];
        if (!equipment) return false;

        if (this.playerCredits < equipment.cost) {
            return false; // Créditos insuficientes
        }

        this.playerCredits -= equipment.cost;
        return true;
    }

    /**
     * Reabastece combustível iônico
     * @param {string} fuelType - Tipo de cartucho (ionic_fuel_10, ionic_fuel_50, etc.)
     * @param {number} quantity - Quantidade de cartuchos
     * @returns {object|null}
     */
    buyFuel(fuelType, quantity = 1) {
        const fuel = this.equipmentCosts[fuelType];
        if (!fuel || fuel.type !== 'fuel') return null;

        const totalCost = fuel.cost * quantity;
        if (this.playerCredits < totalCost) {
            return null;
        }

        this.playerCredits -= totalCost;
        return {
            fuel: fuel.name,
            quantity,
            deltaVProvided: fuel.deltaVProvided * quantity,
            totalCost
        };
    }

    /**
     * Obtém lista de equipamentos disponíveis
     * @param {string} type - Filtro por tipo (opcional)
     * @returns {object}
     */
    getAvailableEquipment(type = null) {
        const available = {};
        for (const [key, equipment] of Object.entries(this.equipmentCosts)) {
            if (!type || equipment.type === type) {
                available[key] = equipment;
            }
        }
        return available;
    }

    /**
     * Obtém status econômico completo
     * @returns {object}
     */
    getStatus() {
        return {
            credits: this.playerCredits,
            refinedInventory: { ...this.inventory },
            rawInventory: { ...this.rawInventory },
            inventoryValue: this.getInventoryValue(),
            refinedMaterialCount: Object.keys(this.inventory).length,
            rawMaterialCount: Object.keys(this.rawInventory).length
        };
    }

    /**
     * Calcula peso total do inventário bruto (em toneladas)
     * @param {object} densityMap - Mapa de densidades {materialName: densidade}
     * @returns {number}
     */
    getRawInventoryWeight(densityMap) {
        let totalWeight = 0;
        for (const [material, volume] of Object.entries(this.rawInventory)) {
            const density = densityMap[material] || 1000;
            totalWeight += (volume * density) / 1000; // Converte kg para toneladas
        }
        return totalWeight;
    }

    /**
     * Calcula peso total do inventário refinado (em toneladas)
     * @returns {number}
     */
    getRefinedInventoryWeight() {
        let totalWeight = 0;
        for (const quantity of Object.values(this.inventory)) {
            totalWeight += quantity; // Já está em toneladas
        }
        return totalWeight;
    }

    /**
     * Reset completo (para novo jogo)
     */
    reset() {
        this.playerCredits = 10000;
        this.inventory = {};
        this.rawInventory = {};
    }
}

// Instância global
const economy = new EconomyManager();

// ============================================
// TESTES AUTOMATIZADOS (comentar em produção)
// ============================================
function testEconomy() {
    console.log('=== TESTE DO SISTEMA ECONÔMICO ===');
    
    console.log('Status Inicial:', economy.getStatus());
    
    economy.addRefinedMaterial('Água', 100);
    economy.addRefinedMaterial('Ouro', 5);
    economy.addRefinedMaterial('Cobalto', 50);
    
    console.log('Após adicionar materiais:', economy.getStatus());
    console.log('Valor do inventário:', economy.getInventoryValue(), 'MT');
    
    console.log('\nEquipamentos disponíveis:');
    console.log(economy.getAvailableEquipment('exoskeleton'));
    
    console.log('\nCombustível disponível:');
    console.log(economy.getAvailableEquipment('fuel'));
    
    const sale = economy.sellAllInventory(1.2); // Com bonus de contrato
    console.log('\nVenda com bonus:', sale);
    console.log('Créditos após venda:', economy.playerCredits, 'MT');
}

// Descomente para testar:
// testEconomy();
