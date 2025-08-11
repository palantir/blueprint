/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import BreadcrumbsBasic from "./breadcrumbs/BreadcrumbsBasic";
import BreadcrumbsBasicPreview from "./breadcrumbs/BreadcrumbsBasic.tsx.preview?raw";
import BreadcrumbsOverflow from "./breadcrumbs/BreadcrumbsOverflow";
import BreadcrumbsOverflowPreview from "./breadcrumbs/BreadcrumbsOverflow.tsx.preview?raw";
import BreadcrumbsRenderer from "./breadcrumbs/BreadcrumbsRenderer";
import BreadcrumbsRendererPreview from "./breadcrumbs/BreadcrumbsRenderer.tsx.preview?raw";

export const BreadcrumbsBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={BreadcrumbsBasicPreview} {...props}>
            <BreadcrumbsBasic />
        </CodeExample>
    );
};

export const BreadcrumbsRendererExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={BreadcrumbsRendererPreview} {...props}>
            <BreadcrumbsRenderer />
        </CodeExample>
    );
};

export const BreadcrumbsOverflowExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={BreadcrumbsOverflowPreview} {...props}>
            <BreadcrumbsOverflow />
        </CodeExample>
    );
};
