---
name: rank-push
description: 仅将本文件夹中的 rank.html 文件 git add、commit 并 push 到 hyh519 远程仓库。当用户要求推送 rank.html、提交到 hyh519 仓库或 push rank 文件时使用。只推送 rank.html，不动其他文件。
---

# Rank Push

只把 rank.html 这一个文件提交并推送到 hyh519 远程仓库（ssh://git@ssh.github.com:443/hyh-24/hyh519.git）。

## 执行步骤

1. 先确认仓库根在本目录（`git rev-parse --show-toplevel` 应等于当前工作目录）。若不一致，停止并提示用户。
2. 检查 rank.html 是否存在（`Test-Path rank.html`）。不存在则停止。
3. 只暂存 rank.html：`git add rank.html`。不要用 `git add -A`。
4. 查看暂存内容：`git diff --cached --name-only`，确认只包含 rank.html。若有其他文件，停止并报告。
5. 提交。中文提交信息先写入 UTF-8 临时文件再用 `git commit -F`（避免 PowerShell 5 下乱码），始终用环境变量强制作者身份为 hyh-24：

   ```powershell
   $env:GIT_AUTHOR_NAME='hyh-24'
   $env:GIT_AUTHOR_EMAIL='hyh-24@users.noreply.github.com'
   $env:GIT_COMMITTER_NAME='hyh-24'
   $env:GIT_COMMITTER_EMAIL='hyh-24@users.noreply.github.com'
   git commit -F <临时文件路径>
   ```

   提交信息格式建议："添加排行榜页面 rank.html"。若没有变更，跳过 commit 直接到推送。
6. 确保远程存在且地址正确：

   ```powershell
   # 若 hyh519 远程已存在且地址正确，跳过这一步
   git remote remove hyh519   # 仅当 hyh519 已存在但指向其他地址时执行
   git remote add hyh519 ssh://git@ssh.github.com:443/hyh-24/hyh519.git
   ```

   本机 22 端口不可达，必须使用 443 端口的 SSH（公钥已配置为 hyh-24）。
7. 推送：`git push --force hyh519 HEAD`。hyh519 远程历史与本仓库不共祖，非 force 无法推送。若远程默认分支为 main 而本地分支为 master，改用 `git push --force hyh519 HEAD:main`。
8. 验证：
   - `git status` 显示工作区干净或仅剩未暂存的其他文件变更
   - `git log --oneline -1 -- rank.html` 显示本次提交
   - 报告：commit hash、分支名、远程 URL、GitHub 提交链接 `https://github.com/hyh-24/hyh519/commit/<hash>`

## 约束

- 远程固定为 `ssh://git@ssh.github.com:443/hyh-24/hyh519.git`，不要改用 HTTPS 或 22 端口。
- 推送时使用 `--force`（hyh519 远程历史与本仓库不共祖，已验证必须 force 才能推送）。
- 只暂存 rank.html，不要 add 其他文件（index.html、js/、tab.html 等不应被带进来）。
- 本机 shell 为 PowerShell 5，多条命令用 `;` 连接（不支持 `&&`）。
- 不执行 `git config --global`，不修改全局 git 配置。
- 推送完成后向用户报告：commit hash、分支名、远程 URL、GitHub 提交链接。
