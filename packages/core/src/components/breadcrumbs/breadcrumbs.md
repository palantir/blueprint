@# Breadcrumbs

**Breadcrumbs** represent the path to the current resource within an application's hierarchical structure.

@## Import

```ts
import { Breadcrumbs } from "@blueprintjs/core";
```

@## Usage

The **Breadcrumbs** component accepts an `items` array of
[breadcrumb props](#core/components/breadcrumbs.breadcrumb) and renders them as an ordered list.

@reactCodeExample BreadcrumbsBasicExample

@## Overflow

**Breadcrumbs** uses an [**OverflowList**](#core/components/overflow-list)
to collapse breadcrumbs that exceed the available space.

@reactCodeExample BreadcrumbsOverflowExample

@## Customizing breadcrumbs

The **Breadcrumbs** component supports customization through the `breadcrumbRenderer`
and `currentBreadcrumbRenderer` props, which allow custom rendering of individual breadcrumbs.

@reactCodeExample BreadcrumbsRendererExample

@## Interactive Playground

@reactExample BreadcrumbsPlaygroundExample

@## Props interface

@interface BreadcrumbsProps

@## Breadcrumb

The **Breadcrumb** component renders an `a.@ns-breadcrumb` if an `href` or `onClick`
is provided; otherwise, it renders a `span.@ns-breadcrumb`. Typically, breadcrumbs
are supplied as an array of `BreadcrumbProps` to the `items` prop of **Breadcrumbs**,
but the component can also be used directly when implementing a custom `breadcrumbRenderer`.

@interface BreadcrumbProps
