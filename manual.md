
- [User Manual](#user-manual)
  - [Using bundled libraries from interpreter code](#using-bundled-libraries-from-interpreter-code)
  - [Why](#why)
  - [What's reachable from user code](#whats-reachable-from-user-code)
  - [Using jQuery or Underscore from your own code](#using-jquery-or-underscore-from-your-own-code)
  - [Practical implication](#practical-implication)
- [Knowledge Base](#knowledge-base)
  - [UMD wrappers and AMD modules](#umd-wrappers-and-amd-modules)


# User Manual

## Using bundled libraries from interpreter code

This page is bundled with three third-party libraries — **jQuery**, **Underscore.js**, and **RequireJS** — loaded as plain inline `<script>` blocks (see [README.md](README.md) and [ip-advisory.md](ip-advisory.md) for licensing). This note answers a narrower question: can code typed into the interpreter's textarea actually call into them at runtime?

**Short answer: yes**, for all three.

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
| `$` / `jQuery` | jQuery 1.11.1 | ✅ | `$("body").css("background","red")` |
| `_` | Underscore.js 1.7.0 | ✅ | `_.map([1,2,3], x => x*2)` |
| `require` / `define` / `requirejs` | RequireJS 2.1.15 | ✅ (declared, but no modules registered) | `typeof require // "function"` |

RequireJS's [UMD wrapper](#umd-wrappers-and-amd-modules) declares `var requirejs, require, define;` at global scope, so the names exist and are callable — but since nothing in this page registers [AMD modules](#umd-wrappers-and-amd-modules) via `define()`, there's nothing meaningful for the end user to `require()` out of the box.

## Using jQuery or Underscore from your own code

The interpreter's own code only calls into jQuery (for DOM selection and the `setSelection`/`focusEnd`/`insertAtCursor` plugin methods) — it never calls Underscore. That doesn't matter for you as a user: both libraries are fully loaded and reachable from the textarea regardless of whether `index.html`'s own logic happens to use them.

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
