@# Icon

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See the [**Icons package**](#icons) for a searchable list of all available UI icons.

</div>

Blueprint provides icons in two formats (SVG and fonts). It's easy to change their color
or apply effects like text shadows via standard SVG or CSS properties.

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
image; the icon element itself can be also be sized using CSS.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Icons may be configured to load in various ways, see ["Loading icons"](#icons/loading-icons).

</div>

The HTML element rendered by `<Icon>` can be customized with the `tagName` prop
(defaults to `span`), and additional props are passed to this element.

Data files in the __@blueprintjs/icons__ package provide SVG path information
for Blueprint's 500+ icons for 16px and 20px grids. The `icon` prop specifies
which SVG is rendered and the `size` prop determines which pixel grid is used:
`size >= 20` will use the 20px grid and smaller icons will use the 16px grid.

If `title` is _not_ provided to an `<Icon>`, `aria-hidden` will be set to true as
it will be assumed that the icon is decorative since it is unlabeled.

```tsx
import { Icon, IconSize } from "@blueprintjs/core";

// icon name string literals are type checked
<Icon icon="cross" />
<Icon icon="globe" size={20} />

// constants are provided for standard sizes
<Icon icon="graph" size={IconSize.LARGE} intent="primary" />

// you can also pass all valid HTML props
<Icon icon="add" onClick={this.handleAdd} onKeyDown={this.handleAddKeys} />
```

Custom sizes are supported. The following React element:

```tsx
<Icon icon="globe" size={30} />
```

...renders this HTML markup:

```xml
<span class="@ns-icon @ns-icon-globe" aria-hidden="true">
    <svg data-icon="globe" width="30" height="30" viewBox="0 0 20 20" role="img">
        <path d="..."></path>
    </svg>
</span>
```

@## Props interface

@interface DefaultIconProps

@## DOM attributes

The `<Icon>` component forwards extra HTML attributes to its root DOM element. By default,
the root element is a `<span>` wrapper around the icon `<svg>`. The tag name of this element
may be customized via the `tagName` prop as either:

- a custom HTML tag name (for example `<div>` instead of the default `<span>` wrapper), or
- `null`, which makes the component omit the wrapper element and only render the `<svg>` as its root element

By default, `<Icon>` supports a limited set of DOM attributes which are assignable to _all_ HTML and SVG
elements. In some cases, you may want to use more specific attributes which are only available on HTML elements
or SVG elements. The `<Icon>` component has a generic type which allows for this more advanced usage. You can
specify a type parameter on the component opening tag to (for example) set an HTML-only attribute:

```tsx
import { Icon } from "@blueprintjs/core";
import * as React from "react";

function Example() {
    const [isDraggable, setIsDraggable] = React.useState();
    // explicitly declare type of the root element so that we can set the "draggable" DOM attribute
    return <Icon<HTMLSpanElement> icon="drag-handle-horizontal" draggable={isDraggable} />;
}
```

Another use case for this type parameter API may be to get the correct type definition for an event handler
on the root element when _omitting_ the icon wrapper element:

```tsx
import { Icon } from "@blueprintjs/core";
import * as React from "react";

function Example() {
    const handleClick: React.MouseEventHandler<SVGSVGElement> = () => { /* ... */ };
    // explicitly declare type of the root element so that we can narrow the type of the event handler
    return <Icon<SVGSVGElement> icon="add" onClick={handleClick} tagName={null} />;
}
```

@## Static components

The `<Icon>` component loads icon paths via dynamic module imports by default. An alternative API
is available in the __@blueprintjs/icons__ package which provides static imports of each icon as
a React component. The example below uses the `<Calendar>` component.

Note that some `<Icon>` props are not yet supported for these components, such as `intent`.

@reactExample IconGeneratedComponentExample

@interface DefaultSVGIconProps

@## CSS API

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

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Non-standard sizes</h5>

Generally, font icons should only be used at either 16px or 20px. However, if a non-standard size is
necessary, set a `font-size` that is whole multiple of 16 or 20 with the relevant size class.
You can instead use the class `@ns-icon` to make the icon inherit its size from surrounding text.

</div>
