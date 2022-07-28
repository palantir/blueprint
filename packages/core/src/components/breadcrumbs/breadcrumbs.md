@# Breadcrumbs

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [Breadcrumbs2](#popover2-package/breadcrumbs2)

</h4>

This component is **deprecated since @blueprintjs/core v4.7.0** in favor of the new
Breadcrumbs2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

Breadcrumbs identify the path to the current resource in an application.

@reactExample BreadcrumbsExample

@## Props

@### Breadcrumbs

The `Breadcrumbs` component requires an `items` array of
[breadcrumb props](#core/components/breadcrumbs.breadcrumb) and renders them in
an [`OverflowList`](#core/components/overflow-list) to automatically collapse
breadcrumbs that do not fit in the available space.

```tsx
const { Breadcrumbs, IBreadcrumbProps, Icon } = "@blueprintjs/core";

const BREADCRUMBS: IBreadcrumbProps[] = [
    { href: "/users", icon: "folder-close", text: "Users" },
    { href: "/users/janet", icon: "folder-close", text: "Janet" },
    { icon: "document", text: "image.jpg" },
];

export class BreadcrumbsExample extends React.Component {
    public render() {
        return (
            <Breadcrumbs
                currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                items={BREADCRUMBS}
             />
        );
    }
    private renderCurrentBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
        // customize rendering of last breadcrumb
        return <Breadcrumb {...restProps}>{text} <Icon icon="star" /></Breadcrumb>;
    };
}
```

@interface IBreadcrumbsProps

@### Breadcrumb

The `Breadcrumb` component renders an `a.@ns-breadcrumb` if given an `href` or
`onClick` and a `span.@ns-breadcrumb` otherwise. Typically you will supply an
array of `IBreadcrumbProps` to the `<Breadcrumbs items>` prop and only render
this component directly when defining a custom `breadcrumbRenderer`.

@interface IBreadcrumbProps

@## CSS

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
