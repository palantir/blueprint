---
tag: new
---

@# Breadcrumbs2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [Breadcrumbs](#core/components/breadcrumbs)?

</h5>

Breadcrumbs2 is a replacement for Breadcrumbs and will replace it in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/Popover2-migration#breadcrumbs2)
on the wiki (the changes are minimal, it should be an easy drop-in replacement).

</div>

Breadcrumbs identify the path to the current resource in an application.

@reactExample Breadcrumbs2Example

@## Props

@### Breadcrumbs2

The Breadcrumbs2 component requires an `items` array of
[breadcrumb props](#core/components/breadcrumbs.breadcrumb) and renders them in
an [OverflowList](#core/components/overflow-list) to automatically collapse
breadcrumbs that do not fit in the available space.

```tsx
import { BreadcrumbProps, Icon } from "@blueprintjs/core";
import { Breadcrumbs2 } from "@blueprintjs/popover2";
import * as React from "react";

const BREADCRUMBS: BreadcrumbProps[] = [
    { href: "/users", icon: "folder-close", text: "Users" },
    { href: "/users/janet", icon: "folder-close", text: "Janet" },
    { icon: "document", text: "image.jpg" },
];

export class BreadcrumbsExample extends React.PureComponent {
    public render() {
        return (
            <Breadcrumbs2
                currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                items={BREADCRUMBS}
             />
        );
    }

    private renderCurrentBreadcrumb = ({ text, ...restProps }: BreadcrumbProps) => {
        // customize rendering of last breadcrumb
        return <Breadcrumb {...restProps}>{text} <Icon icon="star" /></Breadcrumb>;
    };
}
```

@interface Breadcrumbs2Props

@### Breadcrumb

The Breadcrumb component renders an `a.@ns-breadcrumb` if given an `href` or
`onClick` and a `span.@ns-breadcrumb` otherwise. Typically you will supply an
array of `BreadcrumbProps` to the `<Breadcrumbs items>` prop and only need to
render this component directly when defining a custom `breadcrumbRenderer`.

@interface IBreadcrumbProps
