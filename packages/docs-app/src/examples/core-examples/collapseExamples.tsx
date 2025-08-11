/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CollapseBasic from "./collapse/CollapseBasic";
import collapseBasicPreview from "./collapse/CollapseBasic.tsx.preview?raw";
import CollapseMounted from "./collapse/CollapseMounted";
import collapseMountedPreview from "./collapse/CollapseMounted.tsx.preview?raw";

export const CollapseBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={collapseBasicPreview} {...props}>
            <CollapseBasic />
        </CodeExample>
    );
};

export const CollapseMountedExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={collapseMountedPreview} {...props}>
            <CollapseMounted />
        </CodeExample>
    );
};
