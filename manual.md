
- [User Manual](#user-manual)
  - [Why would anyone use this?](#why-would-anyone-use-this)
  - [Whole-buffer evaluation, not line-oriented](#whole-buffer-evaluation-not-line-oriented)
  - [Output stays inline, at the cursor](#output-stays-inline-at-the-cursor)
  - [Loading Underscore and RequireJS on demand](#loading-underscore-and-requirejs-on-demand)
  - [Using bundled libraries from interpreter code](#using-bundled-libraries-from-interpreter-code)
  - [Why](#why)
  - [What's reachable from user code](#whats-reachable-from-user-code)
  - [Using jQuery or Underscore from your own code](#using-jquery-or-underscore-from-your-own-code)
  - [Practical implication](#practical-implication)
- [Knowledge Base](#knowledge-base)
  - [UMD wrappers and AMD modules](#umd-wrappers-and-amd-modules)


# User Manual

## Why would anyone use this?

Judged against a normal "why would I use this" bar, it's a hard sell:

- **The browser console already does this, better.** DevTools gives you the same `eval`-anything capability, plus real syntax highlighting, autocomplete, a proper call stack on errors, persistent history, object inspection (expandable trees, not stringified output), and no risk of accidentally re-running stale code mixed into your scratch buffer.
- **The whole-buffer-rerun model is actively worse for iteration.** Every `Ctrl+Enter` re-executes everything in the textarea, including all previous output comments and any earlier statements — so side effects (DOM mutations, variable reassignment, console logging) replay every single time. A normal REPL evaluates only the new expression. See [Whole-buffer evaluation, not line-oriented](#whole-buffer-evaluation-not-line-oriented).
- **No persistence, no error recovery mid-script** — one error anywhere in the buffer and everything after it silently doesn't run on that pass.
- **No syntax highlighting, no autocomplete, no line numbers** — it's a bare `<textarea>`.

So why reach for it anyway? The honest reasons are narrow:

1. **Zero-dependency, fully offline, single-file portability.** No DevTools panel to open, no localhost server — this one file can be emailed, dropped on a USB stick, or opened from disk with no network at all, and it works identically on any machine with a browser. That's a real, if niche, value.
2. **Personal/nostalgia tool.** Given the 2014 origin, this reads like a tool built for its author's own use at the time — its value may be sentimental/historical rather than functionally competitive with modern tooling.
3. **Teaching a very specific point** — e.g., demonstrating `eval()`, scope, or showing exactly how little code it takes to build a REPL — where the *simplicity of the source* is the point, not the editing experience.

Bottom line: this is more interesting as a **"look how small this is" artifact** — the name itself admits as much — than as a daily-use tool. It will never beat DevTools on REPL ergonomics; its real edge is offline portability and minimal footprint.

## Whole-buffer evaluation, not line-oriented

`Ctrl+Enter` always evaluates the **entire textarea content** as a single piece of JavaScript — not just the current line, not just a selection. This is a deliberate behavioral attribute of the interpreter, not an oversight:

```js
var dbj_eval = function (expr) {
    try {
        if (! expr || expr == "") return "";
        return eval(expr);
    } catch (x) {
        return x + "";
    }
}
// called as: dbj_eval($editor.val())  — the whole textarea's text
```

Practical consequences:

- The textarea is the program. Every `Ctrl+Enter` re-runs everything currently in it, top to bottom, as one `eval()`.
- Because the buffer keeps growing as you work, and the result of each evaluation is **inserted back into the buffer as a JavaScript comment** (`\t// => <result>`), previous results stay syntactically inert on re-evaluation — they're comments, so they don't interfere with the next `eval()` of the whole buffer. This is precisely why output is appended as a `//` comment rather than shown in a separate panel: it has to remain valid, harmless JavaScript in place, since it's part of what gets re-evaluated every time.
- There is no per-line or per-statement isolation. A syntax error anywhere in the buffer affects the single `eval()` call for the whole thing.
- **Evaluation stops at the first thrown error.** Because the whole buffer runs as one script, JavaScript itself halts execution the instant an uncaught error is thrown — there's no statement-by-statement recovery inside a single `eval()` call. The `try/catch` in `dbj_eval` only catches that one error *after the fact* and returns it as the result text; anything textually after the error-causing point in the buffer simply did not run on that pass. Fix or remove the offending line and re-run with `Ctrl+Enter` to continue past it.

See [Output stays inline, at the cursor](#output-stays-inline-at-the-cursor) for where the result of that whole-buffer evaluation gets written.

## Output stays inline, at the cursor

The result of each whole-buffer evaluation is inserted as a `\t// => <result>` comment directly at the current cursor position — not appended to the end of the buffer. Place the cursor anywhere in the text and press `Ctrl+Enter`; the result lands right there, and the cursor moves to just after the inserted comment.

There is no separate output panel or console. The textarea is simultaneously the input, the program, and the output log — see [Whole-buffer evaluation, not line-oriented](#whole-buffer-evaluation-not-line-oriented) for why output has to take the form of an inert JS comment rather than free text.

## Loading Underscore and RequireJS on demand

Only **jQuery** is loaded unconditionally, inlined directly in `index.html`, because the interpreter's own code depends on it (DOM selection, `setSelection`/`focusEnd`/`insertAtCursor`). **Underscore.js** and **RequireJS** are not used by the page itself — see [Using jQuery or Underscore from your own code](#using-jquery-or-underscore-from-your-own-code) — so they are not loaded by default. Loading them is opt-in, via keyboard shortcut:

| Shortcut | Loads | Source file |
|---|---|---|
| `Alt+1` | Underscore.js 1.7.0 | `underscore-1.7.0.js` |
| `Alt+2` | RequireJS 2.1.15 | `require-2.1.15.js` |

Pressing the shortcut injects a `<script src="...">` tag pointing at the sibling file and reports the outcome as an inline comment at the cursor, the same way evaluation results are reported:

- `// => underscore 1.7.0 loaded` — first successful load
- `// => underscore 1.7.0 already loaded` — pressed again after it's already loaded; no re-fetch, no duplicate script tag
- `// => failed to load underscore 1.7.0 (underscore-1.7.0.js)` — the file could not be fetched

**This only works if `underscore-1.7.0.js` / `require-2.1.15.js` are reachable from wherever `index.html` is being served or opened from** — either alongside it on disk, or on the same GitHub Pages deployment. If `index.html` is copied out and used standalone, without those sibling files, `Alt+1`/`Alt+2` will fail to load (you'll see the "failed to load" comment). jQuery is unaffected by this, since it stays inlined in the page itself regardless.

`Ctrl+1`/`Ctrl+2` were considered for these shortcuts first, but rejected: browsers already bind `Ctrl+1`...`Ctrl+8` to tab switching, so those keys never reach the page. `Alt+1`/`Alt+2` are not claimed by any default browser or OS shortcut on Windows.

## Using bundled libraries from interpreter code

This page is bundled with three third-party libraries — **jQuery**, **Underscore.js**, and **RequireJS** (see [README.md](README.md) and [ip-advisory.md](ip-advisory.md) for licensing) — though, per [Loading Underscore and RequireJS on demand](#loading-underscore-and-requirejs-on-demand), only jQuery loads automatically. This note answers a narrower question: once a library is loaded (automatically for jQuery, on demand via `Alt+1`/`Alt+2` for the other two), can code typed into the interpreter's textarea actually call into it at runtime?

**Short answer: yes**, for all three, once loaded.

## Why

The evaluator (`dbj_eval` in `index.html`) calls a plain, unqualified `eval(expr)`:

```js
var dbj_eval = function (expr) {
    try {
        if (! expr || expr == "") return "";
        return eval(expr);
    } catch (x) {
        return x + "";
    }
}
```

A direct `eval()` call always runs in the **calling function's scope chain** — here, `main_script`'s closure inside `onload`, nested under the page's global `window` scope. None of the three libraries are loaded in `noConflict()` mode or wrapped to hide their globals, so their top-level symbols sit on `window` exactly as a normal script would leave them.

## What's reachable from user code

| Symbol | Source | Reachable? | Example |
|---|---|---|---|
| `$` / `jQuery` | jQuery 1.11.1 | ✅ always (loaded automatically) | `$("body").css("background","red")` |
| `_` | Underscore.js 1.7.0 | ✅ after `Alt+1` | `_.map([1,2,3], x => x*2)` |
| `require` / `define` / `requirejs` | RequireJS 2.1.15 | ✅ after `Alt+2` (declared, but no modules registered) | `typeof require // "function"` |

RequireJS's [UMD wrapper](#umd-wrappers-and-amd-modules) declares `var requirejs, require, define;` at global scope, so the names exist and are callable — but since nothing in this page registers [AMD modules](#umd-wrappers-and-amd-modules) via `define()`, there's nothing meaningful for the end user to `require()` out of the box.

## Using jQuery or Underscore from your own code

The interpreter's own code only calls into jQuery (for DOM selection and the `setSelection`/`focusEnd`/`insertAtCursor` plugin methods) — it never calls Underscore. That doesn't matter for you as a user: once loaded — jQuery automatically, Underscore via `Alt+1` (see [Loading Underscore and RequireJS on demand](#loading-underscore-and-requirejs-on-demand)) — both libraries are fully reachable from the textarea regardless of whether `index.html`'s own logic happens to use them.

So if you already know either library's API, you can use it directly:

```js
// jQuery-savvy user
$("body").css("background", "lightyellow")

// Underscore-savvy user
_.pluck([{n:1},{n:2},{n:3}], "n")   // => [1, 2, 3]
```

In effect, this page is a scratch pad that happens to come pre-loaded with jQuery, Underscore, and RequireJS as available tools — useful precisely because you bring your own knowledge of those libraries' APIs.

## Practical implication

Nothing in this page sandboxes or scopes user input away from the page's own globals or DOM. Anything typed into the textarea runs with the same privileges as the page itself — full DOM access, full access to `$`, `_`, `require`/`define`, and anything else hanging off `window`.

This is fine for a personal, off-line scratch tool. It is **not** an isolation boundary — worth remembering if this page is ever embedded somewhere less trusted (e.g. an iframe fed by untrusted input, or a shared/public deployment where arbitrary users might paste code from elsewhere).


# Knowledge Base 

## UMD wrappers and AMD modules

Two terms used above, defined:

**AMD** — Asynchronous Module Definition. A JavaScript module format from the pre-ES-modules era (popularized roughly 2009–2015) where a file declares its dependencies and body via a `define()` call:

```js
define(["dep-a", "dep-b"], function (depA, depB) {
    return { /* this module's public API */ };
});
```

A loader (RequireJS being the canonical one) reads these `define()` calls, resolves the dependency graph, fetches each module file as needed, and only runs a module's factory function once its dependencies are ready. This is what `require`/`define` were for in 2014-era JS apps that loaded code as separate files, lazily, without a bundler.

**UMD** — Universal Module Definition. A wrapper pattern (not a loader) that lets a *single* file work correctly no matter how it's consumed:

```js
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();      // CommonJS / Node
    } else if (typeof define === "function" && define.amd) {
        define(factory);                 // AMD (e.g. RequireJS)
    } else {
        root.MyLibrary = factory();      // plain <script> tag, attach to window
    }
}(this, function () {
    return /* the actual library */;
}));
```

jQuery, Underscore, and RequireJS itself all ship with some variant of this wrapper, which is exactly why dropping any of them into a plain `<script>` tag — as this page does — works: with no `module` and no AMD `define` already active as this page loads each script, the wrapper falls through to the last branch and attaches the library directly to `window` (`$`, `_`, `requirejs`/`require`/`define`). That `window` attachment is the mechanism behind [What's reachable from user code](#whats-reachable-from-user-code) above.
