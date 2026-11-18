---
name: push-to-github
description: 将当前项目全部变更 git add、commit 并推送到 https://github.com/hyh-24/hyh519.git，使用已配置的 SSH 公钥认证。当用户要求提交代码到 GitHub、push 或同步项目到远程仓库时使用。默认目标固定为 hyh519，不推送到 hyh.git。
---

# Push to GitHub

把当前项目（c:\Users\HYH\Desktop\网页设计\index）的全部变更提交并推送到 GitHub 远程仓库 hyh-24/hyh519。

## 执行步骤

1. 运行 `git status` 查看变更与未跟踪文件。若存在 `.env`、密钥、credentials 等敏感文件，先向用户确认是否提交。
2. 若项目尚无 `.git` 目录，先执行 `git init`。
3. 执行 `git add -A` 暂存全部变更；若第 1 步发现敏感文件，改为逐个添加非敏感文件。
4. 提交，提交信息用一行简短中文说明本次变更。始终用环境变量强制作者身份为 hyh-24（全局配置的 hyh / 126.com 邮箱无法关联 GitHub 账号，禁止修改全局 git config）：

   ```
   $env:GIT_AUTHOR_NAME='hyh-24'; $env:GIT_AUTHOR_EMAIL='hyh-24@users.noreply.github.com'
   $env:GIT_COMMITTER_NAME='hyh-24'; $env:GIT_COMMITTER_EMAIL='hyh-24@users.noreply.github.com'
   git commit -F <信息文件>
   ```

   中文提交信息在 PowerShell 5 下会乱码，先把信息写入 UTF-8 临时文件再用 `git commit -F` 提交，提交完删除临时文件。若没有任何变更且远程已有提交，跳过 commit，直接进入推送。
5. 确保远程地址正确。本机 22 端口不可达，必须使用 443 端口的 SSH（公钥已配置为 hyh-24）：

   ```
   git remote remove origin    # 仅当 origin 已存在但指向其他地址时执行
   git remote add origin ssh://git@ssh.github.com:443/hyh-24/hyh519.git
   ```

6. 推送当前分支：

   ```
   git push -u origin HEAD
   ```

   若远程默认分支为 main 而本地分支为 master，改用 `git push -u origin HEAD:main`。若推送被拒绝（远程有新提交），先 `git pull --rebase origin main` 再推；需要让远端内容与本地一致时，用"以远端 HEAD 为父提交、树替换为本地树"的方式提交后再推，不使用 `--force`。
7. 验证：`git status` 显示分支与 origin 同步、`git log --oneline -1` 显示刚才的提交，即推送成功。

## 项目规范（新建或修改页面时必须遵守）

1. 所有 CSS 类名、CSS 变量名、HTML id、JS 变量一律以 `hyh_` 开头，例如 `hyh_ink`、`--hyh_shell`、`hyh_tabs`。
2. `index.html` 是更早的页面，不要求回溯遵循命名前缀；其余新代码一律遵循。
3. 每个新建 HTML 页面必须在 `index.html` 中加入超链接入口，使用相对路径指向该页面。
4. 新建 HTML 需在 `<!DOCTYPE>` 后写注释块：作者（黄煜涵）、建立时间、使用大模型、功能名称；每个 JS 函数上方用中文注释说明主要功能。

## 约束

- 远程地址固定为 `ssh://git@ssh.github.com:443/hyh-24/hyh519.git`。`git@github.com:...` 形式走 22 端口会连接失败，HTTPS 不可用。
- 本机 shell 为 PowerShell 5，多条命令用 `;` 连接（不支持 `&&`）。
- 不使用 `git push --force`（强推 main 会改写历史）；需要覆盖远端内容时按第 6 步的内容级覆盖做法执行。
- `index/` 仓库的 `origin` 若指向 hyh.git，保持原样，不要顺手同步到 hyh.git。
- 不使用 `--no-verify`、`--no-gpg-sign`；不执行 `git config --global`。
- 不要为凑提交而新建 README 或其他无关文件。
- 推送完成后向用户报告：提交信息、分支名、推送结果。
