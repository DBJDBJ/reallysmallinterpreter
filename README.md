# Really Small Off-Line JS Interpreter™

A single self-contained `index.html` page: a textarea-based JavaScript REPL. No build step, no server, no dependencies beyond what's bundled inline.

**Live:** https://dbjdbj.github.io/reallysmallinterpreter/

## Usage

Open `index.html` in a browser (or visit the live link above). Type a JavaScript expression into the editor and press `Ctrl+Enter` to evaluate it. The result is appended inline as a comment.

## Repo layout

- `index.html` — the entire application (markup, inline styles, bundled jQuery/Underscore/RequireJS, eval logic)
- `favicon/` — site favicon set
- `dbj-org-logo.jpg` — DBJ logo
- `ip-advisory.md` — IP / licensing advisory covering DBJ-authored material in this repo

## License

© Dusan B. Jovanovic (dbj@dbj.org). See [ip-advisory.md](ip-advisory.md) for licensing terms.
