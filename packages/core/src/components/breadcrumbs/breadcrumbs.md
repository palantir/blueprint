# Breadcrumbs

An ordered list that represents a navigation path, with built-in overflow handling for long trails.

## Import

```ts copy
import { Breadcrumbs } from "@blueprintjs/core";
```

## Usage

The **Breadcrumbs** component accepts an `items` array of
[breadcrumb props](#core/components/breadcrumbs.breadcrumb) and renders them as an ordered list.

@reactCodeExample BreadcrumbsBasicExample

## Overflow

Use the `icon` prop on individual breadcrumb items to display an icon before the text.

@reactCodeExample BreadcrumbsIconExample

@### Overflow

**Breadcrumbs** uses [**OverflowList**](#core/components/overflow-list) to collapse items
that exceed the available space. Use the `minVisibleItems` prop to guarantee a
minimum number of items remain visible.

@reactCodeExample BreadcrumbsOverflowExample

## Customizing breadcrumbs

The **Breadcrumbs** component supports customization through the `breadcrumbRenderer`
and `currentBreadcrumbRenderer` props, which allow custom rendering of individual breadcrumbs.

@reactCodeExample BreadcrumbsRendererExample

## Interactive Playground

@reactExample BreadcrumbsPlaygroundExample

## Props interface

@interface BreadcrumbsProps

## Breadcrumb

An individual breadcrumb item. Renders as an anchor if `href` or `onClick` is
provided, otherwise as a span. Typically, breadcrumbs are supplied as an array
of `BreadcrumbProps` to the `items` prop of **Breadcrumbs**, but the component can
also be used directly when implementing a custom `breadcrumbRenderer`.

@interface BreadcrumbProps
