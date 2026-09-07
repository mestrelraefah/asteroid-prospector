/**
 * DICE.JS - Sistema de Rolagem de Dados
 * Suporta notação padrão de RPG: 1d6, 2d10, etc.
 * Com operações matemáticas: 1d10*100, 2d10*0.5, etc.
 */

class DiceRoller {
    constructor() {
        this.lastRolls = [];
    }

    /**
     * Rola um dado simples (1dX)
     * @param {number} sides - Número de faces do dado
     * @returns {number} Resultado da rolagem
     */
    rollSingle(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    /**
     * Rola múltiplos dados (XdY)
     * @param {number} count - Quantidade de dados
     * @param {number} sides - Número de faces
     * @returns {number} Soma dos resultados
     */
    rollMultiple(count, sides) {
        let total = 0;
        const rolls = [];
        for (let i = 0; i < count; i++) {
            const roll = this.rollSingle(sides);
            rolls.push(roll);
            total += roll;
        }
        this.lastRolls = rolls;
        return total;
    }

    /**
     * Intérpreta e executa notação de RPG com operações
     * Exemplos: "1d10", "2d10*100", "1d5*10", "2d10*0.5", "(1d10*100000)+(400000)"
     * @param {string} notation - Notação de dados
     * @returns {number} Resultado da operação
     */
    rollDice(notation) {
        // Remove espaços
        notation = notation.replace(/\s/g, '');

        // Substitui padrões de dados com valores rolados
        const result = notation.replace(/(\d+)d(\d+)/g, (match, count, sides) => {
            return this.rollMultiple(parseInt(count), parseInt(sides));
        });

        // Avalia a expressão matemática
        try {
            // Função segura para avaliar (sem usar eval diretamente)
            return Function('"use strict"; return (' + result + ')')();
        } catch (e) {
            console.error('Erro ao processar notação de dados:', notation, e);
            return 0;
        }
    }

    /**
     * Rola com modificador simples (ex: "1d10+5")
     * @param {string} notation
     * @returns {number}
     */
    roll(notation) {
        return this.rollDice(notation);
    }

    /**
     * Retorna os últimos dados rolados
     * @returns {array}
     */
    getLastRolls() {
        return this.lastRolls;
    }

    /**
     * Rola percentil (1d100)
     * @returns {number}
     */
    rollPercentil() {
        return this.rollSingle(100);
    }

    /**
     * Seleciona um item aleatório de um array
     * @param {array} array
     * @returns {*}
     */
    selectRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Seleciona N itens únicos de um array
     * @param {array} array
     * @param {number} count
     * @returns {array}
     */
    selectRandomUnique(array, count) {
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}

// Instância global do sistema de dados
const dice = new DiceRoller();

// Funções auxiliares de conveniência
function rollDice(notation) {
    return dice.rollDice(notation);
}

function roll1d(sides) {
    return dice.rollSingle(sides);
}

function rollXdY(count, sides) {
    return dice.rollMultiple(count, sides);
}

// ============================================
// TESTES AUTOMATIZADOS (comentar em produção)
// ============================================
function testDiceRoller() {
    console.log('=== TESTE DO SISTEMA DE DADOS ===');
    
    console.log('1d10:', rollDice('1d10'));
    console.log('2d10:', rollDice('2d10'));
    console.log('1d100:', rollDice('1d100'));
    console.log('1d10*100000:', rollDice('1d10*100000'));
    console.log('(1d10*100000)+400000:', rollDice('(1d10*100000)+400000'));
    console.log('2d10*0.5:', rollDice('2d10*0.5'));
    console.log('1d4*10:', rollDice('1d4*10'));
    console.log('1d6-1:', rollDice('1d6-1'));
    console.log('Percentil:', dice.rollPercentil());
    
    console.log('Últimas rolagens:', dice.getLastRolls());
}

// Descomente para testar:
// testDiceRoller();
