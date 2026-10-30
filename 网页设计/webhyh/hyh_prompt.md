# HYH 提示词日志

> 本文件自动追加，绝不手动覆盖。每条提示词在执行任务之前记录。

---
### 提示词日志 #1

- **时间**: 2026-10-23 00:00:00
- **模型**: Trae (AI Assistant)
- **任务类型**: 规则设置
- **提示词内容**:

设置规则：从现在开始，所有CSS类名，id名、js变量都以hyh_开始，所有的提示词都在执行之前写入文件hyh_prompt.md，以附加的方式写入，不覆盖之前的内容，写入的内容包括时间、使用的模型、提示词内容。

---
### 提示词日志 #2

- **时间**: 2026-10-23 13:50:28
- **模型**: Trae (AI Assistant)
- **任务类型**: 规则设置
- **提示词内容**:

设置规则：所有新建的html文件加入超链接入口到首页index.html

---
### 提示词日志 #3

- **时间**: 2026-10-23 13:53:55
- **模型**: Trae (AI Assistant)
- **任务类型**: 编码
- **提示词内容**:

使用当前目录下skills文件夹中的frontend-designskill做两个html网页iconfont-1.html,inconfont-2.html，使得页面具有艺术品牌的样式。分别显示font awesome图标和lucide图标，前者使用字体图标的方式，后者使用svg的方式，相关的cdn文件下载到本目录下的cdn目录。

---
### 提示词日志 #4

- **时间**: 2026-10-23 14:19:29
- **模型**: Trae (AI Assistant)
- **任务类型**: 编码
- **提示词内容**:

根据font目录中的iconfont图标完成移动端的固定的自适应宽度的下导航，导航项目包括4个，完成html网页的设计，网页名称iconfont-3.html和iconfont-4.html分别使用字体图标和svg，包括右上角的数字徽章和红点。

---
### 提示词日志 #5

- **时间**: 2026-10-23 14:29:33
- **模型**: Trae (AI Assistant)
- **任务类型**: 规则/技能创建
- **提示词内容**:

创建skill:提交项目：使用git commit并push到gitee仓库，
 gitee私人令牌93d6574c3d4230e65b90be4a9c9e6f50；
 仓库地址:: `https://gitee.com/neusoft_wangyao_jsj/webhyh1.git，` （把上面两处红色内容，换成你自己的私人令牌和仓库地址）

---
### 提示词日志 #6

- **时间**: 2026-10-23 14:37:58
- **模型**: Trae (AI Assistant)
- **任务类型**: 问答/执行 Git 推送
- **提示词内容**:

提交成功了吗

---
### 提示词日志 #7

- **时间**: 2026-10-24 22:18:50
- **模型**: Trae (AI Assistant)
- **任务类型**: 修改
- **提示词内容**:

底部 TabBar区域的代码，图标均更改为我font文件夹里的代码图标

---
### 提示词日志 #8

- **时间**: 2026-10-24 22:26:59
- **模型**: Trae (AI Assistant)
- **任务类型**: 修改
- **提示词内容**:

搜索长这样（附 iconfont 搜索放大镜图标截图，类名 icon-sousuo）

---
### 提示词日志 #9

- **时间**: 2026-10-24 22:33:31
- **模型**: Trae (AI Assistant)
- **任务类型**: 修改
- **提示词内容**:

卖闲置是这个（附 iconfont 加号图标截图：红底白加号，类名 icon-jia-tianchon...）

---
### 提示词日志 #10

- **时间**: 2026-10-28 14:36:04
- **模型**: DeepSeek-V4.1-Flash (Trae)
- **任务类型**: 编码
- **提示词内容**:

在starter-level1.html代码中加入data.js，完成一下任务，是网页呈现出要求的界面，需完成的功能（5 项）：
班级概览统计：班级人数、总分、平均分、及格率 → 写入 4 张统计卡
学生卡片列表渲染：遍历数据生成卡片（头像 / 五科分数 / 总分均分 / 排名）
不及格预警：筛选有不及格科目的学生，按不及格数排序展示
搜索：按姓名或学号实时过滤
排序：按总分降序 / 按学号升序切换。

---
### 提示词日志 #11

- **时间**: 2026-10-28 14:45:37
- **模型**: DeepSeek-V4.1-Flash (Trae)
- **任务类型**: 修改
- **提示词内容**:

我的卡片要这样的（附学生成绩卡片目标效果截图：金色"第1名"徽章、粉/紫圆形头像、五科浅蓝分数格、虚线分隔、蓝色总分+灰色均分）

---
### 提示词日志 #12

- **时间**: 2026-10-28 14:47:22
- **模型**: DeepSeek-V4.1-Flash (Trae)
- **任务类型**: 编码
- **提示词内容**:

提供 target 参考页源码（学生成绩分析面板·等级二目标效果），要求「做出和这个网站一模一样的网站，功能也要」。

---
### 提示词日志 #13

- **时间**: 2026-10-30 13:36:30
- **模型**: OpenCode (big-pickle)
- **任务类型**: 其他（创建 AGENTS.md）
- **提示词内容**:

Create or update `AGENTS.md` for this repository.

The goal is a compact instruction file that helps future OpenCode sessions avoid mistakes and ramp up quickly. Every line should answer: "Would an agent likely miss this without help?" If not, leave it out.

User-provided focus or constraints (honor these):


## How to investigate

Read the highest-value sources first:
- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config
- existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)
- repo-local OpenCode config such as `opencode.json`

If architecture is still unclear after reading config and docs, inspect a small number of representative code files to find the real entrypoints, package boundaries, and execution flow. Prefer reading the files that explain how the system is wired together over random leaf files.

Prefer executable sources of truth over prose. If docs conflict with config or scripts, trust the executable source and only keep what you can verify.

## What to extract

Look for the highest-signal facts for an agent working in this repo:
- exact developer commands, especially non-obvious ones
- how to run a single test, a single package, or a focused verification step
- required command order when it matters, such as `lint -> typecheck -> test`
- monorepo or multi-package boundaries, ownership of major directories, and the real app/library entrypoints
- framework or toolchain quirks: generated code, migrations, codegen, build artifacts, special env loading, dev servers, infra deploy flow
- repo-specific style or workflow conventions that differ from defaults
- testing quirks: fixtures, integration test prerequisites, snapshot workflows, required services, flaky or expensive suites
- important constraints from existing instruction files worth preserving

Good `AGENTS.md` content is usually hard-earned context that took reading multiple files to infer.

## Questions

Only ask the user questions if the repo cannot answer something important. Use the `question` tool for one short batch at most.

Good questions:
- undocumented team conventions
- branch / PR / release expectations
- missing setup or test prerequisites that are known but not written down

Do not ask about anything the repo already makes clear.

## Writing rules

---
### 提示词日志 #14

- **时间**: 2026-10-30 16:03:01
- **模型**: Trae (AI Assistant)
- **任务类型**: 技能创建
- **提示词内容**:

创建技能skill：提交到github，将本项目提交commit并push到`https://github.com/hyh-24/hyh.git`，使用已设置公钥。强覆盖

Include only high-signal, repo-specific guidance such as:
- exact commands and shortcuts the agent would otherwise guess wrong
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements, environment quirks, and operational gotchas
- references to existing instruction sources that matter

Exclude:
- generic software advice
- long tutorials or exhaustive file trees
- obvious language conventions
- speculative claims or anything you could not verify
- content better stored in another file referenced via `opencode.json` `instructions`

When in doubt, omit.

Prefer short sections and bullets. If the repo is simple, keep the file simple. If the repo is large, summarize the few structural facts that actually change how an agent should work.

If `AGENTS.md` already exists at `/`, improve it in place rather than rewriting blindly. Preserve verified useful guidance, delete fluff or stale claims, and reconcile it with the current codebase.

---
### 提示词日志 #15

- **时间**: 2026-10-30 16:05:00
- **模型**: Trae (AI Assistant)
- **任务类型**: Git 推送执行
- **提示词内容**:

提交到 GitHub

---
### 提示词日志 #16

- **时间**: 2026-10-30 16:12:00
- **模型**: Trae (AI Assistant)
- **任务类型**: Git 推送执行
- **提示词内容**:

提交到github

---
### 提示词日志 #17

- **时间**: 2026-10-30 16:18:00
- **模型**: Trae (AI Assistant)
- **任务类型**: 技能更新（换仓库）
- **提示词内容**:

创建技能skill：提交到github，将本项目提交commit并push到`https://github.com/hyh-24/hyh519.git`，使用已设置公钥。强覆盖

---
### 提示词日志 #18

- **时间**: 2026-10-30 16:20:00
- **模型**: Trae (AI Assistant)
- **任务类型**: Git 推送执行（新仓库 hyh519）
- **提示词内容**:

好的，执行吧

---
### 提示词日志 #19

- **时间**: 2026-10-30 16:23:00
- **模型**: Trae (AI Assistant)
- **任务类型**: 技能创建（重复请求）
- **提示词内容**:

创建技能skill：提交到github，将本项目提交commit并push到`https://github.com/hyh-24/hyh519.git`，使用已设置公钥。强覆盖

---
### 提示词日志 #20

- **时间**: 2026-10-30 16:25:00
- **模型**: Trae (AI Assistant)
- **任务类型**: Git 推送执行
- **提示词内容**:

提交到 github
