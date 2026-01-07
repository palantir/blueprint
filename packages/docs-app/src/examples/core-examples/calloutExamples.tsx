/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CalloutBasic from "./callout/CalloutBasic";
import calloutBasicPreview from "./callout/CalloutBasic.tsx.preview?raw";
import calloutBasicCode from "./callout/CalloutBasic.tsx?raw";
import CalloutCompact from "./callout/CalloutCompact";
import calloutCompactPreview from "./callout/CalloutCompact.tsx.preview?raw";
import calloutCompactCode from "./callout/CalloutCompact.tsx?raw";
import CalloutIcon from "./callout/CalloutIcon";
import calloutIconPreview from "./callout/CalloutIcon.tsx.preview?raw";
import calloutIconCode from "./callout/CalloutIcon.tsx?raw";
import CalloutIntent from "./callout/CalloutIntent";
import calloutIntentPreview from "./callout/CalloutIntent.tsx.preview?raw";
import calloutIntentCode from "./callout/CalloutIntent.tsx?raw";

export const CalloutBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={calloutBasicPreview} sourceCode={calloutBasicCode} {...props}>
            <CalloutBasic />
        </CodeExample>
    );
};

export const CalloutIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={calloutIntentPreview} sourceCode={calloutIntentCode} {...props}>
            <CalloutIntent />
        </CodeExample>
    );
};

export const CalloutIconExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={calloutIconPreview} sourceCode={calloutIconCode} {...props}>
            <CalloutIcon />
        </CodeExample>
    );
};

export const CalloutCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={calloutCompactPreview} sourceCode={calloutCompactCode} {...props}>
            <CalloutCompact />
        </CodeExample>
    );
};
