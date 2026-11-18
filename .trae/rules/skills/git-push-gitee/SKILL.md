# git-push-gitee

> 用于将本地项目通过 Git 提交并推送到 Gitee 远程仓库（使用私人令牌鉴权）。

## 使用场景

- 用户说"提交项目"、"推送代码"、"commit 并 push 到 Gitee"
- 用户提供了 Gitee 私人令牌（personal access token）和仓库地址

## 配置占位符（使用前替换）

```
<YOUR_GITEE_TOKEN>      → 你的 Gitee 私人令牌（在 Gitee → 设置 → 私人令牌 生成）
<YOUR_GITEE_REPO_URL>   → 你的 Gitee 仓库克隆地址，格式：https://gitee.com/<用户名>/<仓库名>.git
<YOUR_GITEE_USERNAME>   → 你的 Gitee 用户名
<YOUR_COMMIT_MSG>       → 提交信息，建议格式：feat: 描述 或 fix: 描述
```

---

## 完整流程（Windows PowerShell）

按顺序执行，**一条一条跑**（PowerShell 5 不支持 `&&`）：

### Step 1: 检查/初始化仓库

```powershell
# 1a. 先检查当前目录是否已经是 git 仓库
git rev-parse --is-inside-work-tree

# 如果返回 "fatal: not a git repository"，执行 1b；否则跳到 Step 2
```

```powershell
# 1b. 初始化新仓库（仅第一次）
git init
```

### Step 2: 配置 Git 用户（仅第一次，或邮箱被 Gitee hook 拒绝时）

```powershell
# 使用与 Gitee 账号一致的用户名和邮箱
git config user.name "<YOUR_GITEE_USERNAME>"
git config user.email "<你的邮箱>"
```

⚠️ **重要**：如果推送时报 `Push will publish a hidden email ... hook declined`，说明邮箱隐私受限。解决方法：
- 到 Gitee **设置 → 邮箱** 查看，使用 "隐私邮箱 / noreply 邮箱" 作为 `user.email`
- 或在 Gitee 设置里允许邮箱公开

### Step 3: 关联远程仓库

```powershell
# 3a. 先检查现有 remote
git remote -v
```

```powershell
# 3b. 如果没有 origin，添加（带令牌的 URL 格式）
# 格式：https://<用户名>:<令牌>@gitee.com/<用户名>/<仓库名>.git
git remote add origin https://<YOUR_GITEE_USERNAME>:<YOUR_GITEE_TOKEN>@<YOUR_GITEE_REPO_URL去掉https://后的部分>

# 示例（完整写法）：
# git remote add origin https://myuser:abc123token@gitee.com/myuser/myrepo.git
```

```powershell
# 3c. 如果已有 origin 但地址不对，更新它
git remote set-url origin https://<YOUR_GITEE_USERNAME>:<YOUR_GITEE_TOKEN>@<YOUR_GITEE_REPO_URL_HOST>/<路径>

# 示例：
# git remote set-url origin https://myuser:abc123token@gitee.com/myuser/myrepo.git
```

### Step 4: 添加文件

```powershell
# 4a. 添加所有变更
git add .

# 4b. 如果不想包含某些文件，先创建 .gitignore
# notepad .gitignore
```

### Step 5: 提交

```powershell
git commit -m "<YOUR_COMMIT_MSG>"

# 示例：
# git commit -m "feat: add iconfont-3 and iconfont-4 mobile bottom nav"
# git commit -m "feat: 完成移动端底部导航页面"
```

⚠️ 如果报 `Author identity unknown`，说明 Step 2 的 git config 没设好，回去重设。

### Step 6: 推送

```powershell
# 6a. 首次推送，设置 upstream
git push -u origin master

# 或推 main 分支（Gitee 新仓库默认 main）
git push -u origin main

# 6b. 后续推送
git push
```

⚠️ 如果推送报 `src refspec ... does not match any`：
- 说明还没 commit 过，先执行 Step 5
- 或分支名不对，用 `git branch` 查看当前分支名

⚠️ 如果推送报 `[remote rejected] ... (fetch first)` 或 `non-fast-forward`：
- 远端已有提交，本地没有。执行：
```powershell
git pull origin master --rebase
git push
```
- **除非用户明确授权，否则不要用 `--force` 推送！**

---

## 完整一键脚本（替换占位符后执行）

```powershell
# === 替换以下 5 个占位符 ===
$token   = "<YOUR_GITEE_TOKEN>"
$repoUrl = "<YOUR_GITEE_REPO_URL>"   # 例如 https://gitee.com/user/repo.git
$user    = "<YOUR_GITEE_USERNAME>"
$email   = "<YOUR_GITEE_EMAIL>"
$msg     = "<YOUR_COMMIT_MSG>"
# ===========================

# 提取仓库路径（从 https://gitee.com/user/repo.git 中取出 user/repo.git）
$repoPath = ($repoUrl -replace '^https?://', '') -replace '/\.git$', ''
# 构建带鉴权的 URL
$authUrl = "https://${user}:${token}@${repoPath}"

# 1. init（如需要）
git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) { git init }

# 2. 配置用户
git config user.name $user
git config user.email $email

# 3. 设置远程
$existing = git remote 2>$null
if ($existing -match 'origin') {
    git remote set-url origin $authUrl
} else {
    git remote add origin $authUrl
}

# 4. add + commit
git add .
git commit -m $msg 2>$null

# 5. push
$branch = (git branch --show-current).Trim()
if (-not $branch) { $branch = "master" }
git push -u origin $branch
```

---

## 安全注意事项

| 风险 | 规避 |
|---|---|
| 令牌留在 remote URL 里 | 推送成功后可把 remote URL 改回不带令牌的版本，避免 `git remote -v` 泄露 |
| 令牌出现在 git log | 推送成功后把 token 变量/代码清理干净，不要 commit 含 token 的文件 |
| 邮箱 hook 拒绝 | 提前在 Gitee 设置允许推送邮箱 |
| 覆盖远端历史 | 非必要不要 `--force` |

---

## Gitee 鉴权 URL 格式说明

```
https://<用户名>:<私人令牌>@gitee.com/<用户名>/<仓库名>.git
```

- 用户名 + 令牌拼在 URL 里，Git 会自动用 Basic Auth 鉴权
- 令牌需要有 `projects` / `write_repository` 权限
- 推送成功后如果想清理，执行：
```powershell
git remote set-url origin https://gitee.com/<用户名>/<仓库名>.git
```

---

## Windows PowerShell 常见坑

| 坑 | 解决 |
|---|---|
| `&&` 不支持 | 每条命令分开执行或用 `;` |
| `rm -f` 不支持 | 用 `Remove-Item -Force` |
| PowerShell 执行策略禁止脚本 | 用 `cmd` 包裹或调整 ExecutionPolicy |
| Git 中文乱码 | `git config core.quotepath false` |
