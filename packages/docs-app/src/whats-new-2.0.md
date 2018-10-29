@# What's new in 2.0

Blueprint 2.0 features JavaScript API refactors, smaller & more modular packages, and very few changes to the CSS API.

### Highlights

- The minimum version of React is now 16.2.
- The minimum version of TypeScript for the declaration files is now 2.3.
- `Portal` now uses React 16's built-in Portal functionality instead of `ReactDOM.unstable_renderSubtreeIntoContainer`.
- `Icon` now renders SVG elements and is used in all Blueprint components.
    - This also means that you can _provide your own SVG icons for all components_.
    - Support for the icon font remains, but will be removed in the next major version.
- Icon styles and fonts have moved to a new **@blueprintjs/icons** package
    - Core depends on this package, so you will have to import its CSS alongside `blueprint.css`
- `Popover2` is now the default `Popover`. It uses [Popper.js](https://popper.js.org/) instead of [Tether](http://tether.io/), which provides much better auto-positioning capabilities and solves a number of outstanding bugs out-of-the-box.
- All Labs components (in `@blueprintjs/labs`) have been moved into separate packages so that you no longer have to deal with the `0.x` version range for many components that are used widely in production.

<a class="@ns-button @ns-intent-primary" href="https://github.com/palantir/blueprint/wiki/What's-new-in-Blueprint-2.0" target="_blank" style="margin-top: 30px;">
    View the full changelog on the wiki
</a>
