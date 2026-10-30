# AGENTS.md

Static classroom site: plain HTML/CSS/JS with no build system, package manager, tests, lint, or typecheck. Do not invent npm scripts. Git remote is Gitee (`neusoft_wangyao_jsj/webhyh1`, branch `master`); deployment is Netlify.

## Layout and entrypoints

- Root `index.html` + `style.css` + `script.js`: the 30-second "抓小球" game. `spec.md` is the functional spec; `implementation-plan.md` is the build plan.
- `24002120519黄煜涵/index.html`: student portfolio and the directory Netlify actually publishes. It is not the root game, despite the identical filename.
- `target.html`: reference answer for the student grade panel. `starter-level1.html` / `starter-level2.html`: exercise templates loading `data.js` (`window.STUDENTS`, `window.SUBJECTS`). Do not rewrite `target.html` unless asked.
- `iconfont-*.html`: icon demos using vendored assets under `cdn/` (Font Awesome, Lucide) and `font2/`. Keep assets local; do not introduce external CDN URLs.
- `README*.md` are untouched Gitee boilerplate; ignore them.

## Commands

- Preview from repo root: `python -m http.server 8000`, then open `http://localhost:8000/`. Opening files directly also works.
- Verification is manual in a browser (against `spec.md` section 10 or `target.html`); there is no automated check.
- Git push workflow: `.trae/rules/skills/git-push-gitee/SKILL.md`. Commit/push only when asked; never commit the Gitee token.

## Mandatory conventions

Source of truth: `.trae/rules/hyh_conventions.md`. Read it before editing.

- Prefix new CSS classes, HTML ids, JS variables/functions, and DOM-reference variables with `hyh_` (e.g. `hyh_btn`, `hyh_startGame`). Root game code is legacy and unprefixed; rename identifiers you touch there.
- Before substantive edits, append the triggering user prompt to `hyh_prompt.md` in its numbered block format. Append only; never overwrite.
- Every new full HTML page needs a relative link back to root `index.html` (except `index.html` itself).
- UI copy is Chinese; keep `<html lang="zh-CN">` and UTF-8.

## Gotchas

- `netlify.toml` publishes `24002120519黄煜涵` and redirects `/` to `/index.html.html`, but that file is currently deleted in the worktree. Reconcile before deploying or the deployed root will 404.
- Paths contain Chinese characters; quote them. In PowerShell use `-LiteralPath`. Console mojibake does not necessarily mean file corruption; verify encoding before rewriting.
- Keep script order: `data.js` must load before the starter/target inline scripts that use its globals.
