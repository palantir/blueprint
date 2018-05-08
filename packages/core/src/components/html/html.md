---
reference: html
---

@# HTML elements

In order to avoid conflicts with other stylesheets, Blueprint does not style
most HTML elements directly. Instead, we provide corresponding CSS `Classes` for . As a
convenience, we also provide React components for the following elements which
will automatically include the appropriate CSS class:

- `H1` - `H6`
- `Blockquote`
- `Code`
- `Pre`
- `OL` & `UL` (note uppercase)
- `Table` (see [Table (HTML)](http://localhost:9000/#core/components/table-html))

These components each support the full set of relevant HTML attributes **and an
optional `elementRef` prop** to access the instance of the HTML element itself
(not the React component).

@## Alternate usage

Applying `Classes.RUNNING_TEXT` to a container element allows the above HTML
elements (except `Table`) to be used directly without additional CSS classes.
This is very useful for rendering generated markup where you cannot control the
exact HTML elements, such as a Markdown document.

See [Typography > Running text](#core/typography.running-text) for more information.

@## Linting

The [**@blueprintjs/tslint-config**](https://www.npmjs.com/package/@blueprintjs/tslint-config)
NPM package provides advanced configuration for [TSLint](http://palantir.github.io/tslint/),
including a custom `blueprint-html-components` rule that will warn on usages of
JSX intrinsic elements (`<h1>`) that have a Blueprint alternative (`<H1>`). See
the package's [README](https://www.npmjs.com/package/@blueprintjs/tslint-config)
for usage instructions.
