# 网页抓小球小游戏 — 实现计划

> **Superpowers:** writing-plans

**Goal:** 构建一款 30 秒限时的点击得分小游戏，纯原生 HTML + CSS3 + JavaScript 实现。

**Architecture:** 单页应用，3 个文件。HTML 提供语义化骨架（固定顶部信息栏 + 居中开始按钮容器 + 弹窗遮罩 + 小球容器）。CSS 负责 Flexbox 布局、浅黄色背景、小球蓝色圆形样式、以及 5 组 keyframes 动画。JavaScript 维护 `gameState` 对象驱动状态机（初始→游戏中→结束），用 `setInterval` 做倒计时，用 DOM 操作生成/移除小球，用 `stopPropagation` 区分命中 vs 空白点击两条路径。

**Tech Stack:** HTML5, CSS3 (keyframes, Flexbox), 原生 JavaScript ES6+（无任何依赖）

---

## 文件清单

| 文件 | 动作 | 说明 |
|---|---|---|
| `index.html` | 新建 | 语义化骨架 |
| `style.css` | 新建 | 全部样式 + 动画 |
| `script.js` | 新建 | 全部游戏逻辑 |

---

### Task 1: HTML 骨架

**目标**: 搭建页面结构，无小球，只显示信息栏 + 开始按钮 + 弹窗（隐藏状态）。

**Files:**
- Create: `index.html`

**Step 1: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎯 抓小球小游戏</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="page-bg">

    <!-- 顶部信息栏 -->
    <header class="top-bar">
        <div class="score-display">分数：<span id="score">0</span></div>
        <div class="time-display">剩余：<span id="time">—</span></div>
    </header>

    <!-- 游戏区域（小球容器 + 背景点击目标） -->
    <main id="game-area" class="game-area">
        
        <!-- 初始开始按钮 -->
        <div id="start-screen" class="start-screen">
            <button id="start-btn" class="btn btn-primary">🎮 开始游戏</button>
        </div>

        <!-- 小球将动态插入这里 -->
        <div id="balls-container" class="balls-container"></div>
    </main>

    <!-- 游戏结束弹窗（默认隐藏） -->
    <div id="end-modal" class="modal-overlay hidden">
        <div class="modal-content">
            <h2>⏱ 时间到！</h2>
            <p class="final-score">最终得分：<span id="final-score">0</span> 分</p>
            <button id="restart-btn" class="btn btn-primary">🔄 再来一局</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

**Step 2: 验证** — 用浏览器打开 `index.html`，应能看到：浅黄色背景 + 顶部空信息栏 + 中央"开始游戏"按钮。无小球。

---

### Task 2: CSS 样式 + 动画

**目标**: 实现 spec 第 5 节的全部视觉设计和第 5.3 节的 5 组动画。

**Files:**
- Create: `style.css`

**Step 1: 创建 style.css**

```css
/* ============== 基础变量 ============== */
:root {
    --bg-color: #FFF9C4;
    --bg-flash: rgba(244, 67, 54, 0.15);
    --ball-color: #2196F3;
    --ball-hover: #1976D2;
    --score-positive: #4CAF50;
    --color-warning: #F44336;
    --bar-bg: #FFFFFF;
    --bar-border: #E0E0E0;
    --btn-primary: #2196F3;
    --btn-primary-hover: #1976D2;
    --text-main: #333;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-main);
    overflow: hidden;
}

/* ============== 页面背景 ============== */
.page-bg {
    background-color: var(--bg-color);
    min-height: 100vh;
}

/* 扣分时背景闪红 */
.page-bg.flash-red {
    background-color: var(--bg-flash);
    transition: background-color 0s;
}

/* ============== 顶部信息栏 ============== */
.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: var(--bar-bg);
    border-bottom: 2px solid var(--bar-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    z-index: 100;
}

.score-display, .time-display {
    font-size: 20px;
    font-weight: bold;
}

.time-display.warning {
    color: var(--color-warning);
    animation: pulse-warning 0.5s infinite alternate;
}

@keyframes pulse-warning {
    from { opacity: 1; }
    to   { opacity: 0.6; }
}

/* ============== 游戏区域 ============== */
.game-area {
    margin-top: 60px; /* 避开固定顶部栏 */
    width: 100vw;
    height: calc(100vh - 60px);
    position: relative;
    cursor: default;
}

.game-area.playing {
    cursor: crosshair; /* 游戏中鼠标变十字准星 */
}

/* ============== 开始按钮容器 ============== */
.start-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
}

.hidden {
    display: none !important;
}

/* ============== 按钮 ============== */
.btn {
    padding: 16px 40px;
    font-size: 20px;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
}

.btn-primary {
    background-color: var(--btn-primary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--btn-primary-hover);
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(33, 150, 243, 0.4);
}

.btn-primary:active {
    transform: scale(0.98);
}

/* ============== 小球容器 ============== */
.balls-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* 让背景点击穿透到 game-area */
}

.ball {
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--ball-color);
    cursor: pointer;
    pointer-events: auto; /* 小球恢复可点击 */
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.35);
    animation: ball-appear 0.3s ease-out;
    /* transform: translate(-50%, -50%) 在 JS 中设置 */
}

.ball:hover {
    background-color: var(--ball-hover);
}

/* 小球出现动画 */
@keyframes ball-appear {
    from {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

/* 小球消失动画（命中时） */
@keyframes ball-disappear {
    from {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    to {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
}

.ball.hit {
    animation: ball-disappear 0.3s ease-in forwards;
    pointer-events: none;
}

/* ============== 得分浮字 ============== */
.score-popup {
    position: absolute;
    font-size: 28px;
    font-weight: bold;
    color: var(--score-positive);
    pointer-events: none;
    animation: score-float 0.8s ease-out forwards;
    z-index: 200;
    text-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

@keyframes score-float {
    from {
        transform: translate(-50%, -50%) translateY(0);
        opacity: 1;
    }
    to {
        transform: translate(-50%, -50%) translateY(-60px);
        opacity: 0;
    }
}

/* ============== 结束弹窗 ============== */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: modal-fade-in 0.3s ease-out;
}

@keyframes modal-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.modal-content {
    background: white;
    padding: 40px 60px;
    border-radius: 16px;
    text-align: center;
    animation: modal-zoom 0.3s ease-out;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

@keyframes modal-zoom {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
}

.modal-content h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.final-score {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
    color: var(--btn-primary);
}
```

**Step 2: 验证** — 用浏览器打开 `index.html`，检查样式：浅黄色背景、固定顶部信息栏、中央蓝色大按钮、悬停效果。

---

### Task 3: 游戏逻辑骨架（状态机 + 倒计时 + 分数）

**目标**: 实现核心状态机和计时器，不涉及小球。

**Files:**
- Create: `script.js`

**Step 1: 创建 script.js 第一部分**

```javascript
'use strict';

// ============== 全局状态 ==============
const gameState = {
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    timerId: null,
    balls: []   // [{ id, x, y, element }]
};

// ============== DOM 引用 ==============
const $score      = document.getElementById('score');
const $time       = document.getElementById('time');
const $gameArea   = document.getElementById('game-area');
const $startBtn   = document.getElementById('start-btn');
const $startScreen= document.getElementById('start-screen');
const $ballsCont  = document.getElementById('balls-container');
const $endModal   = document.getElementById('end-modal');
const $finalScore = document.getElementById('final-score');
const $restartBtn = document.getElementById('restart-btn');
const $body       = document.body;

// ============== 倒计时 / 分数显示 ==============
function updateScoreDisplay() {
    $score.textContent = gameState.score;
}

function updateTimeDisplay() {
    $time.textContent = gameState.timeLeft;
    // < 10 秒红色警示
    if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
        $time.parentElement.classList.add('warning');
    } else {
        $time.parentElement.classList.remove('warning');
    }
}

// ============== 倒计时控制 ==============
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

// ============== 游戏状态机 ==============
function startGame() {
    // 重置状态
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isPlaying = true;
    gameState.balls = [];

    // UI 切换
    updateScoreDisplay();
    updateTimeDisplay();
    $startScreen.classList.add('hidden');
    $endModal.classList.add('hidden');
    $gameArea.classList.add('playing');

    // 生成 3 个小球（Task 4 完整实现）
    spawnBalls(3);

    // 启动倒计时
    startCountdown();
}

function endGame() {
    stopCountdown();
    gameState.isPlaying = false;

    // 清除所有小球
    clearAllBalls();

    // 恢复 UI
    $gameArea.classList.remove('playing');

    // 显示结束弹窗
    showEndModal();
}

function showEndModal() {
    $finalScore.textContent = gameState.score;
    $endModal.classList.remove('hidden');
}

function hideEndModal() {
    $endModal.classList.add('hidden');
}

// ============== 事件绑定 ==============
$startBtn.addEventListener('click', startGame);
$restartBtn.addEventListener('click', startGame);

// 页面背景点击 —— 扣分路径（Task 5 完整实现）
$gameArea.addEventListener('click', handleBackgroundClick);
```

**Step 2: 验证** — 打开浏览器，点击"开始游戏"后：开始按钮消失、倒计时从 30 开始递减、< 10 秒时红字警示。30 秒后弹窗出现、显示分数 0、点"再来一局"可重开。

---

### Task 4: 小球生成（随机位置 + 互不重叠）

**目标**: 实现 `spawnBalls`、`spawnSingleBall`、`getRandomPosition`、`clearAllBalls`。

**Files:**
- Modify: `script.js`（追加小球生成函数）

**Step 1: 在 script.js 中追加以下函数**

```javascript
// ============== 小球常量 ==============
const BALL_SIZE = 60;           // 小球直径（px）
const MIN_DISTANCE = BALL_SIZE; // 两球最小间距（避免重叠）
const TOP_OFFSET = 80;          // 避开顶部信息栏
const EDGE_PADDING = 40;        // 小球中心距边缘最小距离

let ballIdCounter = 0;

// ============== 位置计算 ==============
function getRandomPosition() {
    const area = $gameArea.getBoundingClientRect();

    const minX = EDGE_PADDING;
    const maxX = area.width - EDGE_PADDING;
    const minY = TOP_OFFSET + EDGE_PADDING;
    const maxY = area.height - EDGE_PADDING;

    // 尝试最多 50 次找到不重叠的位置
    for (let attempt = 0; attempt < 50; attempt++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);

        // 检查与现有小球的距离
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

    // 兜底：放弃距离检查，直接返回
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    return { x, y };
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
    el.style.transform = 'translate(-50%, -50%)';

    // 绑定点击
    el.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡到背景
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
    ball.element.classList.add('hit'); // 触发缩小消失动画
    // 动画结束后从 DOM 移除
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
```

**Step 2: 验证** — 点击开始按钮后，页面中出现 3 个蓝色小球，位置随机且互不重叠、不在顶部信息栏下面。

---

### Task 5: 点击处理（命中 + 空白 双路径）

**目标**: 实现得分、扣分、刷新、背景闪红、+2 浮字。

**Files:**
- Modify: `script.js`（追加点击处理函数）

**Step 1: 在 script.js 中追加以下函数**

```javascript
// ============== 点击小球（命中路径） ==============
function handleBallClick(element, id) {
    if (!gameState.isPlaying) return;

    // 加 2 分
    gameState.score += 2;
    updateScoreDisplay();

    // 弹出 +2 浮字
    const rect = element.getBoundingClientRect();
    spawnScorePopup(rect.left + rect.width / 2, rect.top + rect.height / 2, '+2', '#4CAF50');

    // 该小球消失 → 该位置单独刷新 1 个新小球
    removeBallById(id);
    spawnSingleBall(); // 补一个新球（spec 4.3.4 命中路径）
}

// ============== 点击空白（扣分路径） ==============
function handleBackgroundClick() {
    if (!gameState.isPlaying) return;

    // 扣 1 分（下限 0）
    gameState.score = Math.max(0, gameState.score - 1);
    updateScoreDisplay();

    // 背景闪红
    flashRed();

    // 全部 3 个小球立即刷新（spec 4.3.4 扣分路径）
    clearAllBalls();
    spawnBalls(3);
}

// ============== +2/-1 浮字 ==============
function spawnScorePopup(clientX, clientY, text, color) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.color = color;
    // 位置：相对于 game-area 容器
    const areaRect = $gameArea.getBoundingClientRect();
    popup.style.left = `${clientX - areaRect.left}px`;
    popup.style.top  = `${clientY - areaRect.top}px`;
    $ballsCont.appendChild(popup);

    // 动画结束后移除
    setTimeout(() => popup.remove(), 800);
}

// ============== 背景闪红 ==============
function flashRed() {
    $body.classList.add('flash-red');
    setTimeout(() => $body.classList.remove('flash-red'), 200);
}
```

**Step 2: 最终验收** — 浏览器打开 `index.html`，逐条跑 spec 第 10 节验收清单的 14 项。

---

## 验收清单（映射到 spec 第 10 节）

| # | 验收项 | 对应 Task |
|---|---|---|
| 1 | 初始只显示开始按钮，无小球 | Task 1 + 2 |
| 2 | 点击开始 → 30s 倒计时 + 3 个小球 | Task 3 + 4 |
| 3 | 小球 60px 蓝色实心圆、互不重叠 | Task 4 + style.css |
| 4 | 点中小球 +2、缩放消失、+2 浮字 | Task 5 |
| 5 | 命中后该球单独刷新 | Task 5 `spawnSingleBall` |
| 6 | 点空白 -1（不低于 0）、背景闪红 | Task 5 `handleBackgroundClick` |
| 7 | 点空白后全部 3 球刷新 | Task 5 |
| 8 | 顶部实时显示分数和剩余时间 | Task 3 |
| 9 | 倒计时 < 10 秒变红 | Task 3 `updateTimeDisplay` |
| 10 | 归零后弹窗显示最终分数 | Task 3 `endGame` |
| 11 | 弹窗有"再来一局"按钮 | Task 1 HTML + Task 3 绑定 |
| 12 | 重开后分数/倒计时重置 | Task 3 `startGame` |
| 13 | 动画符合 5.3 节规格 | Task 2 style.css |
| 14 | 1280×720 和 1920×1080 均可玩 | Task 4 `getRandomPosition` |
