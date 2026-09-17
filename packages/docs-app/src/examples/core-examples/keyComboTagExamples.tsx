/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import KeyComboTagBasic from "./keyComboTag/KeyComboTagBasic";
import keyComboTagBasicPreview from "./keyComboTag/KeyComboTagBasic.tsx.preview?raw";
import keyComboTagBasicCode from "./keyComboTag/KeyComboTagBasic.tsx?raw";
import KeyComboTagMinimal from "./keyComboTag/KeyComboTagMinimal";
import keyComboTagMinimalPreview from "./keyComboTag/KeyComboTagMinimal.tsx.preview?raw";
import keyComboTagMinimalCode from "./keyComboTag/KeyComboTagMinimal.tsx?raw";
import KeyComboTagModifiers from "./keyComboTag/KeyComboTagModifiers";
import keyComboTagModifiersPreview from "./keyComboTag/KeyComboTagModifiers.tsx.preview?raw";
import keyComboTagModifiersCode from "./keyComboTag/KeyComboTagModifiers.tsx?raw";

export const KeyComboTagBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={keyComboTagBasicPreview}
            sourceCode={keyComboTagBasicCode}
            {...props}
        >
            <KeyComboTagBasic />
        </CodeExample>
    );
};

export const KeyComboTagMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={keyComboTagMinimalPreview}
            sourceCode={keyComboTagMinimalCode}
            {...props}
        >
            <KeyComboTagMinimal />
        </CodeExample>
    );
};

export const KeyComboTagModifiersExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={keyComboTagModifiersPreview}
            sourceCode={keyComboTagModifiersCode}
            {...props}
        >
            <KeyComboTagModifiers />
        </CodeExample>
    );
};
