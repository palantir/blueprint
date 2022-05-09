@# Classes

Blueprint packages provide React components in JS files and associated styles in
a CSS file. Each package exports a `Classes` constants object in JavaScript that
contains keys of the form `NAMED_CONSTANT` for every CSS class used. This
separation allows us to change CSS classes between versions without breaking
downstream users (although in practice this happens very rarely).

**Avoid referencing hardcoded Blueprint class names in your JS or CSS code.**

```tsx
// Don't do this! Avoid hardcoding Blueprint class names.
<button className="@ns-button @ns-large">Don't do this!</button>
```

The **best practice** is to add your own class to an element and then reference
that class whenever needed.

```tsx
<Button className="my-custom-class" text="customized button" />
```

```css.scss
.my-custom-class {
    width: 4000px;
}
```

In cases where adding and styling a new class is impractical or undesirable, use
the `Classes` constants or `$ns` Sass/Less variable. The `Classes` constants can
be particularly useful when writing UI tests.

```tsx
// use Classes constants for forward-compatible custom elements.
import { Classes } from "@blueprintjs/core";
<a className={Classes.MENU_ITEM}>custom menu item</a>;
```

```css.scss
// interpolate the $ns variable to generate forward-compatible class names.
// this approach is *not encouraged* as it increases maintenance cost.
@import "~@blueprintjs/core/lib/scss/variables";
.#{$ns}-menu-item {
}
```

@## Modifiers

Blueprint components support a range of **modifiers** to adjust their
appearance. Some commonly used modifiers are `intent`, `large`, and `minimal`.
While modifiers are typically implemented as simple CSS classes, it is always
preferrable to use the corresponding prop on a React component.

```tsx
// Prefer props over modifier classes.
<Button intent="primary" minimal={true}>Good stuff</Button>

// Don't do this!
<Button className={classNames(Classes.INTENT_PRIMARY, Classes.MINIMAL)}>Don't do this!</Button>
```

Another important note: Since modifiers typically correspond directly to CSS classes, they will often
cascade to children and _cannot be disabled_ on descendants. If a `<ButtonGroup>`
is marked `minimal={true}`, then setting `<Button minimal={false}>` on a child
will have _no effect_ since `Classes.MINIMAL` cannot be removed or overriden
by a descendant.

@## Namespacing

All Blueprint CSS classes begin with a namespace prefix to isolate our styles
from other frameworks: `.button` is a very common name, but only Blueprint
defines `.@ns-button`.

This CSS namespace is versioned by major version of the library so two major versions of Blueprint
can be used together on a single page.

### Custom namespace

The namespace can be changed _at build time_ to produce a custom Blueprint build
(though this usage is not recommended and we cannot offer support for it). This
requires several things:

1. You must use Sass and import Blueprint Sass source into your app, rather than using the CSS file distributed in the NPM package.
    - Compiling Blueprint Sass source requires two additional tools:
      [node-sass-package-importer](https://www.npmjs.com/package/node-sass-package-importer)
      for resolving node_modules imports and
      [sass-inline-svg](https://github.com/haithembelhaj/sass-inline-svg) for
      inlining SVG images.
1. Define the `$ns` Sass variable in your app styles before importing `blueprint.scss` to update the generated CSS.
1. When bundling your code, set the `BLUEPRINT_NAMESPACE` environment variable to the same value to update the generated `Classes` constants. The easiest way to do this is on the command line: `BLUEPRINT_NAMESPACE="custom" webpack ...args`

@## Linting

The [**@blueprintjs/eslint-config**](https://www.npmjs.com/package/@blueprintjs/eslint-config)
NPM package provides advanced configuration for [ESLint](https://eslint.org/). Blueprint is
currently transitioning from [TSLint](https://palantir.github.io/tslint/) to ESLint, and as
such, rules are being migrated from TSLint to ESLint. In the meantime, some TSLint rules are
being run using ESLint.

The [**@blueprintjs/eslint-plugin**](https://www.npmjs.com/package/@blueprintjs/eslint-plugin)
NPM package includes a custom `blueprint-html-components` rule that will warn on usages of
JSX intrinsic elements (`<h1>`) that have a Blueprint alternative (`<H1>`). See
the package's [README](https://www.npmjs.com/package/@blueprintjs/eslint-plugin)
for usage instructions.
