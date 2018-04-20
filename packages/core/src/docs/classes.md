@# Classes

Blueprint packages provide React components in JS files and associated styles in a CSS file. Each package exports a `Classes` constants object in JavaScript that contains keys of the form `NAMED_CONSTANT` for every CSS class used. This separation allows us to change CSS classes between versions without breaking downstream users (although in practice this happens very rarely).

**Avoid referencing hardcoded Blueprint class names in your JS or CSS code.**

```tsx
// Don't do this! Avoid hardcoding Blueprint class names.
<button className="@ns-button @ns-large">Don't do this!</button>
```

The **best practice** is to add your own class to an element and then reference that class whenever needed.

```tsx
<Button className="my-custom-class" text="customized button" />
```
```css.scss
.my-custom-class {
    width: 4000px;
}
```

In cases where adding and styling a new class is impractical or undesirable, use the `Classes` constants or `$ns` Sass/Less variable. The `Classes` constants can be particularly useful when writing UI tests.

```tsx
// use Classes constants for forward-compatible custom elements.
import { Classes } from "@blueprintjs/core"
<a className={Classes.MENU_ITEM}>custom menu item</a>
```

```css.scss
// interpolate the $ns variable to generate forward-compatible class names.
// this approach is *not encouraged* as it increases maintenance cost.
@import "~@blueprintjs/core/lib/scss/variables";
.#{$ns}-menu-item {}
```

@## Namespacing

All Blueprint CSS classes begin with a namespace prefix to isolate our styles from other frameworks: `.button` is a very common name, but only Blueprint defines `.@ns-button`.

Beginning with Blueprint 3.0, this namespace will be versioned by major version of the library so two major versions can be used together on a single page. This means the namespace at the beginning of every class _will change in each subsequent major version_. In Blueprint 1.x and 2.x this namespace was `pt-`, but in Blueprint 3.0 it will change to `bp3-` and increase accordingly.

### Custom namespace

The namespace can be changed _at build time_ to produce a custom Blueprint build (though this usage is not recommended and we cannot offer support for it). This requires several things:

1. You must use Sass and import Blueprint Sass source into your app, rather than using the CSS file distributed in the NPM package.
1. Define the `$ns` Sass variable in your app styles before importing `blueprint.scss` to update the generated CSS.
1. When bundling your code, set the `BLUEPRINT_NAMESPACE` environment variable to the same value to update the generated `Classes` constants. The easiest way to do this is on the command line: `BLUEPRINT_NAMESPACE="custom" webpack ...args`

@## Linting

The [**@blueprintjs/tslint-config**](https://www.npmjs.com/package/@blueprintjs/tslint-config) NPM package provides advanced configuration for [TSLint](http://palantir.github.io/tslint/), including a custom `blueprint-classes-constants` rule that will detect and warn about hardcoded `pt-`prefixed strings. See the package's [README](https://www.npmjs.com/package/@blueprintjs/tslint-config) for usage instructions.
