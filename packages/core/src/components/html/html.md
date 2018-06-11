---
reference: html
---

@# HTML elements

In order to avoid conflicts with other stylesheets, Blueprint does not style
most HTML elements directly. Instead, we provide several ways to style basic elements:

1. Use Blueprint React components: `<H1>`.
1. Apply the Blueprint `Classes` constant to an HTML tag: `<h1 className={Classes.HEADING}>`.
1. Nest HTML tags inside a container with `Classes.RUNNING_TEXT` (see below).

The following elements should be used in this manner:

| Component | HTML tag | `Classes` constant |
|-|-|-|
| `H1` - `H6` | `h1` - `h6` | `HEADING` |
| `Blockquote` | `blockquote` | `BLOCKQUOTE` |
| `Code` | `code` | `CODE` |
| `Label` | `label` | `LABEL` - see [Labels](#core/components/label) |
| `Pre` | `pre` | `CODE_BLOCK` |
| `OL` | `ol` | `LIST` |
| `UL` | `ul` | `LIST` |
| `Table` | `table` | `HTML_TABLE` - see [Table (HTML)](#core/components/table-html) |

The React components listed above each support the full set of relevant HTML attributes **and an
optional `elementRef` prop** to access the instance of the HTML element itself
(not the React component).

@## Nested usage

Applying `Classes.RUNNING_TEXT` to a container element allows the above HTML
elements to be used directly without additional CSS classes.
This is very useful for rendering generated markup where you cannot control the
exact HTML elements, such as a Markdown document.

See the [Running text](#core/typography.running-text) documentation for more information.

@## Linting

The [**@blueprintjs/tslint-config**](https://www.npmjs.com/package/@blueprintjs/tslint-config)
NPM package provides advanced configuration for [TSLint](http://palantir.github.io/tslint/),
including a custom `blueprint-html-components` rule that will warn on usages of
JSX intrinsic elements (`<h1>`) that have a Blueprint alternative (`<H1>`). See
the package's [README](https://www.npmjs.com/package/@blueprintjs/tslint-config)
for usage instructions.
