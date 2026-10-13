/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

// CheckboxCard examples
import CheckboxCardAlignIndicator from "./checkboxCard/CheckboxCardAlignIndicator";
import checkboxCardAlignIndicatorPreview from "./checkboxCard/CheckboxCardAlignIndicator.tsx.preview?raw";
import checkboxCardAlignIndicatorCode from "./checkboxCard/CheckboxCardAlignIndicator.tsx?raw";
import CheckboxCardBasic from "./checkboxCard/CheckboxCardBasic";
import checkboxCardBasicPreview from "./checkboxCard/CheckboxCardBasic.tsx.preview?raw";
import checkboxCardBasicCode from "./checkboxCard/CheckboxCardBasic.tsx?raw";
import CheckboxCardCompact from "./checkboxCard/CheckboxCardCompact";
import checkboxCardCompactPreview from "./checkboxCard/CheckboxCardCompact.tsx.preview?raw";
import checkboxCardCompactCode from "./checkboxCard/CheckboxCardCompact.tsx?raw";
import CheckboxCardDisabled from "./checkboxCard/CheckboxCardDisabled";
import checkboxCardDisabledPreview from "./checkboxCard/CheckboxCardDisabled.tsx.preview?raw";
import checkboxCardDisabledCode from "./checkboxCard/CheckboxCardDisabled.tsx?raw";
// RadioCard examples
import RadioCardAlignIndicator from "./radioCard/RadioCardAlignIndicator";
import radioCardAlignIndicatorPreview from "./radioCard/RadioCardAlignIndicator.tsx.preview?raw";
import radioCardAlignIndicatorCode from "./radioCard/RadioCardAlignIndicator.tsx?raw";
import RadioCardBasic from "./radioCard/RadioCardBasic";
import radioCardBasicPreview from "./radioCard/RadioCardBasic.tsx.preview?raw";
import radioCardBasicCode from "./radioCard/RadioCardBasic.tsx?raw";
import RadioCardCompact from "./radioCard/RadioCardCompact";
import radioCardCompactPreview from "./radioCard/RadioCardCompact.tsx.preview?raw";
import radioCardCompactCode from "./radioCard/RadioCardCompact.tsx?raw";
import RadioCardDisabled from "./radioCard/RadioCardDisabled";
import radioCardDisabledPreview from "./radioCard/RadioCardDisabled.tsx.preview?raw";
import radioCardDisabledCode from "./radioCard/RadioCardDisabled.tsx?raw";
// SwitchCard examples
import SwitchCardAlignIndicator from "./switchCard/SwitchCardAlignIndicator";
import switchCardAlignIndicatorPreview from "./switchCard/SwitchCardAlignIndicator.tsx.preview?raw";
import switchCardAlignIndicatorCode from "./switchCard/SwitchCardAlignIndicator.tsx?raw";
import SwitchCardBasic from "./switchCard/SwitchCardBasic";
import switchCardBasicPreview from "./switchCard/SwitchCardBasic.tsx.preview?raw";
import switchCardBasicCode from "./switchCard/SwitchCardBasic.tsx?raw";
import SwitchCardCompact from "./switchCard/SwitchCardCompact";
import switchCardCompactPreview from "./switchCard/SwitchCardCompact.tsx.preview?raw";
import switchCardCompactCode from "./switchCard/SwitchCardCompact.tsx?raw";
import SwitchCardDisabled from "./switchCard/SwitchCardDisabled";
import switchCardDisabledPreview from "./switchCard/SwitchCardDisabled.tsx.preview?raw";
import switchCardDisabledCode from "./switchCard/SwitchCardDisabled.tsx?raw";

// SwitchCard
export const SwitchCardBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={switchCardBasicPreview}
            sourceCode={switchCardBasicCode}
            {...props}
        >
            <SwitchCardBasic />
        </CodeExample>
    );
};

export const SwitchCardCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={switchCardCompactPreview}
            sourceCode={switchCardCompactCode}
            {...props}
        >
            <SwitchCardCompact />
        </CodeExample>
    );
};

export const SwitchCardDisabledExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={switchCardDisabledPreview}
            sourceCode={switchCardDisabledCode}
            {...props}
        >
            <SwitchCardDisabled />
        </CodeExample>
    );
};

export const SwitchCardAlignIndicatorExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={switchCardAlignIndicatorPreview}
            sourceCode={switchCardAlignIndicatorCode}
            {...props}
        >
            <SwitchCardAlignIndicator />
        </CodeExample>
    );
};

// CheckboxCard
export const CheckboxCardBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={checkboxCardBasicPreview}
            sourceCode={checkboxCardBasicCode}
            {...props}
        >
            <CheckboxCardBasic />
        </CodeExample>
    );
};

export const CheckboxCardCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={checkboxCardCompactPreview}
            sourceCode={checkboxCardCompactCode}
            {...props}
        >
            <CheckboxCardCompact />
        </CodeExample>
    );
};

export const CheckboxCardDisabledExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={checkboxCardDisabledPreview}
            sourceCode={checkboxCardDisabledCode}
            {...props}
        >
            <CheckboxCardDisabled />
        </CodeExample>
    );
};

export const CheckboxCardAlignIndicatorExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={checkboxCardAlignIndicatorPreview}
            sourceCode={checkboxCardAlignIndicatorCode}
            {...props}
        >
            <CheckboxCardAlignIndicator />
        </CodeExample>
    );
};

// RadioCard
export const RadioCardBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={radioCardBasicPreview} sourceCode={radioCardBasicCode} {...props}>
            <RadioCardBasic />
        </CodeExample>
    );
};

export const RadioCardCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={radioCardCompactPreview}
            sourceCode={radioCardCompactCode}
            {...props}
        >
            <RadioCardCompact />
        </CodeExample>
    );
};

export const RadioCardDisabledExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={radioCardDisabledPreview}
            sourceCode={radioCardDisabledCode}
            {...props}
        >
            <RadioCardDisabled />
        </CodeExample>
    );
};

export const RadioCardAlignIndicatorExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={radioCardAlignIndicatorPreview}
            sourceCode={radioCardAlignIndicatorCode}
            {...props}
        >
            <RadioCardAlignIndicator />
        </CodeExample>
    );
};
