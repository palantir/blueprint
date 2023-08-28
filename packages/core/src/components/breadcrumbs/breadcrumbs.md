@# Breadcrumbs

__Breadcrumbs__ identify the path to the current resource in an application.

@reactExample BreadcrumbsExample

@## Usage

The __Breadcrumbs__ component requires an `items` array of [breadcrumb props](#core/components/breadcrumbs.breadcrumb)
and renders them in an [__OverflowList__](#core/components/overflow-list) to automatically collapse breadcrumbs that
do not fit in the available space.

```tsx
import { Breadcrumbs, BreadcrumbProps, Icon } from "@blueprintjs/core";
import * as React from "react";

const BREADCRUMBS: BreadcrumbProps[] = [
    { href: "/users", icon: "folder-close", text: "Users" },
    { href: "/users/janet", icon: "folder-close", text: "Janet" },
    { icon: "document", text: "image.jpg" },
];

export class BreadcrumbsExample extends React.PureComponent {
    public render() {
        return (
            <Breadcrumbs
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

@## Props interface

@interface BreadcrumbsProps

@### Breadcrumb

The __Breadcrumb__ component renders an `a.@ns-breadcrumb` if given an `href` or `onClick` and a `span.@ns-breadcrumb`
otherwise. Typically you will supply an array of `BreadcrumbProps` to the `<Breadcrumbs items>` prop and only need to
render this component directly when defining a custom `breadcrumbRenderer`.

@interface BreadcrumbProps
