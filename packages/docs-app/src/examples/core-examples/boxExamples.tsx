/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";

import { Box, H4 } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const BoxBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Box className="decoration" padding={2}>
            Content
        </Box>`;
    return (
        <CodeExample previewCode={code} sourceCode={code} {...props}>
            <Box className="decoration" padding={2}>
                Content
            </Box>
        </CodeExample>
    );
};

export const BoxAsChildExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Box asChild={true} marginYEnd={0}>
            <H4>This heading has no margin.</H4>
        </Box>`;
    return (
        <CodeExample previewCode={code} sourceCode={code} {...props}>
            <Box asChild={true} marginYEnd={0}>
                <H4>This heading has no margin.</H4>
            </Box>
        </CodeExample>
    );
};
