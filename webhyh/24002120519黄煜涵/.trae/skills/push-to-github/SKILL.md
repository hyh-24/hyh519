---
name: push-to-github
description: Commit this project and push it to the GitHub repository hyh-24/hyh over SSH. Use when the user says 提交到github, commit and push, or asks to push this project to GitHub. Do not use for pull requests or pushing to other remotes.
---

# 提交到 GitHub

将本项目提交 commit 并 push 到 `https://github.com/hyh-24/hyh.git`，使用已配置的 SSH 公钥认证。

## 步骤

1. 检查仓库状态：
   - 运行 `git status` 查看变更文件。
   - 若当前目录不是 git 仓库，运行 `git init` 初始化。

2. 配置远程仓库（使用 SSH 地址，利用已设置的公钥）：
   - 运行 `git remote -v` 检查是否已有 `origin`。
   - 若无 `origin`，执行 `git remote add origin git@github.com:hyh-24/hyh.git`。
   - 若 `origin` 已存在但地址不对，执行 `git remote set-url origin git@github.com:hyh-24/hyh.git`。

3. 提交变更：
   - 运行 `git status` 和 `git diff` 了解变更内容，参考 `git log` 的提交信息风格。
   - 用具体文件名暂存（避免 `git add -A` 误加敏感文件），例如 `git add <file1> <file2>`。
   - 根据变更内容生成简洁的中文 commit message，用 HEREDOC 提交。
   - 若无任何变更，告知用户并停止，不创建空提交。

4. 推送：
   - 先确认当前分支名 `git branch --show-current`；若远程尚未有该分支，执行 `git push -u origin <branch>`。
   - 否则直接 `git push`。
   - 若 push 被拒（远程有新提交），先 `git pull --rebase origin <branch>` 再 push，并向用户说明。

5. 完成后运行 `git status` 确认工作区干净，并向用户报告 commit 哈希与推送结果。

## 注意

- 禁止 force push 到 main/master，禁止跳过 hooks。
- 不要提交疑似包含密钥的文件（如 `.env`、私钥）。
- SSH 公钥已由用户事先配置好，不要修改 git config 或 SSH 配置；若 SSH 认证失败，提示用户检查 `ssh -T git@github.com` 的连通性。
