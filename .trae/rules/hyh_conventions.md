# HYH 命名规范（强制）

<EXTREMELY_IMPORTANT>
从现在起，本项目所有新编写或修改的代码必须遵守以下命名规则。违反即视为未完成任务。
</EXTREMELY_IMPORTANT>

## CSS 类名和 ID

- 所有 CSS class 必须以 `hyh_` 开头
- 所有 HTML id 必须以 `hyh_` 开头
- 示例：`hyh_btn`、`hyh_score_bar`、`hyh_end_modal`、`hyh_game_area`

## JavaScript 变量和函数

- 所有 `const`、`let`、`var` 声明的变量必须以 `hyh_` 开头
- 所有 `function` 声明的函数名必须以 `hyh_` 开头
- 全局常量也必须以 `hyh_` 开头
- 示例：`hyh_gameState`、`hyh_ballSize`、`hyh_startGame()`、`hyh_getRandomPosition()`

## DOM 引用变量

- 通过 `document.getElementById` / `querySelector` / `$` 获取的 DOM 引用变量，本身的变量名也必须以 `hyh_` 开头
- 示例：`const hyh_scoreEl = document.getElementById('hyh_score')`

## 不适用范围

- 外部库的 API 名称（如 `Math.random`、`setInterval`、`console.log`）
- HTML 标准标签名和属性名
- CSS 标准属性名和值

## 旧代码处理

- 已有代码（本项目首次之前创建的 index.html / style.css / script.js）暂不强制回溯重命名，但**新增或修改这些文件时**必须将涉及的命名同步改为 hyh_ 前缀
- 新增文件从一开始就全部使用 hyh_ 前缀

---

# HYH 提示词日志规则（强制）

<EXTREMELY_IMPORTANT>
在执行任何任务（写代码、改文件、运行命令等）之前，必须先将触发该任务的用户提示词追加写入项目根目录的 `hyh_prompt.md` 文件。
</EXTREMELY_IMPORTANT>

## 写入格式

每次追加一个区块，格式如下：

```
---
### 提示词日志 #[序号]

- **时间**: YYYY-MM-DD HH:mm:ss
- **模型**: Trae (AI Assistant)
- **任务类型**: 编码 / 修改 / 重构 / 调试 / 问答 / 其他
- **提示词内容**:

<用户原始提示词，保持原样>
```

## 规则细节

- 使用**追加模式**（append），绝不覆盖之前的内容
- 时间使用中国标准时间（UTC+8），从系统获取
- 序号自动递增
- 写入时机：在执行任何实质性操作（Write/Edit/Shell/Task 等）**之前**先写入日志
- 如果同一轮对话中用户发送多条提示词，每条都要分别记录

---

# HYH HTML 首页入口规则（强制）

<EXTREMELY_IMPORTANT>
所有新建的 HTML 文件必须加入一个指向首页 `index.html` 的超链接入口。
</EXTREMELY_IMPORTANT>

## 规则细节

- **适用范围**：本项目中所有新建的 `.html` 文件
- **入口位置**：页面显著位置（建议 `<header>` 顶部导航区、右上角、或页面底部 `<footer>`）
- **入口形式**：标准 HTML 超链接 `<a>` 标签，文字建议包含"首页 / 返回首页 / Home"之一
- **路径写法**：使用**相对路径**，从当前新 HTML 文件的位置出发，正确指向 `index.html`
- **样式可选**：可自行设计（如 hyh_ 前缀的 class），但至少能让用户一眼找到并点击

## 示例

```html
<!-- 示例1：右上角小按钮 -->
<a href="../index.html" class="hyh_home_link">🏠 返回首页</a>

<!-- 示例2：顶部导航栏 -->
<nav>
    <a href="index.html" class="hyh_nav_item">首页</a>
    <a href="game.html" class="hyh_nav_item">抓小球游戏</a>
</nav>

<!-- 示例3：页面底部 -->
<footer>
    <a href="./index.html">← 回到首页</a>
</footer>
```

## 例外情况

- 文件本身就是 `index.html` → 不需要再给自己加入口
- 文件是纯组件/模板片段（非完整 HTML 文档）→ 不需要
- 用户明确说明"不需要首页入口" → 可跳过
