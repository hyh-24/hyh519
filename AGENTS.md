# AGENTS.md

本项目是纯静态课堂网站：使用原生 HTML/CSS/JS，没有构建系统、包管理器、测试、Lint 或类型检查。不要编造 npm 脚本。Git 远端是 Gitee（`neusoft_wangyao_jsj/webhyh1`，分支 `master`）；部署平台是 Netlify。

## 布局与入口

- 根目录的 `index.html` + `style.css` + `script.js`：30 秒"抓小球"游戏。`spec.md` 是功能规格说明，`implementation-plan.md` 是构建计划。
- `24002120519黄煜涵/index.html`：学生作品集，也是 Netlify 实际发布的目录。虽然文件名相同，但它不是根目录的游戏页面。
- `target.html`：学生成绩面板的参考答案。`starter-level1.html` / `starter-level2.html`：练习模板，加载 `data.js`（`window.STUDENTS`、`window.SUBJECTS`）。除非被要求，否则不要改写 `target.html`。
- `iconfont-*.html`：图标演示，使用 `cdn/`（Font Awesome、Lucide）和 `font2/` 下的本地资源。保持资源本地化，不要引入外部 CDN 链接。
- `README*.md` 是 Gitee 的原始模板文件，忽略即可。
- `index/` 是一个**独立的 git 仓库**（Swiper 轮播课堂任务，origin 指向 `hyh-24/hyh.git`，只读不推）。实际推送目标是远端 `hyh519` → `ssh://git@ssh.github.com:443/hyh-24/hyh519.git`。包含 `swiper-task.html`（课堂任务一~四 + 加分项）和 `swiper-prompt-task.html`（任务一提示词工程师）。本地 Swiper 库在 `index/swiper/` 下 —— 直接用它，不要从 CDN 重新下载。

## 命令

- 在仓库根目录预览：`python -m http.server 8000`，然后打开 `http://localhost:8000/`。直接用浏览器打开文件也可以。
- 验证方式是在浏览器中手动检查（对照 `spec.md` 第 10 节或 `target.html`），没有自动化检查。
- Git 推送流程：见 `.trae/rules/skills/git-push-gitee/SKILL.md`。只有在被要求时才提交/推送；永远不要提交 Gitee token。

## 强制约定

规则来源：`.trae/rules/hyh_conventions.md`。编辑前先阅读。

- 新增的 CSS 类名、HTML id、JS 变量/函数、DOM 引用变量都必须以 `hyh_` 开头（例如 `hyh_btn`、`hyh_startGame`）。根目录的游戏代码是历史遗留，没有前缀；你在其中修改的标识符要重命名。
- **提示词日志（强制）**：**用户发送的每一条提示词都必须追加到 `hyh_prompt.md`**，无论是否触发代码编辑（包括问答、确认、闲聊等所有消息）。在执行任何操作之前先记录。格式为编号区块，只追加不覆盖。格式：

  ```
  ---
  ### 提示词日志 #[序号]

  - **时间**: YYYY-MM-DD HH:mm:ss
  - **模型**: Trae (AI Assistant)
  - **任务类型**: 编码 / 修改 / 重构 / 调试 / 问答 / 其他
  - **提示词内容**:

  <用户原始提示词，保持原样>
  ```

  序号自动递增；使用中国时间（UTC+8）。每轮对话中的每条用户消息单独成块，**不得遗漏任何一条用户输入**。
- 每个新建的完整 HTML 页面都需要有一个指回根目录 `index.html` 的相对链接（`index.html` 本身除外）。
- 每个新建的 HTML 文件必须在 `<!DOCTYPE>` 之后紧跟一个头部注释块，包含：黄煜涵、建立时间（YYYY-MM-DD）、使用大模型、功能名称。例如：

```html
<!--
  作者：黄煜涵
  建立时间：2026-11-04
  使用大模型：DeepSeek-V4.1-Flash
  功能名称：抓小球游戏
-->
```

- 每个 JS 函数上方必须有注释说明其主要功能（中文，一到两行），例如 `// 开始游戏：重置分数与计时，并在随机位置生成小球`。
- 界面文案用中文；保持 `<html lang="zh-CN">` 和 UTF-8 编码。

## 注意事项

- `netlify.toml` 发布的是 `24002120519黄煜涵` 目录，并把 `/` 重定向到 `/index.html.html`，但该文件目前在工作区中已被删除。部署前要处理好，否则部署后的根路径会 404。
- 路径包含中文字符，使用时要加引号。在 PowerShell 中用 `-LiteralPath`。控制台出现乱码不一定意味着文件损坏，重写前先确认编码。
- 保持脚本加载顺序：`data.js` 必须在使用其全局变量的 starter/target 内联脚本之前加载。
