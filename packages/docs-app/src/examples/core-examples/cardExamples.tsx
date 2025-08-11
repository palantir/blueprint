/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CardBasic from "./card/CardBasic";
import cardBasicPreview from "./card/CardBasic.tsx.preview?raw";
import CardCompact from "./card/CardCompact";
import cardCompactPreview from "./card/CardCompact.tsx.preview?raw";
import CardElevation from "./card/CardElevation";
import cardElevationPreview from "./card/CardElevation.tsx.preview?raw";
import CardInteractive from "./card/CardInteractive";
import cardInteractivePreview from "./card/CardInteractive.tsx.preview?raw";

export const CardBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardBasicPreview} {...props}>
            <CardBasic />
        </CodeExample>
    );
};

export const CardInteractiveExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardInteractivePreview} {...props}>
            <CardInteractive />
        </CodeExample>
    );
};

export const CardCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardCompactPreview} {...props}>
            <CardCompact />
        </CodeExample>
    );
};

export const CardElevationExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardElevationPreview} {...props}>
            <CardElevation />
        </CodeExample>
    );
};
