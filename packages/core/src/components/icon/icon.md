@# Icon

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See the [**Icons package**](#icons) for a searchable list of all available UI icons.

</div>

This section describes two ways of using Blueprint's UI icons:
via the `Icon` component to render SVG images or via CSS classes to use the icon font.

Many Blueprint components provide an `icon` prop which accepts an icon name
(such as `"history"`) or a JSX element to use as the icon. When you specify
the name as a string, these components render `<Icon icon="..." />` under the hood.

@reactExample IconExample

@## Usage

Use the `<Icon>` component to easily render __SVG icons__ in React. The `icon`
prop is typed such that editors can offer autocomplete for known icon names. The
optional `size` prop determines the exact width and height of the icon
image; the icon element itself can be sized separately using CSS.

The HTML element rendered by `<Icon>` can be customized with the `tagName` prop
(defaults to `span`), and additional props are passed to this element.

Data files in the __@blueprintjs/icons__ package provide SVG path information
for Blueprint's 300+ icons for 16px and 20px grids. The `icon` prop dictates
which SVG is rendered and `size` determines which pixel grid is used:
`size >= 20` will use the 20px grid and smaller icons will use the 16px
grid.

If `title` is not provided to an Icon, `aria-hidden` will be set to true as
it will be assumed that the icon is decorative if not labeled.

```tsx
import { Icon, IconSize } from "@blueprintjs/core";

// icon name string literals are type checked
<Icon icon="cross" />
<Icon icon="globe" size={20} />

// constants are provided for name and size
<Icon icon="graph" size={IconSize.LARGE} intent="primary" />

// you can also pass all valid HTML props
<Icon icon="add" onClick={this.handleAdd} onKeyDown={this.handleAddKeys} />
```

Custom sizes are supported. The following React component:

```tsx
<Icon icon="globe" iconSize={30} />
```

...renders this HTML markup:

```html
<svg class="@ns-icon" data-icon="globe" width="30" height="30" viewBox="0 0 20 20">
    <title>globe</title>
    <path d="..."></path>
</svg>
```

@## Props

@interface IIconProps

@## CSS

The CSS-only icons API uses the __icon fonts__ from the __@blueprintjs/icons__ package.
Note that _none of Blueprint's React components use the icon font_; it is only provided
for convenience to Blueprint consumers for rare situations where an icon font may be
preferred over icon SVGs.

To use Blueprint UI icons via CSS, you must apply two classes to a `<span>` element:
- a __sizing class__, either `@ns-icon-standard` (16px) or `@ns-icon-large` (20px)
- an __icon name class__, such as `@ns-icon-projects`

Icon classes also support the four `.@ns-intent-*` modifiers to color the image.

```html
<span class="@ns-icon-{{size}} @ns-icon-{{name}}"></span>

<span class="@ns-icon-standard @ns-icon-projects"></span>
<span class="@ns-icon-large @ns-icon-geosearch @ns-intent-success"></span>
```

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Non-standard sizes</h4>

Generally, font icons should only be used at either 16px or 20px. However, if a non-standard size is
necessary, set a `font-size` that is whole multiple of 16 or 20 with the relevant size class.
You can instead use the class `@ns-icon` to make the icon inherit its size from surrounding text.

</div>
