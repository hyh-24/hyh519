---
name: git-push-github
description: 将项目通过 Git 提交并强覆盖推送到 GitHub 远程仓库（使用已配置的 SSH 公钥鉴权）。使用场景：用户说"提交到 github"、"push 到 github"、"提交代码"、"强覆盖推送"。
---

# git-push-github

将本项目 commit 并强覆盖推送到 GitHub 仓库，使用本机已配置的 SSH 公钥完成鉴权，无需手动输入令牌。

## 固定配置

- **远程仓库地址（SSH over 443，已验证可用）**: `ssh://git@ssh.github.com:443/hyh-24/hyh519.git`
- **标准 SSH 端口 22 地址（本环境被防火墙阻止）**: `git@github.com:hyh-24/hyh519.git`
- **远程仓库地址（HTTPS 备选）**: `https://github.com/hyh-24/hyh519.git`
- **推送方式**: `--force` 强覆盖推送（用户明确授权）
- **分支**: 默认使用当前分支；首次推送使用 `-u` 设置 upstream

## 执行流程（Windows PowerShell，逐条执行）

### Step 1: 检查/初始化 Git 仓库

```powershell
git rev-parse --is-inside-work-tree
```

如果返回 `fatal: not a git repository`，执行：

```powershell
git init
```

### Step 2: 配置 Git 用户（如未配置）

```powershell
git config user.name "hyh-24"
git config user.email "hyh-24@users.noreply.github.com"
```

> 使用 GitHub 的 noreply 隐私邮箱，避免暴露真实邮箱。

### Step 3: 关联远程仓库（SSH over 443 方式）

> ⚠️ 本环境网络防火墙阻止了 SSH 22 端口，必须使用 GitHub 官方支持的 **SSH over HTTPS 443** 方案。

```powershell
# 先检查现有 remote
git remote -v
```

**情况 A：没有 origin**

```powershell
git remote add origin ssh://git@ssh.github.com:443/hyh-24/hyh519.git
```

**情况 B：origin 地址不对**

```powershell
git remote set-url origin ssh://git@ssh.github.com:443/hyh-24/hyh519.git
```

### Step 4: 添加文件

```powershell
git add .
```

> 如果项目中有不想提交的文件，请提示用户先创建 `.gitignore`。

### Step 5: 提交

```powershell
git commit -m "feat: update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
```

> 如果报 `Author identity unknown`，回到 Step 2 重新配置用户信息。

### Step 6: 强覆盖推送 ⚠️

```powershell
# 获取当前分支名
$branch = (git branch --show-current).Trim()
if (-not $branch) { $branch = "master" }

# 首次推送用 -u 设置 upstream
git push -u origin $branch --force
```

后续推送（remote 和 upstream 都已设置后）直接：

```powershell
git push --force
```

## 一键脚本（PowerShell）

```powershell
# 1. init（如需要）
git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) { git init }

# 2. 配置用户
git config user.name "hyh-24"
git config user.email "hyh-24@users.noreply.github.com"

# 3. 设置远程（SSH over 443）
$existing = git remote 2>$null
if ($existing -match 'origin') {
    git remote set-url origin ssh://git@ssh.github.com:443/hyh-24/hyh519.git
} else {
    git remote add origin ssh://git@ssh.github.com:443/hyh-24/hyh519.git
}

# 4. add + commit
git add .
git commit -m "feat: update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null

# 5. force push
$branch = (git branch --show-current).Trim()
if (-not $branch) { $branch = "master" }
git push -u origin $branch --force
```

## 常见问题排查

| 报错 | 原因 | 解决 |
|---|---|---|
| `Permission denied (publickey)` | SSH 公钥未配置到 GitHub | 检查 `~/.ssh/` 下是否有 key；运行 `ssh -T git@github.com` 测试 |
| `src refspec ... does not match any` | 还没 commit 过 | 先执行 Step 5 的 commit |
| `fatal: remote origin already exists` | 已有 origin | 用 `git remote set-url origin ssh://git@ssh.github.com:443/hyh-24/hyh519.git` 更新 |
| `Author identity unknown` | 没配 user.name/email | 回到 Step 2 重设 |

## SSH 公钥快速测试

如果 push 时报公钥错误，先确认本机是否有 SSH key：

```powershell
Get-ChildItem ~/.ssh/ -Name
# 查看是否有 id_rsa / id_ed25519 及对应的 .pub
```

查看公钥内容（需要用户手动添加到 GitHub → Settings → SSH and GPG keys）：

```powershell
Get-Content ~/.ssh/id_ed25519.pub
# 或
Get-Content ~/.ssh/id_rsa.pub
```

## 安全说明

- 本技能**不使用令牌**，依赖本机已配置的 SSH 公钥
- `--force` 推送会覆盖远程历史，这是用户明确授权的强覆盖模式
- 推送前会先 `git add .` 和 `git commit`，但不会自动生成 `.gitignore`
- 如果项目有敏感文件，请在执行前提醒用户
