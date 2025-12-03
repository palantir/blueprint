/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import LinkBasic from "./link/LinkBasic";
import linkBasicPreview from "./link/LinkBasic.tsx.preview?raw";
import linkBasicCode from "./link/LinkBasic.tsx?raw";
import LinkColor from "./link/LinkColor";
import linkColorPreview from "./link/LinkColor.tsx.preview?raw";
import linkColorCode from "./link/LinkColor.tsx?raw";
import LinkExternal from "./link/LinkExternal";
import linkExternalPreview from "./link/LinkExternal.tsx.preview?raw";
import linkExternalCode from "./link/LinkExternal.tsx?raw";
import LinkVariant from "./link/LinkVariant";
import linkVariantPreview from "./link/LinkVariant.tsx.preview?raw";
import linkVariantCode from "./link/LinkVariant.tsx?raw";

export const LinkBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={linkBasicPreview} sourceCode={linkBasicCode} {...props}>
            <LinkBasic />
        </CodeExample>
    );
};

export const LinkVariantExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={linkVariantPreview} sourceCode={linkVariantCode} {...props}>
            <LinkVariant />
        </CodeExample>
    );
};

export const LinkColorExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={linkColorPreview} sourceCode={linkColorCode} {...props}>
            <LinkColor />
        </CodeExample>
    );
};

export const LinkExternalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={linkExternalPreview} sourceCode={linkExternalCode} {...props}>
            <LinkExternal />
        </CodeExample>
    );
};
