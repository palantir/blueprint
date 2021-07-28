@# Icon

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See the [**Icons package**](#icons) for a searchable list of all available UI icons.

</div>

This section describes two ways of using the UI icon font: via React `Icon`
component to render SVG images or via CSS classes to use the icon font.

Many Blueprint components provide an `icon` prop which accepts an icon name
(such as `"history"`) or a JSX element to use as the icon. When you specify
the name as a string, these components render `<Icon icon="..." />` under the hood.

@reactExample IconExample

@## Usage

Use the `<Icon>` component to easily render __SVG icons__ in React. The `icon`
prop is typed such that editors can offer autocomplete for known icon names. The
optional `size` prop (previously called `iconSize`) determines the exact width
and height of the icon image; the icon element itself can be sized separately using CSS.

The HTML element rendered by `<Icon>` can be customized with the `tagName` prop
(defaults to `span`), and additional props are passed to this element.

Data files in the __@blueprintjs/icons__ package provide SVG path information
for Blueprint's 300+ icons for 16px and 20px grids. The `icon` prop dictates
which SVG is rendered and `size` determines which pixel grid is used:
`size >= 20` will use the 20px grid and smaller icons will use the 16px
grid.

```tsx
import { Icon, IconSize } from "@blueprintjs/core";

// string literals are supported through IconName union type
<Icon icon="cross" />
<Icon icon="globe" size={20} />

// constants are provided for name and size
<Icon icon="graph" size={IconSize.LARGE} intent="primary" />

// can pass all valid HTML props
<Icon icon="add" onClick={this.handleAdd} onKeyDown={this.handleAddKeys} />
```

```html
<Icon icon="globe" size={30} />
<!-- renders the following HTML markup: -->
<svg class="@ns-icon" data-icon="globe" width="30" height="30" viewBox="0 0 20 20">
    <title>globe</title>
    <path ... />
</svg>
```

@## Props

@interface IIconProps

@## CSS

<div class="@ns-callout @ns-intent-danger @ns-icon-warning-sign">
    <h4 class="@ns-heading">Some icons are missing in the icon font in 3.x</h4>

Blueprint icons added after `@blueprintjs/icons@3.14.0` do not have icon font support.
Support for the icon font for these icons will be restored in Blueprint v4.0.

</div>

The CSS-only icons API uses the __icon fonts__ from the __@blueprintjs/icons__ package.

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
