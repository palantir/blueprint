/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import BoxAsChild from "./box/BoxAsChild";
import BoxAsChildPreview from "./box/BoxAsChild.tsx.preview?raw";
import BoxAsChildCode from "./box/BoxAsChild.tsx?raw";
import BoxBasic from "./box/BoxBasic";
import BoxBasicPreview from "./box/BoxBasic.tsx.preview?raw";
import BoxBasicCode from "./box/BoxBasic.tsx?raw";

export const BoxBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={BoxBasicPreview} sourceCode={BoxBasicCode} {...props}>
            <BoxBasic />
        </CodeExample>
    );
};

export const BoxAsChildExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={BoxAsChildPreview} sourceCode={BoxAsChildCode} {...props}>
            <BoxAsChild />
        </CodeExample>
    );
};
