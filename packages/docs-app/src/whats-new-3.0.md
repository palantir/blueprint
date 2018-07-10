@# What's new in 3.0

Blueprint 3.0 supports multiple major versions of Blueprint on the same page through removing global styles and deconflicting selectors by changing the namespace. It also restores support for React 15 in most packages.

### Highlights

- The minimum version of React is back to 15.3 or 16.
    - `Portal` will use React 16's `React.createPortal` if available and fall back to `ReactDOM.unstable_renderSubtreeIntoContainer`.

<a class="@ns-button @ns-intent-primary" href="https://github.com/palantir/blueprint/wiki/3.0-Changelog" target="_blank" style="margin-top: 30px;">
    View the full changelog on the wiki
</a>
