// Base de dados das Notícias com Tags Temáticas
const newsData = [
    {
        id: 1,
        category: "tech",
        tag: "Tecnologia no Campo",
        title: "Drones e Sensores ajudam produtores do PR a economizar água",
        excerpt: "Novos sistemas de monitoramento via satélite geram economia de insumos e reduzem impacto ambiental nas lavouras paranaenses."
    },
    {
        id: 2,
        category: "nature",
        tag: "Meio Ambiente",
        title: "Fazendas do Paraná batem recorde em recuperação de Matas Ciliares",
        excerpt: "A união entre tecnologia e proteção florestal garante rios mais limpos e preserva a biodiversidade ao redor de áreas produtivas."
    },
    {
        id: 3,
        category: "tech",
        tag: "Energia Limpa",
        title: "Cresce o uso de painéis solares para alimentar maquinários rurais",
        excerpt: "Propriedades investem em matrizes renováveis, mostrando que a produção forte caminha lado a lado com a pegada de carbono zero."
    },
    {
        id: 4,
        category: "nature",
        tag: "Bioinsumos",
        title: "Controle biológico reduz em 40% a necessidade de defensivos agrícolas",
        excerpt: "Pesquisas locais comprovam que o uso de predadores naturais protege a lavoura mantendo o equilíbrio ecológico do solo nativo."
    }
];

// Base de dados do Jogo da Memória
const agroItems = [
    { id: 1, symbol: '🌱', name: 'Plantio Direto', desc: 'Evita a erosão mantendo a cobertura orgânica e a palha da colheita protetora.' },
    { id: 2, symbol: '💧', name: 'Irrigação Eficiente', desc: 'Direciona a água de forma exata para a raiz, eliminando desperdícios no lençol freático.' },
    { id: 3, symbol: '🚜', name: 'Maquinário de Baixa Emissão', desc: 'Usa biocombustíveis e eletrificação para reduzir gases poluentes no trabalho diário.' },
    { id: 4, symbol: '🐞', name: 'Manejo Biológico', desc: 'Combate pragas de forma natural preservando a microbiota protetora da terra.' },
    { id: 5, symbol: '☀️', name: 'Energias Renováveis', desc: 'Usa o sol e ventos para energizar silos e bombeamento sem depender de combustíveis fósseis.' },
    { id: 6, symbol: '🌳', name: 'Reflorestamento de Reservas', desc: 'Mantém corredores ecológicos que dão abrigo para animais nativos e polinizadores.' }
];

let gameDeck = [...agroItems, ...agroItems];
let movesCount = 0; let matchesCount = 0; let activeCards = [];
let lockGrid = false; let currentUsername = ""; let baseFontSize = 16;

// Mapeamentos de Abas e Telas do DOM
const newsSection = document.getElementById('news-section');
const welcomeSection = document.getElementById('welcome-section');
const gameSection = document.getElementById('game-section');
const victoryScreen = document.getElementById('victory-screen');
const navNewsBtn = document.getElementById('nav-news-btn');
const navGameBtn = document.getElementById('nav-game-btn');

// Elementos Internos
const newsGrid = document.getElementById('news-grid');
const usernameInput = document.getElementById('username-input');
const startGameBtn = document.getElementById('start-game-btn');
const playerDisplay = document.getElementById('player-display');
const movesCounter = document.getElementById('moves-counter');
const matchesCounter = document.getElementById('matches-counter');
const gameGrid = document.getElementById('game-grid');
const progressBar = document.getElementById('game-progress');
const eduFactBox = document.getElementById('edu-fact-box');
const factTitle = document.getElementById('fact-title');
const factDescription = document.getElementById('fact-description');
const highScoreDisplay = document.getElementById('high-score-display');

// --- SISTEMA DE ABAS (Troca fluida de conteúdo no Portal) ---
navNewsBtn.addEventListener('click', () => {
    switchTab(navNewsBtn, newsSection);
});

navGameBtn.addEventListener('click', () => {
    switchTab(navGameBtn, welcomeSection);
    loadHighScore();
});

function switchTab(activeBtn, targetSection) {
    // Reseta botões de navegação
    navNewsBtn.classList.remove('active');
    navGameBtn.classList.remove('active');
    activeBtn.classList.add('active');

    // Esconde todas as seções principais
    newsSection.classList.add('hidden');
    welcomeSection.classList.add('hidden');
    gameSection.classList.add('hidden');
    victoryScreen.classList.add('hidden');

    // Mostra a selecionada
    targetSection.classList.remove('hidden');
}

// --- CONTROLE DE ACESSIBILIDADE ---
document.getElementById('toggle-dark-mode').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
document.getElementById('font-increase').addEventListener('click', () => adjustFont(2));
document.getElementById('font-decrease').addEventListener('click', () => adjustFont(-2));

function adjustFont(val) {
    baseFontSize = Math.max(12, Math.min(24, baseFontSize + val));
    document.documentElement.style.setProperty('--font-base-size', `${baseFontSize}px`);
}

// --- RENDERIZADOR DINÂMICO DE NOTÍCIAS COM FILTRO ---
function renderNews(filter = "all") {
    newsGrid.innerHTML = "";
    const filteredNews = filter === "all" ? newsData : newsData.filter(item => item.category === filter);

    filteredNews.forEach(news => {
        const article = document.createElement('article');
        article.classList.add('news-card');
        article.innerHTML = `
            <span class="news-tag">${news.tag}</span>
            <h3>${news.title}</h3>
            <p>${news.excerpt}</p>
        `;
        newsGrid.appendChild(article);
    });
}

// Escuta cliques nos botões de filtros de notícias
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderNews(this.dataset.category);
    });
});

// --- SISTEMA INTERATIVO DO JOGO DA MEMÓRIA ---
function loadHighScore() {
    const score = localStorage.getItem('agrinhoHighScoreMoves');
    const player = localStorage.getItem('agrinhoHighScorePlayer');
    highScoreDisplay.innerHTML = score ? `🏆 Recorde: <strong>${player}</strong> com <strong>${score}</strong> jogadas` : "🌱 Nenhum recorde ativo. Comece agora!";
}

startGameBtn.addEventListener('click', () => {
    const user = usernameInput.value.trim();
    if (!user) { alert("Por favor, digite seu nome!"); return; }
    currentUsername = user;
    playerDisplay.textContent = currentUsername;
    welcomeSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    initiateNewGame();
});

function initiateNewGame() {
    movesCount = 0; matchesCount = 0; activeCards = []; lockGrid = false;
    movesCounter.textContent = movesCount; matchesCounter.textContent = matchesCount;
    progressBar.style.width = "0%"; progressBar.textContent = "0%";
    eduFactBox.classList.add('hidden');
    gameGrid.innerHTML = "";

    const shuffled = [...gameDeck].sort(() => Math.random() - 0.5);
    shuffled.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.id = item.id;
        card.dataset.name = item.name;
        card.dataset.desc = item.desc;
        card.textContent = item.symbol;
        card.setAttribute('role', 'button');
        card.addEventListener('click', handleCardFlip);
        gameGrid.appendChild(card);
    });
}

function handleCardFlip() {
    if (lockGrid || this === activeCards || this.classList.contains('matched')) return;
    this.classList.add('flipped');
    activeCards.push(this);
    if (activeCards.length === 2) {
        movesCount++;
        movesCounter.textContent = movesCount;
        const [c1, c2] = activeCards;
        if (c1.dataset.id === c2.dataset.id) {
            c1.classList.add('matched'); c2.classList.add('matched');
            matchesCount++;
            matchesCounter.textContent = matchesCount;
            
            // Barra de Progresso e Fatos dinâmicos
            const pct = Math.round((matchesCount / agroItems.length) * 100);
            progressBar.style.width = `${pct}%`; progressBar.textContent = `${pct}%`;
            
            factTitle.textContent = `💡 Sabia que: ${c1.dataset.name}`;
            factDescription.textContent = c1.dataset.desc;
            eduFactBox.classList.remove('hidden');
            
            activeCards = [];
            if (matchesCount === agroItems.length) setTimeout(triggerVictoryScreen, 1000);
        } else {
            lockGrid = true;
            setTimeout(() => { c1.classList.remove('flipped'); c2.classList.remove('flipped'); activeCards = []; lockGrid = false; }, 1000);
        }
    }
}

function triggerVictoryScreen() {
    gameSection.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    document.getElementById('victory-message').innerHTML = `Parabéns <strong>${currentUsername}</strong>! Completado em <strong>${movesCount}</strong> jogadas.`;
    
    const record = localStorage.getItem('agrinhoHighScoreMoves');
    if (!record || movesCount < parseInt(record)) {
        localStorage.setItem('agrinhoHighScoreMoves', movesCount);
        localStorage.setItem('agrinhoHighScorePlayer', currentUsername);
    }
}

document.getElementById('reset-game-btn').addEventListener('click', initiateNewGame);
document.getElementById('restart-victory-btn').addEventListener('click', () => {
    victoryScreen.classList.add('hidden'); gameSection.classList.remove('hidden'); initiateNewGame();
});

// Inicialização da Página
window.addEventListener('DOMContentLoaded', () => {
    renderNews();
});
