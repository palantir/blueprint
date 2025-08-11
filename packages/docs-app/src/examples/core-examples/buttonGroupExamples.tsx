/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ButtonGroupBasic from "./button-group/ButtonGroupBasic";
import buttonGroupBasicPreview from "./button-group/ButtonGroupBasic.tsx.preview?raw";
import ButtonGroupFlex from "./button-group/ButtonGroupFlex";
import buttonGroupFlexPreview from "./button-group/ButtonGroupFlex.tsx.preview?raw";
import ButtonGroupIntent from "./button-group/ButtonGroupIntent";
import buttonGroupIntentPreview from "./button-group/ButtonGroupIntent.tsx.preview?raw";
import ButtonGroupOutlinedMinimal from "./button-group/ButtonGroupOutlinedMinimal";
import buttonGroupOutlinedMinimalPreview from "./button-group/ButtonGroupOutlinedMinimal.tsx.preview?raw";
import ButtonGroupSize from "./button-group/ButtonGroupSize";
import buttonGroupSizePreview from "./button-group/ButtonGroupSize.tsx.preview?raw";
import ButtonGroupVariant from "./button-group/ButtonGroupVariant";
import buttonGroupVariantPreview from "./button-group/ButtonGroupVariant.tsx.preview?raw";
import ButtonGroupVertical from "./button-group/ButtonGroupVertical";
import buttonGroupVerticalPreview from "./button-group/ButtonGroupVertical.tsx.preview?raw";

export const ButtonGroupBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupBasicPreview} {...props}>
            <ButtonGroupBasic />
        </CodeExample>
    );
};

export const ButtonGroupIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupIntentPreview} {...props}>
            <ButtonGroupIntent />
        </CodeExample>
    );
};

export const ButtonGroupVariantExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupVariantPreview} {...props}>
            <ButtonGroupVariant />
        </CodeExample>
    );
};

export const ButtonGroupOutlinedMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupOutlinedMinimalPreview} {...props}>
            <ButtonGroupOutlinedMinimal />
        </CodeExample>
    );
};

export const ButtonGroupSizeExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupSizePreview} {...props}>
            <ButtonGroupSize />
        </CodeExample>
    );
};

export const ButtonGroupFlexExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupFlexPreview} {...props}>
            <ButtonGroupFlex />
        </CodeExample>
    );
};

export const ButtonGroupVerticalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonGroupVerticalPreview} {...props}>
            <ButtonGroupVertical />
        </CodeExample>
    );
};
