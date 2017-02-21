@# Breadcrumbs

Breadcrumbs identify the current resource in an application.

@## CSS API

* Begin with a `ul.pt-breadcrumbs`; each crumb should be in its own `li` as a direct descendant.
* Breadcrumbs are typically navigation links (for example, to the parent folder in a file path), and
therefore should use `<a>` tags (except for the final breadcrumb).
* Each navigation breadcrumb should use `.pt-breadcrumb`.
* Make a breadcrumb non-interactive with the `.pt-disabled` class. You should only use this
state when you want to indicate that the user cannot navigate to the breadcrumb (for example, if
the user does not have permission to access it). Otherwise, clicking a breadcrumb should take the
user to that resource.
* Mark the final breadcrumb `.pt-breadcrumb-current` for an emphasized appearance.
* The `.pt-breadcrumbs-collapsed` button-like element can be used as the target for a dropdown menu
containing breadcrumbs that are collapsed due to layout constraints.
* When adding another element (such as a [tooltip](#components.tooltip) or
[popover](#components.popover)) to a breadcrumb, wrap it around the contents of the `li`.


Markup:
<ul class="pt-breadcrumbs">
<li><a class="pt-breadcrumbs-collapsed" href="#"></a></li>
<li><a class="pt-breadcrumb pt-disabled">Folder one</a></li>
<li><a class="pt-breadcrumb" href="#">Folder two</a></li>
<li><a class="pt-breadcrumb" href="#">Folder three</a></li>
<li><span class="pt-breadcrumb pt-breadcrumb-current">File</span></li>
</ul>

@## JavaScript API

The `Breadcrumb` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

The component renders an `a.pt-breadcrumb`.
You are responsible for constructing the `ul.pt-breadcrumbs` list.
[`CollapsibleList`](#components.collapsiblelist) works nicely with this component
because its props are a subset of `IMenuItemProps`.

@interface IBreadcrumbProps
