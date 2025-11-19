/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CardBasic from "./card/CardBasic";
import cardBasicPreview from "./card/CardBasic.tsx.preview?raw";
import cardBasicCode from "./card/CardBasic.tsx?raw";
import CardCompact from "./card/CardCompact";
import cardCompactPreview from "./card/CardCompact.tsx.preview?raw";
import cardCompactCode from "./card/CardCompact.tsx?raw";
import CardElevation from "./card/CardElevation";
import cardElevationPreview from "./card/CardElevation.tsx.preview?raw";
import cardElevationCode from "./card/CardElevation.tsx?raw";
import CardInteractive from "./card/CardInteractive";
import cardInteractivePreview from "./card/CardInteractive.tsx.preview?raw";
import cardInteractiveCode from "./card/CardInteractive.tsx?raw";

export const CardBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={cardBasicPreview} sourceCode={cardBasicCode} {...props}>
            <CardBasic />
        </CodeExample>
    );
};

export const CardInteractiveExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={cardInteractivePreview}
            sourceCode={cardInteractiveCode}
            {...props}
        >
            <CardInteractive />
        </CodeExample>
    );
};

export const CardCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={cardCompactPreview} sourceCode={cardCompactCode} {...props}>
            <CardCompact />
        </CodeExample>
    );
};

export const CardElevationExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={cardElevationPreview} sourceCode={cardElevationCode} {...props}>
            <CardElevation />
        </CodeExample>
    );
};
