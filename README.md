````markdown
# 🚀 Asteroid Prospector

**Web Game por Turnos de Prospecção de Asteroides**

Um jogo estratégico de exploração e mineração de asteroides desenvolvido em **HTML5**, **CSS3 (TailwindCSS)** e **JavaScript Vanilla**, implementando com fidelidade as regras do sistema **Daemon Supers**.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Características Principais](#características-principais)
3. [Instalação e Uso](#instalação-e-uso)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Guia de Gameplay](#guia-de-gameplay)
6. [Mecânicas Principais](#mecânicas-principais)
7. [Sistema Econômico](#sistema-econômico)
8. [Controles e Atalhos](#controles-e-atalhos)
9. [Sistema de Debug](#sistema-de-debug)
10. [Roadmap](#roadmap)

---

## 🎮 Visão Geral

**Asteroid Prospector** é um jogo de estratégia e gerenciamento de recursos em tempo real onde você controla uma nave de prospecção equipada com exoesqueletos especializados para explorar asteroides em três órbitas diferentes ao redor do Sol:

- **Cinturão de Asteroides** (2.7-3.6 UA)
- **Cinturão de Kuiper** (30-50 UA)
- **Nuvem de Oort** (2.000-200.000 UA)

Seu objetivo é explorar asteroides, extrair minérios, refiná-los, vendê-los e acumular riqueza enquanto gerencia combustível, energia e os riscos ocupacionais da prospecção espacial.

---

## ✨ Características Principais

### 🌟 Mecânicas Core
- ✅ Sistema de **rolagem de dados** (1d6, 2d10, etc.) com suporte a operações matemáticas
- ✅ Geração **procedural** de asteroides com composição mineral realista
- ✅ Três tipos de asteroide: Metálico, Silicático, Carbonáceo e Corpos Cometários
- ✅ Sistema de **turnos e WILL** (Vontade) com recuperação de energia

### 🚀 Navegação e Viagem
- ✅ Cálculo realista de **Delta-V** (combustível) com base em distância
- ✅ Conversão de distância em **Unidades Táticas (UT)**
- ✅ Diferentes níveis de aceleração (Padrão, Máxima, Emergência)
- ✅ Gerenciamento de carga útil (até 30-100 toneladas)

### ⛏️ Prospecção e Beneficiamento
- ✅ Extração de materiais brutos (m³) com consumo de WILL
- ✅ Processamento em refinaria com custo de 1 WILL por lote
- ✅ Receitas de refino dinâmicas baseadas em tipo de asteroide
- ✅ Inventário dual: Materiais Brutos vs. Refinados

### 💰 Sistema Econômico
- ✅ **Tabela de preços** com 4 TIERS de materiais (50 MT a 160.000 MT/ton)
- ✅ Venda de inventário refinado no mercado
- ✅ Contratos com bônus (+20% para Colônias ou Estaleiros)
- ✅ Gerenciamento de créditos (Méritos Terranos)

### 🛠️ Equipamentos e Upgrades
- ✅ 3 classes de **exoesqueletos** (KO, CS, M) com diferentes capacidades
- ✅ 2 modelos de **refinaria** (Básica e Avançada)
- ✅ **Combustível iônico** em 3 tamanhos de cartucho
- ✅ Upgrades de nave (silos, Delta-V, eficiência de motores)
- ✅ Sistema de reparos

### 📊 Progressão e Conteúdo
- ✅ Sistema de **Missões** (6 missões principais)
- ✅ Sistema de **Achievements** (5 conquistas desbloqueáveis)
- ✅ Sistema de **Eventos Aleatórios** (perigos, bônus, danos, sorte)
- ✅ **Save/Load** persistente no localStorage
- ✅ Statistics e histórico de jogo

### 🎨 Interface
- ✅ Design **cyberpunk/terminal** com TailwindCSS
- ✅ Painel de status em tempo real
- ✅ Console de logs com coloração
- ✅ Modais para refinaria e venda
- ✅ Barras de progresso animadas

---

## 🔧 Instalação e Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Nenhuma dependência externa (apenas TailwindCSS via CDN)

### Como Jogar

1. **Clone ou baixe o repositório:**
   ```bash
   git clone https://github.com/mestrelraefah/asteroid-prospector.git
   cd asteroid-prospector
   ```

2. **Abra o arquivo `index.html` no navegador:**
   - Duplo-clique em `index.html`, ou
   - Use um servidor local (recomendado para melhor desempenho):
   ```bash
   python -m http.server 8000
   # Acesse: http://localhost:8000
   ```

3. **Comece a explorar:**
   - Selecione uma órbita
   - Clique em "SCAN FOR ASTEROID"
   - Processe materiais
   - Venda para ganhar créditos

---

## 📁 Estrutura do Projeto

```
asteroid-prospector/
├── index.html              # HTML principal com estrutura DOM
├── js/
│   ├── dice.js            # Sistema de rolagem de dados
│   ├── economy.js         # Tabelas de preços e gerenciamento econômico
│   ├── gameEngine.js      # Core game logic (Player, Ship, Asteroid, Refinery)
│   ├── ui.js              # Gerenciamento de interface gráfica
│   └── main.js            # Orquestração: Missões, Events, Achievements, Save/Load
└── README.md              # Este arquivo
```

### Carregamento de Scripts (index.html)
```html
<script src="js/dice.js"></script>
<script src="js/economy.js"></script>
<script src="js/gameEngine.js"></script>
<script src="js/ui.js"></script>
<script src="js/main.js"></script>
```

**Importante:** A ordem de carregamento é crítica pois cada módulo depende dos anteriores.

---

## 🎯 Guia de Gameplay

### 1️⃣ Seleção de Órbita
- Escolha uma das três órbitas disponíveis
- Cada órbita gera asteroides com características diferentes
- **Asteroid Belt**: Metálicos, Silicáticos, Carbonáceos
- **Kuiper Belt**: Corpos Cometários (água, gelo, voláteis)
- **Oort Cloud**: Corpos Cometários raros e distantes

### 2️⃣ Escanear Asteroide
- Clique em **"SCAN FOR ASTEROID"**
- O jogo gera distância aleatória: `(1d10 * 100.000) + 400.000 km`
- Tipo e composição são determinados pela tabela apropriada
- Informações completas são exibidas no painel à direita

### 3️⃣ Navegar até o Asteroide
- Clique em **"NAVIGATE TO NEXT"**
- A nave consome Delta-V baseado na distância
- Tempo de viagem varia conforme aceleração
- Retorna status de sucesso ou falha

### 4️⃣ Prospeitar (Extrair Minério Bruto)
- Clique em **"PROSPECT ASTEROID"**
- Consome **10 WILL por turno** de trabalho
- Extrai aproximadamente **20% do volume** do asteroide
- Materiais vão para inventário bruto (m³)

### 5️⃣ Processar na Refinaria
- Clique em **"SEND TO REFINERY"**
- Abre modal confirmando processamento
- Refina materiais brutos em minérios finais
- Custa **1 WILL** por lote (básico) ou **0.5 WILL** (avançado)
- Materiais passam para inventário refinado (toneladas)

### 6️⃣ Vender no Mercado
- Clique em **"SELL STOCK"**
- Modal exibe todos os materiais com preços
- Venda instantânea adiciona créditos
- Inventário refinado é zerado
- Ganhos podem ser usados em upgrades

### 7️⃣ Gerenciar Recursos
- **WILL**: Recupera a cada descanso (4h de jogo = 1 turno)
- **Energy**: Também recupera com descanso
- **Delta-V**: Reabastece com combustível iônico (compra com créditos)
- **Carga**: Máximo de 30-100 ton conforme nave

---

## ⚙️ Mecânicas Principais

### Sistema de Dados (Dice.js)

O motor de dados suporta notação RPG completa:

```javascript
rollDice('1d10')              // Um dado de 10 faces
rollDice('2d10')              // Dois dados de 10 faces
rollDice('1d10*100000')       // 1d10 * 100.000
rollDice('(1d10*100000)+400000') // Distância de asteroide
rollDice('2d10*0.5')          // Com decimais
```

### Geração Procedural de Asteroides

**Asteroide Metálico (01-08% roll, Cinturão):**
- Volume: `1d10 * 100.000 * (10^(1d5))` m³
- Densidade: 8000 kg/m³
- Dureza: FR 50
- Composição: Plessita (85.5%), Cobalto, Silicatos, Outros Metais

**Asteroide Silicático (09-25%):**
- Volume: `1d10 * 1.000.000 * (10^(1d6))` m³
- Densidade: 3500 kg/m³
- Dureza: FR 30
- Composição: Olivina, Piroxênios, Plagioclásio, Plessita

**Asteroide Carbonáceo (26-100%):**
- Volume: `1d10 * 10.000.000.000 * (10^(1d2))` m³
- Densidade: 3500 kg/m³
- Dureza: FR 30
- Composição: Carbono, Óxidos de Ferro, Argilas, Sílicas, Água

**Corpo Cometário (Kuiper/Oort):**
- Volume: `1d10 * 1.000 * (10^(1d6))` m³
- Densidade: 500 kg/m³
- Dureza: FR 15
- Composição: 70% Água, Amônia, Metano, Voláteis, Silicatos

### Sistema de Viagem e Delta-V

**Conversão de Unidades:**
- 1 UT (Unidade Tática) = 0,001 UA = 150.000 km

**Consumo de Delta-V:**
- Padrão: 1 km/s por 0.01 UT
- Máxima: 1.5x o consumo padrão
- Emergência: 3x o consumo padrão

**Exemplo:**
- Distância: 500.000 km = 3.33 UT
- Consumo padrão: ~333 km/s
- Se nave tem 120 km/s, não consegue chegar (estado ADRIFT)

### Sistema de Turnos e WILL

- 2 turnos de 6 horas de trabalho por dia
- Intercalados por descansos de 4 horas
- Cada atividade consome WILL
- WILL pode ser esgotado até 2 vezes por dia
- Recupera totalmente após descanso

---

## 💰 Sistema Econômico

### Tabela de Preços (por Tonelada em MT)

#### TIER 1: $50-350/ton
- Água: $50
- Argilas, Sílicas Comuns, Olivina: $100
- Gases Voláteis: $300
- Carvão, Hidrocarbonetos: $350

#### TIER 2: $800-2000/ton
- Óxidos de Ferro (Hematita, Magnetita): $800
- Plessita (bruta): $1.200
- Grafite: $1.500
- Ilmenita, Troilita, Apatita: $2.000

#### TIER 3: $3.500-15.000/ton
- Tenita/Camacita (Níquel purificado): $3.500
- Carboneto de Silício: $5.000
- Cobalto: $8.500
- Aminoácidos, Alcoóis: $12.000
- Sílicas Raras: $15.000

#### TIER 4: $45.000-160.000/ton
- Ouro: $45.000
- Paládio: $65.000
- Platina: $80.000
- Irídio: $110.000
- Nanodiamantes: $160.000

### Custo de Equipamentos

**Exoesqueletos:**
- KO (FR 15, até 500 kg/m³): 5.000 MT
- CS (FR 30, até 3.500 kg/m³): 15.000 MT
- M (FR 50, até 8.000 kg/m³): 35.000 MT

**Refinaria:**
- Básica (40m³, 1 WILL): 25.000 MT
- Avançada (80m³, 0.5 WILL): 60.000 MT

**Combustível Iônico:**
- 10 km/s: 500 MT
- 50 km/s: 2.000 MT
- 100 km/s: 3.500 MT

**Upgrades de Nave:**
- Expansão de Silos (+20 ton): 8.000 MT
- Tanque Delta-V (+30 km/s): 12.000 MT
- Eficiência de Motores (-10%): 18.000 MT

---

## 🎮 Controles e Atalhos

### Mouse
- Selecione órbita no dropdown
- Clique nos botões de ação
- Confirme ações nos modais

### Teclado

| Atalho | Função |
|--------|--------|
| **Ctrl+S** | Salvar Jogo |
| **Ctrl+L** | Carregar Jogo |
| **Ctrl+Shift+R** | Reiniciar Jogo (com confirmação) |

---

## 🐛 Sistema de Debug

Abra o **Console do Navegador** (F12) para acessar comandos de debug:

```javascript
// Visualizar estado atual
debug.showGameState()

// Economia
debug.addCredits(10000)
debug.addMaterial('Ouro', 50)

// Nave
debug.refuelShip(100)
debug.repairShip(5000)

// Progressão
debug.getMissions()
debug.getEvents()
debug.getAchievements()

// Sistema
debug.saveGame()
debug.loadGame()
debug.clearSave()
debug.restartGame()
```

---

## 🎯 Sistema de Missões

| ID | Título | Objetivo | Recompensa |
|----|---------|---------|---------| 
| first_ore | Primeira Coleta | Extraia 100 m³ | 1.000 MT |
| first_refine | Primeiro Refino | Processe material | 2.000 MT |
| first_sale | Primeira Venda | Venda no mercado | 3.000 MT |
| asteroid_collector | Coletor | Explore 10 asteroides | 5.000 MT |
| kuiper_explorer | Explorador de Kuiper | Explore Kuiper | 8.000 MT |
| oort_pioneer | Pioneiro de Oort | Explore Nuvem de Oort | 15.000 MT |

---

## 🏆 Sistema de Achievements

- ⛏️ **Prospector Iniciante**: Complete primeira prospeção
- 💰 **Milionário**: Acumule 1.000.000 MT
- 🔬 **Coletor**: Colete 10 tipos de minerais
- 🚀 **Explorador**: Explore todas as 3 órbitas
- 👑 **Mestre Prospector**: Extraia 10.000+ toneladas

---

## 📈 Roadmap

### v1.0 (Atual)
- ✅ Sistema core de jogo
- ✅ Geração procedural de asteroides
- ✅ Economia e mercado
- ✅ Navegação e viagem
- ✅ Missões e achievements

### v1.1 (Próximas)
- 🔜 Sistema de combate com detritos
- 🔜 Tripulação e gerenciamento de pessoal
- 🔜 Pesquisa e tecnologias
- 🔜 Aliados e facções

### v2.0 (Futuro)
- 🔜 Multijogador cooperativo
- 🔜 Leaderboards
- 🔜 Mobile support
- 🔜 Modos de dificuldade
- 🔜 Customização de nave

---

## 📝 Licença

Este projeto é de **código aberto** e está disponível sob a licença **MIT**.

---

## 👨‍💻 Créditos

Desenvolvido como **Web Game por Turnos** baseado no sistema **Daemon Supers**.

- **Conceito e Regras**: Sistema Daemon Supers
- **Desenvolvimento**: Copilot Space
- **Plataforma**: HTML5 + CSS3 + JavaScript Vanilla

---

## 📞 Suporte

Para dúvidas, bugs ou sugestões:
- Abra uma **Issue** no repositório
- Verifique a documentação do código (comentários inline)
- Use o sistema de debug (console do navegador)

---

## 🚀 Começar a Jogar

**Basta abrir `index.html` no navegador e começar a explorar!**

Boa sorte, Prospector! 🌟

````
