/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ButtonAlignText from "./button/ButtonAlignText";
import buttonAlignTextPreview from "./button/ButtonAlignText.tsx.preview?raw";
import ButtonAnchorButton from "./button/ButtonAnchorButton";
import buttonAnchorButtonPreview from "./button/ButtonAnchorButton.tsx.preview?raw";
import ButtonBasic from "./button/ButtonBasic";
import buttonBasicPreview from "./button/ButtonBasic.tsx.preview?raw";
import ButtonDisabledButtonTooltip from "./button/ButtonDisabledButtonTooltip";
import buttonDisabledButtonTooltipPreview from "./button/ButtonDisabledButtonTooltip.tsx.preview?raw";
import ButtonEllipsizeText from "./button/ButtonEllipsizeText";
import buttonEllipsizeTextPreview from "./button/ButtonEllipsizeText.tsx.preview?raw";
import ButtonFill from "./button/ButtonFill";
import buttonFillPreview from "./button/ButtonFill.tsx.preview?raw";
import ButtonIcon from "./button/ButtonIcon";
import buttonIconPreview from "./button/ButtonIcon.tsx.preview?raw";
import ButtonIconWithText from "./button/ButtonIconWithText";
import buttonIconWithTextPreview from "./button/ButtonIconWithText.tsx.preview?raw";
import ButtonIntent from "./button/ButtonIntent";
import buttonIntentPreview from "./button/ButtonIntent.tsx.preview?raw";
import ButtonMinimal from "./button/ButtonMinimal";
import buttonMinimalPreview from "./button/ButtonMinimal.tsx.preview?raw";
import ButtonOutlined from "./button/ButtonOutlined";
import buttonOutlinedPreview from "./button/ButtonOutlined.tsx.preview?raw";
import ButtonSize from "./button/ButtonSize";
import buttonSizePreview from "./button/ButtonSize.tsx.preview?raw";
import ButtonStates from "./button/ButtonStates";
import buttonStatesPreview from "./button/ButtonStates.tsx.preview?raw";
import ButtonVariant from "./button/ButtonVariant";
import buttonVariantPreview from "./button/ButtonVariant.tsx.preview?raw";

export const ButtonBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonBasicPreview} {...props}>
            <ButtonBasic />
        </CodeExample>
    );
};

export const ButtonIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonIntentPreview} {...props}>
            <ButtonIntent />
        </CodeExample>
    );
};

export const ButtonVariantExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonVariantPreview} {...props}>
            <ButtonVariant />
        </CodeExample>
    );
};

export const ButtonMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonMinimalPreview} {...props}>
            <ButtonMinimal />
        </CodeExample>
    );
};

export const ButtonOutlinedExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonOutlinedPreview} {...props}>
            <ButtonOutlined />
        </CodeExample>
    );
};

export const ButtonSizeExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonSizePreview} {...props}>
            <ButtonSize />
        </CodeExample>
    );
};

export const ButtonFillExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonFillPreview} {...props}>
            <ButtonFill />
        </CodeExample>
    );
};

export const ButtonAlignTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonAlignTextPreview} {...props}>
            <ButtonAlignText />
        </CodeExample>
    );
};

export const ButtonEllipsizeTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonEllipsizeTextPreview} {...props}>
            <ButtonEllipsizeText />
        </CodeExample>
    );
};

export const ButtonIconWithTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonIconWithTextPreview} {...props}>
            <ButtonIconWithText />
        </CodeExample>
    );
};

export const ButtonIconExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonIconPreview} {...props}>
            <ButtonIcon />
        </CodeExample>
    );
};

export const ButtonStatesExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonStatesPreview} {...props}>
            <ButtonStates />
        </CodeExample>
    );
};

export const ButtonAnchorButtonExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonAnchorButtonPreview} {...props}>
            <ButtonAnchorButton />
        </CodeExample>
    );
};

export const ButtonDisabledButtonTooltipExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={buttonDisabledButtonTooltipPreview} {...props}>
            <ButtonDisabledButtonTooltip />
        </CodeExample>
    );
};
