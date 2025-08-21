/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ButtonGroupBasic from "./button-group/ButtonGroupBasic";
import buttonGroupBasicPreview from "./button-group/ButtonGroupBasic.tsx.preview?raw";
import buttonGroupBasicCode from "./button-group/ButtonGroupBasic.tsx?raw";
import ButtonGroupFlex from "./button-group/ButtonGroupFlex";
import buttonGroupFlexPreview from "./button-group/ButtonGroupFlex.tsx.preview?raw";
import buttonGroupFlexCode from "./button-group/ButtonGroupFlex.tsx?raw";
import ButtonGroupIntent from "./button-group/ButtonGroupIntent";
import buttonGroupIntentPreview from "./button-group/ButtonGroupIntent.tsx.preview?raw";
import buttonGroupIntentCode from "./button-group/ButtonGroupIntent.tsx?raw";
import ButtonGroupOutlinedMinimal from "./button-group/ButtonGroupOutlinedMinimal";
import buttonGroupOutlinedMinimalPreview from "./button-group/ButtonGroupOutlinedMinimal.tsx.preview?raw";
import buttonGroupOutlinedMinimalCode from "./button-group/ButtonGroupOutlinedMinimal.tsx?raw";
import ButtonGroupSize from "./button-group/ButtonGroupSize";
import buttonGroupSizePreview from "./button-group/ButtonGroupSize.tsx.preview?raw";
import buttonGroupSizeCode from "./button-group/ButtonGroupSize.tsx?raw";
import ButtonGroupVariant from "./button-group/ButtonGroupVariant";
import buttonGroupVariantPreview from "./button-group/ButtonGroupVariant.tsx.preview?raw";
import buttonGroupVariantCode from "./button-group/ButtonGroupVariant.tsx?raw";
import ButtonGroupVertical from "./button-group/ButtonGroupVertical";
import buttonGroupVerticalPreview from "./button-group/ButtonGroupVertical.tsx.preview?raw";
import buttonGroupVerticalCode from "./button-group/ButtonGroupVertical.tsx?raw";

export const ButtonGroupBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupBasicPreview}
            sourceCode={buttonGroupBasicCode}
            {...props}
        >
            <ButtonGroupBasic />
        </CodeExample>
    );
};

export const ButtonGroupIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupIntentPreview}
            sourceCode={buttonGroupIntentCode}
            {...props}
        >
            <ButtonGroupIntent />
        </CodeExample>
    );
};

export const ButtonGroupVariantExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupVariantPreview}
            sourceCode={buttonGroupVariantCode}
            {...props}
        >
            <ButtonGroupVariant />
        </CodeExample>
    );
};

export const ButtonGroupOutlinedMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupOutlinedMinimalPreview}
            sourceCode={buttonGroupOutlinedMinimalCode}
            {...props}
        >
            <ButtonGroupOutlinedMinimal />
        </CodeExample>
    );
};

export const ButtonGroupSizeExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupSizePreview}
            sourceCode={buttonGroupSizeCode}
            {...props}
        >
            <ButtonGroupSize />
        </CodeExample>
    );
};

export const ButtonGroupFlexExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupFlexPreview}
            sourceCode={buttonGroupFlexCode}
            {...props}
        >
            <ButtonGroupFlex />
        </CodeExample>
    );
};

export const ButtonGroupVerticalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonGroupVerticalPreview}
            sourceCode={buttonGroupVerticalCode}
            {...props}
        >
            <ButtonGroupVertical />
        </CodeExample>
    );
};
