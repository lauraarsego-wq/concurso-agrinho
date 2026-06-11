// Banco de dados de cartas contendo o par de sustentabilidade do Agro Forte
const agroItems = [
    { id: 1, symbol: '🌱', name: 'Plantio Direto' },
    { id: 2, symbol: '💧', name: 'Irrigação Gota a Gota' },
    { id: 3, symbol: '🚜', name: 'Trator Elétrico' },
    { id: 4, symbol: '🐞', name: 'Controle Biológico' },
    { id: 5, symbol: '☀️', name: 'Energia Solar' },
    { id: 6, symbol: '🌳', name: 'Preservação de Matas' }
];

// Duplicando a lista para criar os pares correspondentes do jogo
let gameDeck = [...agroItems, ...agroItems];

// Variáveis de estado global da aplicação
let movesCount = 0;
let matchesCount = 0;
let activeCards = [];
let lockGrid = false;
let currentUsername = "";
let baseFontSize = 16;

// Mapeamento dos elementos de interface do DOM
const welcomeSection = document.getElementById('welcome-section');
const gameSection = document.getElementById('game-section');
const victoryScreen = document.getElementById('victory-screen');
const usernameInput = document.getElementById('username-input');
const startGameBtn = document.getElementById('start-game-btn');
const greetingText = document.getElementById('greeting-text');
const playerDisplay = document.getElementById('player-display');
const movesCounter = document.getElementById('moves-counter');
const matchesCounter = document.getElementById('matches-counter');
const gameGrid = document.getElementById('game-grid');
const resetGameBtn = document.getElementById('reset-game-btn');
const restartVictoryBtn = document.getElementById('restart-victory-btn');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
const fontIncreaseBtn = document.getElementById('font-increase');
const fontDecreaseBtn = document.getElementById('font-decrease');
const victoryMessage = document.getElementById('victory-message');

// --- SISTEMA DE ACESSIBILIDADE E INTERAÇÃO DO USUÁRIO ---

// Função para Alternar Modo Escuro/Claro
toggleDarkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Funções para Controle Dinâmico do Tamanho da Fonte
fontIncreaseBtn.addEventListener('click', () => {
    if (baseFontSize < 24) {
        baseFontSize += 2;
        document.documentElement.style.setProperty('--font-base-size', `${baseFontSize}px`);
    }
});

fontDecreaseBtn.addEventListener('click', () => {
    if (baseFontSize > 12) {
        baseFontSize -= 2;
        document.documentElement.style.setProperty('--font-base-size', `${baseFontSize}px`);
    }
});

// --- LÓGICA DO FLUXO DO JOGO DA MEMÓRIA ---

// Inicialização da Identificação do Usuário e Transição de Telas
startGameBtn.addEventListener('click', () => {
    const inputValue = usernameInput.value.trim();
    if (inputValue === "") {
        alert("Por favor, digite um nome válido para começar o desafio!");
        return;
    }
    
    // Processamento e exibição de dados armazenados em variáveis
    currentUsername = inputValue;
    playerDisplay.textContent = currentUsername;
    
    // Manipulação dinâmica de visibilidade do DOM
    welcomeSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    
    initiateNewGame();
});

// Função para embaralhar os itens do jogo usando algoritmo Fisher-Yates
function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função Principal de Renderização e Montagem do Jogo
function initiateNewGame() {
    // Reset das variáveis de controle
    movesCount = 0;
    matchesCount = 0;
    activeCards = [];
    lockGrid = false;
    
    // Atualização de elementos textuais do placar
    movesCounter.textContent = movesCount;
    matchesCounter.textContent = matchesCount;
    gameGrid.innerHTML = "";
    
    // Embaralhar cartas
    const shuffledCards = shuffleDeck([...gameDeck]);
    
    // Geração dinâmica dos cartões interativos do tabuleiro HTML
    shuffledCards.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.id = item.id;
        cardElement.dataset.name = item.name;
        cardElement.textContent = item.symbol;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('aria-label', 'Carta oculta');
        
        // Atribuição de evento de clique em cada elemento
        cardElement.addEventListener('click', handleCardFlip);
        gameGrid.appendChild(cardElement);
    });
}

// Manipulador do Evento de Clique e Virada de Cartas
function handleCardFlip() {
    if (lockGrid) return;
    if (this === activeCards[0]) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');
    activeCards.push(this);

    if (activeCards.length === 2) {
        processTurnAttempt();
    }
}

// Processa a tentativa do jogador ao selecionar duas cartas
function processTurnAttempt() {
    movesCount++;
    movesCounter.textContent = movesCount;
    
    const [firstCard, secondCard] = activeCards;
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
        confirmMatchPoints();
    } else {
        revertCardFlip();
    }
}

// Confirma o acerto de pontos caso os pares sejam idênticos
function confirmMatchPoints() {
    activeCards[0].classList.add('matched');
    activeCards[1].classList.add('matched');
    
    matchesCount++;
    matchesCounter.textContent = matchesCount;
    activeCards = [];
    
    // Verificação de Condição de Vitória
    if (matchesCount === agroItems.length) {
        setTimeout(triggerVictoryScreen, 600);
    }
}

// Reverte a animação visual e esconde as cartas em caso de erro
function revertCardFlip() {
    lockGrid = true;
    setTimeout(() => {
        activeCards[0].classList.remove('flipped');
        activeCards[1].classList.remove('flipped');
        activeCards = [];
        lockGrid = false;
    }, 1000);
}

// Aciona a tela final de vitória e exibe resumo customizado
function triggerVictoryScreen() {
    gameSection.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    victoryMessage.innerHTML = `Excelente trabalho, <strong>${currentUsername}</strong>! Você completou o jogo com um total de <strong>${movesCount}</strong> jogadas.`;
}

// Botões para reiniciar e jogar novamente
resetGameBtn.addEventListener('click', initiateNewGame);
restartVictoryBtn.addEventListener('click', () => {
    victoryScreen.classList.add('hidden');
    gameSection.classList.remove('hidden');
    initiateNewGame();
});
