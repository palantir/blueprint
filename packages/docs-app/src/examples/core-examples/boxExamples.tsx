/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";

import { Box, Button, H4 } from "@blueprintjs/core";
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

export const BoxAsPropExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Box as="span">Span</Box>
            <Box as={Button} intent="primary">
                Button
            </Box>
        </Box>`;
    return (
        <CodeExample previewCode={code} sourceCode={code} {...props}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Box as="span">Span</Box>
                <Box as={Button} intent="primary">
                    Button
                </Box>
            </Box>
        </CodeExample>
    );
};

export const BoxAsChildExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Box asChild={true} marginBlockEnd={0}>
            <H4>This heading has no margin.</H4>
        </Box>`;
    return (
        <CodeExample previewCode={code} sourceCode={code} {...props}>
            <Box asChild={true} marginBlockEnd={0}>
                <H4>This heading has no margin.</H4>
            </Box>
        </CodeExample>
    );
};
