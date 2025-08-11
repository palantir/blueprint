/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CollapseBasic from "./collapse/CollapseBasic";
import collapseBasicPreview from "./collapse/CollapseBasic.tsx.preview?raw";
import collapseBasicCode from "./collapse/CollapseBasic.tsx?raw";
import CollapseMounted from "./collapse/CollapseMounted";
import collapseMountedPreview from "./collapse/CollapseMounted.tsx.preview?raw";
import collapseMountedCode from "./collapse/CollapseMounted.tsx?raw";

export const CollapseBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={collapseBasicPreview} sourceCode={collapseBasicCode} {...props}>
            <CollapseBasic />
        </CodeExample>
    );
};

export const CollapseMountedExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={collapseMountedPreview}
            sourceCode={collapseMountedCode}
            {...props}
        >
            <CollapseMounted />
        </CodeExample>
    );
};
