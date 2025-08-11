/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CalloutBasic from "./callout/CalloutBasic";
import calloutBasicPreview from "./callout/CalloutBasic.tsx.preview?raw";
import CalloutCompact from "./callout/CalloutCompact";
import calloutCompactPreview from "./callout/CalloutCompact.tsx.preview?raw";
import CalloutIcon from "./callout/CalloutIcon";
import calloutIconPreview from "./callout/CalloutIcon.tsx.preview?raw";
import CalloutIntent from "./callout/CalloutIntent";
import calloutIntentPreview from "./callout/CalloutIntent.tsx.preview?raw";

export const CalloutBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={calloutBasicPreview} {...props}>
            <CalloutBasic />
        </CodeExample>
    );
};

export const CalloutIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={calloutIntentPreview} {...props}>
            <CalloutIntent />
        </CodeExample>
    );
};

export const CalloutIconExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={calloutIconPreview} {...props}>
            <CalloutIcon />
        </CodeExample>
    );
};

export const CalloutCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={calloutCompactPreview} {...props}>
            <CalloutCompact />
        </CodeExample>
    );
};
