/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import BreadcrumbsBasic from "./breadcrumbs/BreadcrumbsBasic";
import BreadcrumbsBasicPreview from "./breadcrumbs/BreadcrumbsBasic.tsx.preview?raw";
import BreadcrumbsBasicCode from "./breadcrumbs/BreadcrumbsBasic.tsx?raw";
import BreadcrumbsCollapseFrom from "./breadcrumbs/BreadcrumbsCollapseFrom";
import BreadcrumbsCollapseFromPreview from "./breadcrumbs/BreadcrumbsCollapseFrom.tsx.preview?raw";
import BreadcrumbsCollapseFromCode from "./breadcrumbs/BreadcrumbsCollapseFrom.tsx?raw";
import BreadcrumbsDisabled from "./breadcrumbs/BreadcrumbsDisabled";
import BreadcrumbsDisabledPreview from "./breadcrumbs/BreadcrumbsDisabled.tsx.preview?raw";
import BreadcrumbsDisabledCode from "./breadcrumbs/BreadcrumbsDisabled.tsx?raw";
import BreadcrumbsIcon from "./breadcrumbs/BreadcrumbsIcon";
import BreadcrumbsIconPreview from "./breadcrumbs/BreadcrumbsIcon.tsx.preview?raw";
import BreadcrumbsIconCode from "./breadcrumbs/BreadcrumbsIcon.tsx?raw";
import BreadcrumbsOverflow from "./breadcrumbs/BreadcrumbsOverflow";
import BreadcrumbsOverflowPreview from "./breadcrumbs/BreadcrumbsOverflow.tsx.preview?raw";
import BreadcrumbsOverflowCode from "./breadcrumbs/BreadcrumbsOverflow.tsx?raw";
import BreadcrumbsRenderer from "./breadcrumbs/BreadcrumbsRenderer";
import BreadcrumbsRendererPreview from "./breadcrumbs/BreadcrumbsRenderer.tsx.preview?raw";
import BreadcrumbsRendererCode from "./breadcrumbs/BreadcrumbsRenderer.tsx?raw";

export const BreadcrumbsBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={BreadcrumbsBasicPreview}
            sourceCode={BreadcrumbsBasicCode}
            {...props}
        >
            <BreadcrumbsBasic />
        </CodeExample>
    );
};

export const BreadcrumbsRendererExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={BreadcrumbsRendererPreview}
            sourceCode={BreadcrumbsRendererCode}
            {...props}
        >
            <BreadcrumbsRenderer />
        </CodeExample>
    );
};

export const BreadcrumbsIconExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={BreadcrumbsIconPreview}
            sourceCode={BreadcrumbsIconCode}
            {...props}
        >
            <BreadcrumbsIcon />
        </CodeExample>
    );
};

export const BreadcrumbsOverflowExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={BreadcrumbsOverflowPreview}
            sourceCode={BreadcrumbsOverflowCode}
            {...props}
        >
            <BreadcrumbsOverflow />
        </CodeExample>
    );
};

export const BreadcrumbsCollapseFromExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={BreadcrumbsCollapseFromPreview}
            sourceCode={BreadcrumbsCollapseFromCode}
            {...props}
        >
            <BreadcrumbsCollapseFrom />
        </CodeExample>
    );
};

export const BreadcrumbsDisabledExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={BreadcrumbsDisabledPreview}
            sourceCode={BreadcrumbsDisabledCode}
            {...props}
        >
            <BreadcrumbsDisabled />
        </CodeExample>
    );
};
