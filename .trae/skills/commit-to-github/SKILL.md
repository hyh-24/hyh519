---
name: commit-to-github
description: Commit the 24002120519黄煜涵 coursework project and push it to github.com/hyh-24/hyh using the configured SSH key, keeping remote and local content identical. Use when the user asks to submit their project or sync it with GitHub.
---

# Commit and Push to GitHub

Target repository: `hyh-24/hyh`. Workspace: `c:\Users\HYH\Desktop\网页设计`.
Submission scope: `webhyh/24002120519黄煜涵/` (all files in it), plus `webhyh/index.html` when that entry page changed.
This machine's network blocks SSH port 22, so the working remote is `ssh://git@ssh.github.com:443/hyh-24/hyh.git` (same repo, SSH over 443, authenticated by the configured ed25519 key).

## Steps

1. Confirm the workspace root is `c:\Users\HYH\Desktop\网页设计`. Run all git commands with `cwd` set there; never `cd`.
2. Check the repo:
   - `git rev-parse --is-inside-work-tree` — if it fails, run `git init -b main`.
   - `git branch --show-current` — if empty, `git checkout -b main`.
3. Point `origin` at the working SSH URL:
   - `git remote get-url origin`; if it is missing run `git remote add origin ssh://git@ssh.github.com:443/hyh-24/hyh.git`, if it differs run `git remote set-url origin ssh://git@ssh.github.com:443/hyh-24/hyh.git`.
   - Never configure a credential helper or rewrite global git config.
4. Review before staging: `git status --short` and `git diff`. Exclude secrets (`.env`, private keys, tokens) and do not commit them; warn the user instead.
5. Stage changes: `git add -A` for deletions too (files the user removed must be recorded), or `git add -A -- <scope>` when only part of the tree changed. Check `git status` again for anything unintended.
6. Commit with a message that states why the change was made. The shell is PowerShell, which has no heredoc — write the message to `.git/hyh_commit_msg.txt` with the Write tool (UTF-8, so Chinese is not mangled), then:

```powershell
git commit -F .git/hyh_commit_msg.txt --quiet; Remove-Item .git/hyh_commit_msg.txt
```

Message shape: `<type>: <summary>` plus 1-2 lines of context, e.g. `feat: 新增学生成绩面板`.

7. Push: `git push -u origin main`. First push of a fresh repo is fine.
8. Report the commit hash (`git rev-parse --short HEAD`), branch, and remote URL.

## Make remote content match local ("强覆盖" requests)

Rewriting `main` is not allowed. Reaching the same end state without changing history:

1. `git fetch origin`, then `git rebase origin/main` so the local branch sits on top of any commits made on GitHub.
2. For remote files that must not exist locally, delete them in the working tree and commit the deletion — the tree now equals the local project.
3. Push normally; the remote file content matches local even though the old commit stays in history.

Tell the user that force-push was replaced by a deletion commit, and that history was preserved.

## Troubleshooting

- SSH auth failure: run `ssh -p 443 -T git@ssh.github.com` (expect a greeting, not a shell). Port 22 is refused on this machine, so always keep the 443 URL. Do not switch to HTTPS unless the user asks.
- Non-fast-forward rejection: fetch and integrate (`git pull --rebase origin main`), then push again. Do not force-push.
- Push blocked by sandbox network: retry the push with `dangerouslyDisableSandbox: true`.
- Nothing to commit: report that the working tree is already clean and skip the commit, but still verify whether the branch is ahead of the remote.

## Do not

- Commit unless the user explicitly asked for a commit or push (this skill counts as that request).
- Use `git add -A` blindly after seeing secrets in `git status`.
- Amend existing commits, force-push, or skip hooks.
