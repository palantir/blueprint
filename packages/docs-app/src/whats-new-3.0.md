---
tag: new
---

@# What's new in 3.0

Blueprint 3.0 supports multiple major versions of Blueprint on the same page through removing global styles and deconflicting selectors by changing the namespace. It also restores support for React 15 in most packages.

### Highlights

- The minimum version of React is back to 15.3 or 16.
    - `Portal` will use React 16's `React.createPortal` if available and fall back to `ReactDOM.unstable_renderSubtreeIntoContainer`.
- Change CSS namespace to `bp3-` to avoid conflicts with previous major versions.
- Move styles attached to global selectors to their own CSS classes.
    - Affects `<h1>`-`<h6>`, `<blockquote>`, `<code>`, `<pre>`, `<ol>`, `<ul>`, `<hr>`, `<table>`
    - The above elements do not require classes when used inside a container element with `Classes.RUNNING_TEXT`.
- Allow string literals for enums! `<Button intent="success" />`
- Many new components! Look for the <span class="@ns-tag @ns-intent-success @ns-minimal">new</span> tag in the sidebar.
- Complete refactor of documentation content to focus on React usage and de-emphasize CSS/HTML usage.

<a class="@ns-button @ns-intent-primary" href="https://github.com/palantir/blueprint/wiki/3.x-Changelog" target="_blank" style="margin-top: 30px;">
    View the full changelog on the wiki
</a>
