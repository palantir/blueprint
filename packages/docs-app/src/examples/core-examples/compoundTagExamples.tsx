/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CompoundTagBasic from "./compoundTag/CompoundTagBasic";
import compoundTagBasicPreview from "./compoundTag/CompoundTagBasic.tsx.preview?raw";
import compoundTagBasicCode from "./compoundTag/CompoundTagBasic.tsx?raw";
import CompoundTagFill from "./compoundTag/CompoundTagFill";
import compoundTagFillPreview from "./compoundTag/CompoundTagFill.tsx.preview?raw";
import compoundTagFillCode from "./compoundTag/CompoundTagFill.tsx?raw";
import CompoundTagIcon from "./compoundTag/CompoundTagIcon";
import compoundTagIconPreview from "./compoundTag/CompoundTagIcon.tsx.preview?raw";
import compoundTagIconCode from "./compoundTag/CompoundTagIcon.tsx?raw";
import CompoundTagIntent from "./compoundTag/CompoundTagIntent";
import compoundTagIntentPreview from "./compoundTag/CompoundTagIntent.tsx.preview?raw";
import compoundTagIntentCode from "./compoundTag/CompoundTagIntent.tsx?raw";
import CompoundTagInteractive from "./compoundTag/CompoundTagInteractive";
import compoundTagInteractivePreview from "./compoundTag/CompoundTagInteractive.tsx.preview?raw";
import compoundTagInteractiveCode from "./compoundTag/CompoundTagInteractive.tsx?raw";
import CompoundTagMinimal from "./compoundTag/CompoundTagMinimal";
import compoundTagMinimalPreview from "./compoundTag/CompoundTagMinimal.tsx.preview?raw";
import compoundTagMinimalCode from "./compoundTag/CompoundTagMinimal.tsx?raw";
import CompoundTagRemovable from "./compoundTag/CompoundTagRemovable";
import compoundTagRemovablePreview from "./compoundTag/CompoundTagRemovable.tsx.preview?raw";
import compoundTagRemovableCode from "./compoundTag/CompoundTagRemovable.tsx?raw";
import CompoundTagRound from "./compoundTag/CompoundTagRound";
import compoundTagRoundPreview from "./compoundTag/CompoundTagRound.tsx.preview?raw";
import compoundTagRoundCode from "./compoundTag/CompoundTagRound.tsx?raw";
import CompoundTagSize from "./compoundTag/CompoundTagSize";
import compoundTagSizePreview from "./compoundTag/CompoundTagSize.tsx.preview?raw";
import compoundTagSizeCode from "./compoundTag/CompoundTagSize.tsx?raw";

export const CompoundTagBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagBasicPreview}
            sourceCode={compoundTagBasicCode}
            {...props}
        >
            <CompoundTagBasic />
        </CodeExample>
    );
};

export const CompoundTagIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagIntentPreview}
            sourceCode={compoundTagIntentCode}
            {...props}
        >
            <CompoundTagIntent />
        </CodeExample>
    );
};

export const CompoundTagMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagMinimalPreview}
            sourceCode={compoundTagMinimalCode}
            {...props}
        >
            <CompoundTagMinimal />
        </CodeExample>
    );
};

export const CompoundTagSizeExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagSizePreview}
            sourceCode={compoundTagSizeCode}
            {...props}
        >
            <CompoundTagSize />
        </CodeExample>
    );
};

export const CompoundTagFillExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagFillPreview}
            sourceCode={compoundTagFillCode}
            {...props}
        >
            <CompoundTagFill />
        </CodeExample>
    );
};

export const CompoundTagRoundExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagRoundPreview}
            sourceCode={compoundTagRoundCode}
            {...props}
        >
            <CompoundTagRound />
        </CodeExample>
    );
};

export const CompoundTagIconExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagIconPreview}
            sourceCode={compoundTagIconCode}
            {...props}
        >
            <CompoundTagIcon />
        </CodeExample>
    );
};

export const CompoundTagRemovableExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagRemovablePreview}
            sourceCode={compoundTagRemovableCode}
            {...props}
        >
            <CompoundTagRemovable />
        </CodeExample>
    );
};

export const CompoundTagInteractiveExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={compoundTagInteractivePreview}
            sourceCode={compoundTagInteractiveCode}
            {...props}
        >
            <CompoundTagInteractive />
        </CodeExample>
    );
};
