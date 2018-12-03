@# Variables

Available for use with Sass and Less.

```css.scss
// Sass
@import "path/to/@blueprintjs/core/lib/scss/variables";
```

```css.less
// Less
@import "path/to/@blueprintjs/core/lib/less/variables";
```

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

@## Icon variables

Most icons should be displayed using the `span.@ns-icon-*` classes or via modifier classes on
components like `.@ns-button`. In rare cases, you may need direct access to the content
string that generates each icon in the icon font. Blueprint provides these variables with
straightforward names (see the [Icons section](#icons) for the full list of identifiers):

- `$pt-icon-style`
- `$pt-icon-align-left`
- `$pt-icon-align-center`
- ...

Variables are also provided for the two icon font families and their pixel sizes:

- `$icons16-family`
- `$icons20-family`
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
especially if you make correct use of [stacking context][MDN]. [Overlay](#core/components/overlay)
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

@## Elevation drop shadows

Use these when you need to apply a drop shadow to custom UI components to simulate height.
These elevations correspond to those of the [Card](#core/components/card.elevation) component.

- `$pt-elevation-shadow-0`
- `$pt-elevation-shadow-1`
- `$pt-elevation-shadow-2`
- `$pt-elevation-shadow-3`
- `$pt-elevation-shadow-4`

Use these for drop shadows in dark theme.

- `$pt-dark-elevation-shadow-0`
- `$pt-dark-elevation-shadow-1`
- `$pt-dark-elevation-shadow-2`
- `$pt-dark-elevation-shadow-3`
- `$pt-dark-elevation-shadow-4`

@## Color aliases

These variables are semantic aliases of our [colors](#core/colors).
They are used throughout Blueprint itself to ensure consistent color usage across components
and are available in the Sass or Less variables files.

<table class="@ns-html-table docs-color-aliases-table">
    <thead>
        <tr>
            <th></th>
            <th>Variable</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div class="docs-color-bubble alias-intent-primary"></div>
            </td>
            <td><code>$pt-intent-primary</code></td>
            <td>Primary intent color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-intent-success"></div>
            </td>
            <td><code>$pt-intent-success</code></td>
            <td>Success intent color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-intent-warning"></div>
            </td>
            <td><code>$pt-intent-warning</code></td>
            <td>Warning intent color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-intent-danger"></div>
            </td>
            <td><code>$pt-intent-danger</code></td>
            <td>Danger intent color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-app-background-color"></div>
            </td>
            <td><code>$pt-app-background-color</code></td>
            <td>Application background color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-app-background-color"></div>
            </td>
            <td><code>$pt-dark-app-background-color</code></td>
            <td>Dark theme application background color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-text-color"></div>
            </td>
            <td><code>$pt-text-color</code></td>
            <td>Default text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-text-color-muted"></div>
            </td>
            <td><code>$pt-text-color-muted</code></td>
            <td>Muted text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-text-color-disabled"></div>
            </td>
            <td><code>$pt-text-color-disabled</code></td>
            <td>Disabled text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-heading-color"></div>
            </td>
            <td><code>$pt-heading-color</code></td>
            <td>Text color for headers</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-link-color"></div>
            </td>
            <td><code>$pt-link-color</code></td>
            <td>Text color for links</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-text-color"></div>
            </td>
            <td><code>$pt-dark-text-color</code></td>
            <td>Dark theme default text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-text-color-muted"></div>
            </td>
            <td><code>$pt-dark-text-color-muted</code></td>
            <td>Dark theme muted text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-text-color-disabled"></div>
            </td>
            <td><code>$pt-dark-text-color-disabled</code></td>
            <td>Dark theme disabled text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-heading-color"></div>
            </td>
            <td><code>$pt-dark-heading-color</code></td>
            <td>Dark theme text color for headers</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-link-color"></div>
            </td>
            <td><code>$pt-dark-link-color</code></td>
            <td>Dark theme text color for links</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-text-selection-color"></div>
            </td>
            <td><code>$pt-text-selection-color</code></td>
            <td>Text selection color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-icon-color"></div>
            </td>
            <td><code>$pt-icon-color</code></td>
            <td>Default icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-icon-color-hover"></div>
            </td>
            <td><code>$pt-icon-color-hover</code></td>
            <td>Hovered icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-icon-color-disabled"></div>
            </td>
            <td><code>$pt-icon-color-disabled</code></td>
            <td>Disabled icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-icon-color-selected"></div>
            </td>
            <td><code>$pt-icon-color-selected</code></td>
            <td>Selected icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-icon-color"></div>
            </td>
            <td><code>$pt-dark-icon-color</code></td>
            <td>Dark theme default icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-icon-color-hover"></div>
            </td>
            <td><code>$pt-dark-icon-color-hover</code></td>
            <td>Dark theme hovered icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-icon-color-disabled"></div>
            </td>
            <td><code>$pt-dark-icon-color-disabled</code></td>
            <td>Dark theme disabled icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-icon-color-selected"></div>
            </td>
            <td><code>$pt-dark-icon-color-selected</code></td>
            <td>Dark theme selected icon color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-divider-black"></div>
            </td>
            <td><code>$pt-divider-black</code></td>
            <td>Black divider color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-divider-black"></div>
            </td>
            <td><code>$pt-dark-divider-black</code></td>
            <td>Dark theme black divider color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-divider-white"></div>
            </td>
            <td><code>$pt-dark-divider-white</code></td>
            <td>Dark theme white divider color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-code-text-color"></div>
            </td>
            <td><code>$pt-code-text-color</code></td>
            <td>Code text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-code-background-color"></div>
            </td>
            <td><code>$pt-code-background-color</code></td>
            <td>Code background color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-code-text-color"></div>
            </td>
            <td><code>$pt-dark-code-text-color</code></td>
            <td>Dark theme code text color</td>
        </tr>
        <tr>
            <td>
                <div class="docs-color-bubble alias-dark-code-background-color"></div>
            </td>
            <td><code>$pt-dark-code-background-color</code></td>
            <td>Dark theme code background color</td>
        </tr>
    </tbody>
</table>

