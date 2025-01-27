/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Breadcrumb, Breadcrumbs, Icon } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const BreadcrumbsBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Breadcrumbs
            items={[
                { text: "Blueprint" },
                { text: "Docs" },
                { text: "Components" },
                { text: "Breadcrumbs" },
            ]}
        />`;
    return (
        <CodeExample code={code} {...props}>
            <Breadcrumbs
                items={[{ text: "Blueprint" }, { text: "Docs" }, { text: "Components" }, { text: "Breadcrumbs" }]}
            />
        </CodeExample>
    );
};

export const BreadcrumbsRendererExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Breadcrumbs
            currentBreadcrumbRenderer={({ text, ...rest }) => (
                <Breadcrumb {...rest}>
                    {text}&nbsp;
                    <Icon icon="star" />
                </Breadcrumb>
            )}
            items={[
                { href: "/users", icon: "folder-close", text: "Users" },
                { href: "/users/janet", icon: "folder-close", text: "Janet" },
                { icon: "document", text: "image.jpg" },
            ]}
        />`;
    return (
        <CodeExample code={code} {...props}>
            <Breadcrumbs
                currentBreadcrumbRenderer={({ text, ...rest }) => (
                    <Breadcrumb {...rest}>
                        {text}&nbsp;
                        <Icon icon="star" />
                    </Breadcrumb>
                )}
                items={[
                    { href: "/users", icon: "folder-close", text: "Users" },
                    { href: "/users/janet", icon: "folder-close", text: "Janet" },
                    { icon: "document", text: "image.jpg" },
                ]}
            />
        </CodeExample>
    );
};

export const BreadcrumbsOverflowExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Breadcrumbs
            items={[
                { text: "All files" },
                { text: "Users" },
                { text: "Janet" },
                { text: "Photos" },
                { text: "Wednesday" },
                { text: "image.jpg", current: true },
            ]}
            minVisibleItems={3}
        />`;
    return (
        <CodeExample code={code} {...props}>
            <Breadcrumbs
                items={[
                    { text: "All files" },
                    { text: "Users" },
                    { text: "Janet" },
                    { text: "Photos" },
                    { text: "Wednesday" },
                    { current: true, text: "image.jpg" },
                ]}
                minVisibleItems={3}
            />
        </CodeExample>
    );
};
