@# Breadcrumbs

An ordered list that represents a navigation path, with built-in overflow handling for long trails.

@## Import

```tsx
import { Breadcrumbs } from "@blueprintjs/core";
```

@## Usage

The **Breadcrumbs** component accepts an `items` array of
[breadcrumb props](#core/components/breadcrumbs.breadcrumb) and renders them as an ordered list.

```tsx
<Breadcrumbs items={[{ text: "Home" }, { text: "Account" }, { text: "Project" }]} />
```

@## Examples

@### Basic Usage

@reactCodeExample BreadcrumbsBasicExample

@### Icon

Use the `icon` prop on individual breadcrumb items to display an icon before the text.

@reactCodeExample BreadcrumbsIconExample

@### Overflow

**Breadcrumbs** uses [**OverflowList**](#core/components/overflow-list) to collapse items
that exceed the available space. Use the `minVisibleItems` prop to guarantee a
minimum number of items remain visible.

@reactCodeExample BreadcrumbsOverflowExample

@### Collapse direction

By default, **Breadcrumbs** collapses items from the start. Use the `collapseFrom` prop
with `Boundary.END` to collapse from the end instead.

@reactCodeExample BreadcrumbsCollapseFromExample

@### Disabled

Set `disabled: true` on individual breadcrumb items to render them as non-interactive.

@reactCodeExample BreadcrumbsDisabledExample

@### Custom renderer

Use the `breadcrumbRenderer` and `currentBreadcrumbRenderer` props to customize
how breadcrumbs are rendered.

@reactCodeExample BreadcrumbsRendererExample

@### With Popover

Use the `popoverProps` prop to customize the overflow menu popover.

@reactCodeExample BreadcrumbsPopoverExample

@### Overflow button

Use the `overflowButtonProps` prop to customize the overflow indicator element.

@reactCodeExample BreadcrumbsOverflowButtonExample

@## Interactive Playground

@reactExample BreadcrumbsPlaygroundExample

@## Props interface

@interface BreadcrumbsProps

@## Breadcrumb

An individual breadcrumb item. Renders as an anchor if `href` or `onClick` is
provided, otherwise as a span. Typically, breadcrumbs are supplied as an array
of `BreadcrumbProps` to the `items` prop of **Breadcrumbs**, but the component can
also be used directly when implementing a custom `breadcrumbRenderer`.

@interface BreadcrumbProps
