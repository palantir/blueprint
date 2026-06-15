/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import IconUsage from "./icon/IconUsage";
import iconUsagePreview from "./icon/IconUsage.tsx.preview?raw";
import iconUsageCode from "./icon/IconUsage.tsx?raw";

export const IconUsageExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={iconUsagePreview} sourceCode={iconUsageCode} {...props}>
            <IconUsage />
        </CodeExample>
    );
};
