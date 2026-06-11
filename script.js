// Banco de dados expandido com informações ecológicas para os critérios de desempate
const agroItems = [
    { id: 1, symbol: '🌱', name: 'Plantio Direto', desc: 'Evita a erosão mantendo a palha da colheita anterior protegendo o solo.' },
    { id: 2, symbol: '💧', name: 'Irrigação por Gotejamento', desc: 'Direciona a água direto na raiz da planta, reduzindo o desperdício em até 60%.' },
    { id: 3, symbol: '🚜', name: 'Trator Elétrico / Biocombustível', desc: 'Reduz a emissão de gases de efeito estufa nos trabalhos de campo diários.' },
    { id: 4, symbol: '🐞', name: 'Controle Biológico', desc: 'Usa insetos benéficos para combater pragas, evitando pesticidas químicos poluentes.' },
    { id: 5, symbol: '☀️', name: 'Energia Solar Rural', desc: 'Garante autonomia elétrica limpa para cercas, bombeamento e silos produtivos.' },
    { id: 6, symbol: '🌳', name: 'Reserva Legal Protegida', desc: 'Mantém matas nativas preservadas que purificam a água e protegem os animais silvestre.' }
];

let gameDeck = [...agroItems, ...agroItems];
let movesCount = 0;
let matchesCount = 0;
let activeCards = [];
let lockGrid = false;
let currentUsername = "";
let baseFontSize = 16;

// Mapeamentos do DOM
const welcomeSection = document.getElementById('welcome-section');
const gameSection = document.getElementById('game-section');
const victoryScreen = document.getElementById('victory-screen');
const usernameInput = document.getElementById('username-input');
const startGameBtn = document.getElementById('start-game-btn');
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
const progressBar = document.getElementById('game-progress');
const eduFactBox = document.getElementById('edu-fact-box');
const factTitle = document.getElementById('fact-title');
const factDescription = document.getElementById('fact-description');
const highScoreDisplay = document.getElementById('high-score-display');

// --- SISTEMA DE ACESSIBILIDADE ---
toggleDarkModeBtn.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

fontIncreaseBtn.addEventListener('click', () => {
    if (baseFontSize < 24) { baseFontSize += 2; updateFontSize(); }
});
fontDecreaseBtn.addEventListener('click', () => {
    if (baseFontSize > 12) { baseFontSize -= 2; updateFontSize(); }
});
function updateFontSize() {
    document.documentElement.style.setProperty('--font-base-size', `${baseFontSize}px`);
}

// --- LOCAL STORAGE (RECORDE DA MÁXIMA NOTA) ---
function loadHighScore() {
    const savedScore = localStorage.getItem('agrinhoHighScoreMoves');
    const savedPlayer = localStorage.getItem('agrinhoHighScorePlayer');
    if (savedScore) {
        highScoreDisplay.innerHTML = `🏆 Recorde Atual da Escola: <strong>${savedPlayer}</strong> com apenas <strong>${savedScore}</strong> jogadas!`;
    } else {
        highScoreDisplay.textContent = "🌱 Nenhum recorde registrado ainda. Seja o pioneiro!";
    }
}
window.addEventListener('DOMContentLoaded', loadHighScore);

// --- FLUXO DO JOGO ---
startGameBtn.addEventListener('click', () => {
    const inputValue = usernameInput.value.trim();
    if (inputValue === "") { alert("Digite seu nome para iniciar!"); return; }
    currentUsername = inputValue;
    playerDisplay.textContent = currentUsername;
    welcomeSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    initiateNewGame();
});

function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initiateNewGame() {
    movesCount = 0; matchesCount = 0; activeCards = []; lockGrid = false;
    movesCounter.textContent = movesCount;
    matchesCounter.textContent = matchesCount;
    progressBar.style.width = "0%";
    progressBar.textContent = "0%";
    eduFactBox.classList.add('hidden');
    gameGrid.innerHTML = "";
    
    const shuffledCards = shuffleDeck([...gameDeck]);
    shuffledCards.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.id = item.id;
        cardElement.dataset.name = item.name;
        cardElement.dataset.desc = item.desc;
        cardElement.textContent = item.symbol;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('aria-label', 'Carta Oculta');
        cardElement.addEventListener('click', handleCardFlip);
        gameGrid.appendChild(cardElement);
    });
}

function handleCardFlip() {
    if (lockGrid || this === activeCards[0] || this.classList.contains('matched')) return;
    this.classList.add('flipped');
    activeCards.push(this);
    if (activeCards.length === 2) processTurnAttempt();
}

function processTurnAttempt() {
    movesCount++;
    movesCounter.textContent = movesCount;
    const [firstCard, secondCard] = activeCards;
    if (firstCard.dataset.id === secondCard.dataset.id) {
        confirmMatchPoints(firstCard.dataset.name, firstCard.dataset.desc);
    } else {
        revertCardFlip();
    }
}

// Manipulação do DOM Avançada: Altera textos, exibe explicações e preenche a barra de progresso
function confirmMatchPoints(name, desc) {
    activeCards[0].classList.add('matched');
    activeCards[1].classList.add('matched');
    matchesCount++;
    matchesCounter.textContent = matchesCount;
    
    // Atualiza Barra de Progresso
    const progressPercent = Math.round((matchesCount / agroItems.length) * 100);
    progressBar.style.width = `${progressPercent}%`;
    progressBar.textContent = `${progressPercent}%`;
    
    // Exibe Painel Educativo Dinâmico
    factTitle.textContent = `💡 Prática Descoberta: ${name}`;
    factDescription.textContent = desc;
    eduFactBox.classList.remove('hidden');
    
    activeCards = [];
    if (matchesCount === agroItems.length) setTimeout(triggerVictoryScreen, 1200);
}

function revertCardFlip() {
    lockGrid = true;
    setTimeout(() => {
        activeCards[0].classList.remove('flipped');
        activeCards[1].classList.remove('flipped');
        activeCards = [];
        lockGrid = false;
    }, 1000);
}

function triggerVictoryScreen() {
    gameSection.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    victoryMessage.innerHTML = `Excelente trabalho, <strong>${currentUsername}</strong>! Você alcançou 100% de equilíbrio ambiental em <strong>${movesCount}</strong> jogadas.`;
    
    // Processamento de Recordes locais
    const currentRecord = localStorage.getItem('agrinhoHighScoreMoves');
    if (!currentRecord || movesCount < parseInt(currentRecord)) {
        localStorage.setItem('agrinhoHighScoreMoves', movesCount);
        localStorage.setItem('agrinhoHighScorePlayer', currentUsername);
        victoryMessage.innerHTML += "<br><br><strong>🎉 NOVO RECORDE REGISTRADO DA ESCOLA!</strong>";
    }
}

resetGameBtn.addEventListener('click', initiateNewGame);
restartVictoryBtn.addEventListener('click', () => {
    victoryScreen.classList.add('hidden');
    gameSection.classList.remove('hidden');
    loadHighScore();
    initiateNewGame();
});
