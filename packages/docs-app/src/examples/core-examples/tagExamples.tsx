/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import TagBasic from "./tag/TagBasic";
import tagBasicPreview from "./tag/TagBasic.tsx.preview?raw";
import tagBasicCode from "./tag/TagBasic.tsx?raw";
import TagIntent from "./tag/TagIntent";
import tagIntentPreview from "./tag/TagIntent.tsx.preview?raw";
import tagIntentCode from "./tag/TagIntent.tsx?raw";
import TagMinimal from "./tag/TagMinimal";
import tagMinimalPreview from "./tag/TagMinimal.tsx.preview?raw";
import tagMinimalCode from "./tag/TagMinimal.tsx?raw";

export const TagBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={tagBasicPreview} sourceCode={tagBasicCode} {...props}>
            <TagBasic />
        </CodeExample>
    );
};

export const TagIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={tagIntentPreview} sourceCode={tagIntentCode} {...props}>
            <TagIntent />
        </CodeExample>
    );
};

export const TagMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={tagMinimalPreview} sourceCode={tagMinimalCode} {...props}>
            <TagMinimal />
        </CodeExample>
    );
};
