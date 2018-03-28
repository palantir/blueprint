@# Icon

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    See [**Icons**](#icons) for a searchable list of all available UI icons.
</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-callout-title">SVG icons in 2.0</h4>
    Blueprint 2.0 introduced SVG icon support and moved icon resources to a separate __@blueprintjs/icons__ package.
    The `Icon` component now renders SVG paths and the icon classes are no longer used by any Blueprint React component.
    Icon font support has been preserved but should be considered a legacy feature that will be removed in a
    future major version.
</div>

This section describes two ways of using the UI icon font: via CSS or via React component.

Many Blueprint components provide an `icon` prop which accepts an icon name (such as `"history"`) or
a JSX element to use as the icon.

@reactExample IconExample

@## JavaScript API

The `Icon` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

Use the `<Icon>` component to easily render __SVG icons__ in React. The `icon` prop is typed
such that editors can offer autocomplete for known icon names. The optional `iconSize` prop ensures
you'll never forget a sizing class and clarifies the expected width and height of the icon element.
The component also accepts all valid HTML props for an `<svg>` element.

Data files in the __@blueprintjs/icons__ package provide SVG path information for Blueprint's 300+ icons
for 16px and 20px grids. The `icon` prop dictates which SVG is rendered and `iconSize` determines
which pixel grid is used: `iconSize >= 20` will use the 20px grid and smaller icons will use the 16px grid.

```tsx
import { Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

// string literals are supported through IconName union type
<Icon icon="cross" />
<Icon icon="globe" iconSize={20} />

// constants are provided for name and size
<Icon icon={IconNames.GRAPH} iconSize={Icon.SIZE_LARGE} intent={Intent.PRIMARY} />

// can pass all valid HTML props
<Icon icon="add" onClick={this.handleAdd} onKeyDown={this.handleAddKeys} />
```

```html
<Icon icon="globe" iconSize={30} />
<!-- renders the following HTML markup: -->
<svg class="@ns-icon" data-icon="globe" width="30" height="30" viewBox="0 0 20 20">
    <title>globe</title>
    <path ... />
</svg>
```

@interface IIconProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">Icon fonts are legacy in 2.0</h4>
    Blueprint's icon fonts should be considered a legacy feature and will be removed in a future major version.
    The SVGs rendered by the React component do not suffer from the blurriness of icon fonts, and browser
    support is equivalent.
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
    <h4 class="@ns-callout-title">Non-standard sizes</h4>
    Generally, font icons should only be used at either 16px or 20px. However, if a non-standard size is
    necessary, set a `font-size` that is whole multiple of 16 or 20 with the relevant size class.
    You can instead use the class `@ns-icon` to make the icon inherit its size from surrounding text.
</div>
