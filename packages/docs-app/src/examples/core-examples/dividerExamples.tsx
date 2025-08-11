/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import DividerBasic from "./divider/DividerBasic";
import dividerBasicPreview from "./divider/DividerBasic.tsx.preview?raw";
import DividerVertical from "./divider/DividerVertical";
import dividerVerticalPreview from "./divider/DividerVertical.tsx.preview?raw";

export const DividerBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={dividerBasicPreview} {...props}>
            <DividerBasic />
        </CodeExample>
    );
};

export const DividerVerticalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={dividerVerticalPreview} {...props}>
            <DividerVertical />
        </CodeExample>
    );
};
