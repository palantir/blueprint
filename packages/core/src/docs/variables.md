@# Variables

Available for use with Sass and Less.

    @import "path/to/@blueprintjs/core/dist/variables";

The Sass `$` convention is used in this documentation for consistency with the original source code.
Every variable mentioned below is also available in `variables.less` with an `@` prefix instead of `$`.

@## Font variables

Typically, correct typography styles should be achieved by using the proper HTML tag (`<p>` for
text, `<h*>` for headings, `<code>` for code, etc.). The following variables are provided for the
rare cases where custom styling is necessary and should be used sparingly:

- `$pt-font-family`
- `$pt-font-family-monospace`
- `$pt-font-size`
- `$pt-font-size-small`
- `$pt-font-size-large`
- `$pt-line-height`

See the [Fonts section](#typography.fonts) for more information and usage guidelines.

@## Icon variables

Most icons should be displayed using the `span.pt-icon-*` classes or via modifier classes on
components like `.pt-button`. In rare cases, you may need direct access to the content
string that generates each icon in the icon font. Blueprint provides these variables with
straightforward names (see the [Icons section](#icons) for the full list of identifiers):

- `$pt-icon-style`
- `$pt-icon-align-left`
- `$pt-icon-align-center`
- ...

Variables are also provided for the two icon font families and their pixel sizes:

- `@icons16Family`
- `@icons20Family`
- `$pt-icon-size-standard`
- `$pt-icon-size-large`

@## Grids & dimensions

Sizes of common components. Most sizing variables are based on `$pt-grid-size`, which has
a value of `10px`. Custom components should adhere to the relevant `height` variable.

- `$pt-grid-size`
- `$pt-border-radius`
- `$pt-button-height`
- `$pt-button-height-large`
- `$pt-input-height`
- `$pt-input-height-large`
- `$pt-navbar-height`

@### Grid system

Blueprint doesn't provide a grid system. In general, you should try to use the `$pt-grid-size`
variable to generate layout & sizing style rules in your CSS codebase.

In lieu of a full grid system, you should try to use the __CSS flexible box layout model__ (a.k.a.
"flexbox"). It's quite powerful on its own and allows you to build robust, responsive layouts
without writing much CSS. Here are some resources for learning flexbox:
- [MDN guide](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes)
- [CSS Tricks guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

@## Layering

Blueprint provides variables for three z-index layers. This should be enough for most use cases,
especially if you make correct use of [stacking context][MDN]. [Overlay](#components.overlay)
components such as dialogs and popovers use these z-index values to configure their stacking
contexts.

- `$pt-z-index-base`
- `$pt-z-index-content`
- `$pt-z-index-overlay`

[MDN]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

@## Light theme styles

Use these when you need to build custom UI components that look similar to Blueprint's
light theme components.

- `$pt-dialog-box-shadow`
- `$pt-input-box-shadow`
- `$pt-popover-box-shadow`
- `$pt-tooltip-box-shadow`

@## Dark theme styles

Use these when you need to build custom UI components that look similar to Blueprint's
dark theme components.

- `$pt-dark-dialog-box-shadow`
- `$pt-dark-input-box-shadow`
- `$pt-dark-popover-box-shadow`
- `$pt-dark-tooltip-box-shadow`
