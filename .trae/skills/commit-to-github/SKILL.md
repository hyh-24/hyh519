---
name: commit-to-github
description: Commit the current project and push it to git@github.com:hyh-24/hyh.git with the machine's configured SSH key. Use when the user asks to submit work to GitHub, push changes, or sync this workspace with the hyh repository.
---

# Commit and Push to GitHub

Target repository: `git@github.com:hyh-24/hyh.git` (SSH, authenticated by the key already configured on this machine).

## Steps

1. Confirm the workspace root is `c:\Users\HYH\Desktop\网页设计`. Run all git commands with `cwd` set there; never `cd`.
2. Check the repo:
   - `git rev-parse --is-inside-work-tree` — if it fails, run `git init -b main`.
   - `git branch --show-current` — if empty, `git checkout -b main`.
3. Point `origin` at the SSH URL:
   - `git remote get-url origin`; if it is missing run `git remote add origin git@github.com:hyh-24/hyh.git`, if it differs run `git remote set-url origin git@github.com:hyh-24/hyh.git`.
   - Never configure a credential helper or rewrite global git config.
4. Review before staging: `git status` (no `-uall`) and `git diff`. Exclude secrets (`.env`, private keys, tokens) and do not commit them; warn the user instead.
5. Stage the work: `git add -A` at the project root. Check `git status` again for anything unintended.
6. Commit using a HEREDOC message that states why the change was made:

```bash
git commit -m "$(cat <<'EOF'
<type>: <summary>

<optional 1-2 line context>
EOF
)"
```

7. Push: `git push -u origin main`. First push of a fresh repo is fine; never use `--force`.
8. Report the commit hash (`git rev-parse --short HEAD`), branch, and remote URL.

## Troubleshooting

- SSH auth failure: run `ssh -T git@github.com` (expect a greeting, not a shell). Do not switch to HTTPS unless the user asks.
- Non-fast-forward rejection: fetch and integrate (`git pull --rebase origin main`), then push again. Do not force-push.
- Push blocked by sandbox network: retry the push with `dangerouslyDisableSandbox: true`.
- Nothing to commit: report that the working tree is already clean and skip the commit, but still verify whether the branch is ahead of the remote.

## Do not

- Commit unless the user explicitly asked for a commit or push (this skill counts as that request).
- Use `git add -A` blindly after seeing secrets in `git status`.
- Amend existing commits, force-push, or skip hooks.
