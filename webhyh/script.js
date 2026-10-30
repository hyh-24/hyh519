'use strict';

// ============== 全局状态 ==============
const gameState = {
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    timerId: null,
    balls: []   // [{ id, x, y, element }]
};

// ============== 小球常量 ==============
const BALL_SIZE = 60;
const MIN_DISTANCE = BALL_SIZE;   // 两球最小间距
const TOP_OFFSET = 80;            // 避开顶部信息栏
const EDGE_PADDING = 40;          // 距边缘最小距离
let ballIdCounter = 0;

// ============== DOM 引用 ==============
const $score       = document.getElementById('score');
const $time        = document.getElementById('time');
const $gameArea    = document.getElementById('game-area');
const $startBtn    = document.getElementById('start-btn');
const $startScreen = document.getElementById('start-screen');
const $ballsCont   = document.getElementById('balls-container');
const $endModal    = document.getElementById('end-modal');
const $finalScore  = document.getElementById('final-score');
const $restartBtn  = document.getElementById('restart-btn');
const $body        = document.body;

// ============== 显示更新 ==============
function updateScoreDisplay() {
    $score.textContent = gameState.score;
}

function updateTimeDisplay() {
    $time.textContent = gameState.timeLeft;
    if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
        $time.parentElement.classList.add('warning');
    } else {
        $time.parentElement.classList.remove('warning');
    }
}

// ============== 倒计时 ==============
function startCountdown() {
    gameState.timerId = setInterval(() => {
        gameState.timeLeft--;
        updateTimeDisplay();
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function stopCountdown() {
    if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }
}

// ============== 位置计算 ==============
function getRandomPosition() {
    const area = $gameArea.getBoundingClientRect();

    const minX = EDGE_PADDING;
    const maxX = area.width - EDGE_PADDING;
    const minY = TOP_OFFSET + EDGE_PADDING;
    const maxY = area.height - EDGE_PADDING;

    // 最多尝试 50 次找不重叠位置
    for (let attempt = 0; attempt < 50; attempt++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);

        let ok = true;
        for (const ball of gameState.balls) {
            const dx = x - ball.x;
            const dy = y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MIN_DISTANCE) {
                ok = false;
                break;
            }
        }
        if (ok) return { x, y };
    }

    // 兜底：放弃距离检查
    return {
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY)
    };
}

// ============== 小球创建 ==============
function spawnSingleBall() {
    const { x, y } = getRandomPosition();
    const id = ++ballIdCounter;

    const el = document.createElement('div');
    el.className = 'ball';
    el.dataset.id = id;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.addEventListener('click', (e) => {
        e.stopPropagation();
        handleBallClick(el, id);
    });

    $ballsCont.appendChild(el);

    const ballData = { id, x, y, element: el };
    gameState.balls.push(ballData);
    return ballData;
}

function spawnBalls(count) {
    for (let i = 0; i < count; i++) {
        spawnSingleBall();
    }
}

// ============== 小球清除 ==============
function removeBallById(id) {
    const idx = gameState.balls.findIndex(b => b.id === id);
    if (idx === -1) return;

    const ball = gameState.balls[idx];
    ball.element.classList.add('hit');

    setTimeout(() => {
        if (ball.element.parentNode) {
            ball.element.parentNode.removeChild(ball.element);
        }
    }, 300);

    gameState.balls.splice(idx, 1);
}

function clearAllBalls() {
    for (const ball of [...gameState.balls]) {
        ball.element.remove();
    }
    gameState.balls = [];
}

// ============== 得分浮字 ==============
function spawnScorePopup(clientX, clientY, text, color) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.color = color;

    const areaRect = $gameArea.getBoundingClientRect();
    popup.style.left = `${clientX - areaRect.left}px`;
    popup.style.top  = `${clientY - areaRect.top}px`;

    $ballsCont.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
}

// ============== 背景闪红 ==============
function flashRed() {
    $body.classList.add('flash-red');
    setTimeout(() => $body.classList.remove('flash-red'), 200);
}

// ============== 点击小球（命中路径） ==============
function handleBallClick(element, id) {
    if (!gameState.isPlaying) return;

    // 加 2 分
    gameState.score += 2;
    updateScoreDisplay();

    // +2 浮字
    const rect = element.getBoundingClientRect();
    spawnScorePopup(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        '+2',
        '#4CAF50'
    );

    // 该小球消失 → 单独刷新 1 个新小球
    removeBallById(id);
    spawnSingleBall();
}

// ============== 点击空白（扣分路径） ==============
function handleBackgroundClick() {
    if (!gameState.isPlaying) return;

    // 扣 1 分（下限 0）
    gameState.score = Math.max(0, gameState.score - 1);
    updateScoreDisplay();

    // 背景闪红
    flashRed();

    // 全部 3 个小球立即刷新
    clearAllBalls();
    spawnBalls(3);
}

// ============== 游戏状态机 ==============
function startGame() {
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isPlaying = true;
    gameState.balls = [];

    updateScoreDisplay();
    updateTimeDisplay();
    $startScreen.classList.add('hidden');
    $endModal.classList.add('hidden');
    $gameArea.classList.add('playing');

    spawnBalls(3);
    startCountdown();
}

function endGame() {
    stopCountdown();
    gameState.isPlaying = false;
    clearAllBalls();
    $gameArea.classList.remove('playing');
    showEndModal();
}

function showEndModal() {
    $finalScore.textContent = gameState.score;
    $endModal.classList.remove('hidden');
}

// ============== 事件绑定 ==============
$startBtn.addEventListener('click', startGame);
$restartBtn.addEventListener('click', startGame);
$gameArea.addEventListener('click', handleBackgroundClick);
