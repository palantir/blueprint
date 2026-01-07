/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import DividerBasic from "./divider/DividerBasic";
import dividerBasicPreview from "./divider/DividerBasic.tsx.preview?raw";
import dividerBasicCode from "./divider/DividerBasic.tsx?raw";
import DividerVertical from "./divider/DividerVertical";
import dividerVerticalPreview from "./divider/DividerVertical.tsx.preview?raw";
import dividerVerticalCode from "./divider/DividerVertical.tsx?raw";

export const DividerBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={dividerBasicPreview} sourceCode={dividerBasicCode} {...props}>
            <DividerBasic />
        </CodeExample>
    );
};

export const DividerVerticalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={dividerVerticalPreview}
            sourceCode={dividerVerticalCode}
            {...props}
        >
            <DividerVertical />
        </CodeExample>
    );
};
