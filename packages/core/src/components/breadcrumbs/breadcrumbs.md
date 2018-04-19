@# Breadcrumbs

Breadcrumbs identify the current resource in an application.

@## CSS API

* Begin with a `ul.@ns-breadcrumbs`; each crumb should be in its own `li` as a direct descendant.
* Breadcrumbs are typically navigation links (for example, to the parent folder in a file path), and
therefore should use `<a>` tags (except for the final breadcrumb).
* Each navigation breadcrumb should use `.@ns-breadcrumb`.
* Make a breadcrumb non-interactive with the `.@ns-disabled` class. You should only use this
state when you want to indicate that the user cannot navigate to the breadcrumb (for example, if
the user does not have permission to access it). Otherwise, clicking a breadcrumb should take the
user to that resource.
* Mark the final breadcrumb `.@ns-breadcrumb-current` for an emphasized appearance.
* The `.@ns-breadcrumbs-collapsed` button-like element can be used as the target for a dropdown menu
containing breadcrumbs that are collapsed due to layout constraints.
* When adding another element (such as a [tooltip](#core/components/tooltip) or
[popover](#core/components/popover)) to a breadcrumb, wrap it around the contents of the `li`.

@css breadcrumbs

@## JavaScript API

The `Breadcrumb` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

The component renders an `a.@ns-breadcrumb`. You are responsible for constructing
the `ul.@ns-breadcrumbs` list. [`CollapsibleList`](#core/components/collapsiblelist)
works nicely with this component because its props are a subset of `IMenuItemProps`.

@interface IBreadcrumbProps
