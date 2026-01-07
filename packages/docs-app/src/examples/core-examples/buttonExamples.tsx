/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ButtonAlignText from "./button/ButtonAlignText";
import buttonAlignTextPreview from "./button/ButtonAlignText.tsx.preview?raw";
import buttonAlignTextCode from "./button/ButtonAlignText.tsx?raw";
import ButtonAnchorButton from "./button/ButtonAnchorButton";
import buttonAnchorButtonPreview from "./button/ButtonAnchorButton.tsx.preview?raw";
import buttonAnchorButtonCode from "./button/ButtonAnchorButton.tsx?raw";
import ButtonBasic from "./button/ButtonBasic";
import buttonBasicPreview from "./button/ButtonBasic.tsx.preview?raw";
import buttonBasicCode from "./button/ButtonBasic.tsx?raw";
import ButtonDisabledButtonTooltip from "./button/ButtonDisabledButtonTooltip";
import buttonDisabledButtonTooltipPreview from "./button/ButtonDisabledButtonTooltip.tsx.preview?raw";
import buttonDisabledButtonTooltipCode from "./button/ButtonDisabledButtonTooltip.tsx?raw";
import ButtonEllipsizeText from "./button/ButtonEllipsizeText";
import buttonEllipsizeTextPreview from "./button/ButtonEllipsizeText.tsx.preview?raw";
import buttonEllipsizeTextCode from "./button/ButtonEllipsizeText.tsx?raw";
import ButtonFill from "./button/ButtonFill";
import buttonFillPreview from "./button/ButtonFill.tsx.preview?raw";
import buttonFillCode from "./button/ButtonFill.tsx?raw";
import ButtonIcon from "./button/ButtonIcon";
import buttonIconPreview from "./button/ButtonIcon.tsx.preview?raw";
import buttonIconCode from "./button/ButtonIcon.tsx?raw";
import ButtonIconWithText from "./button/ButtonIconWithText";
import buttonIconWithTextPreview from "./button/ButtonIconWithText.tsx.preview?raw";
import buttonIconWithTextCode from "./button/ButtonIconWithText.tsx?raw";
import ButtonIntent from "./button/ButtonIntent";
import buttonIntentPreview from "./button/ButtonIntent.tsx.preview?raw";
import buttonIntentCode from "./button/ButtonIntent.tsx?raw";
import ButtonMinimal from "./button/ButtonMinimal";
import buttonMinimalPreview from "./button/ButtonMinimal.tsx.preview?raw";
import buttonMinimalCode from "./button/ButtonMinimal.tsx?raw";
import ButtonOutlined from "./button/ButtonOutlined";
import buttonOutlinedPreview from "./button/ButtonOutlined.tsx.preview?raw";
import buttonOutlinedCode from "./button/ButtonOutlined.tsx?raw";
import ButtonSize from "./button/ButtonSize";
import buttonSizePreview from "./button/ButtonSize.tsx.preview?raw";
import buttonSizeCode from "./button/ButtonSize.tsx?raw";
import ButtonStates from "./button/ButtonStates";
import buttonStatesPreview from "./button/ButtonStates.tsx.preview?raw";
import buttonStatesCode from "./button/ButtonStates.tsx?raw";
import ButtonVariant from "./button/ButtonVariant";
import buttonVariantPreview from "./button/ButtonVariant.tsx.preview?raw";
import buttonVariantCode from "./button/ButtonVariant.tsx?raw";

export const ButtonBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonBasicPreview} sourceCode={buttonBasicCode} {...props}>
            <ButtonBasic />
        </CodeExample>
    );
};

export const ButtonIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonIntentPreview} sourceCode={buttonIntentCode} {...props}>
            <ButtonIntent />
        </CodeExample>
    );
};

export const ButtonVariantExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonVariantPreview} sourceCode={buttonVariantCode} {...props}>
            <ButtonVariant />
        </CodeExample>
    );
};

export const ButtonMinimalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonMinimalPreview} sourceCode={buttonMinimalCode} {...props}>
            <ButtonMinimal />
        </CodeExample>
    );
};

export const ButtonOutlinedExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonOutlinedPreview} sourceCode={buttonOutlinedCode} {...props}>
            <ButtonOutlined />
        </CodeExample>
    );
};

export const ButtonSizeExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonSizePreview} sourceCode={buttonSizeCode} {...props}>
            <ButtonSize />
        </CodeExample>
    );
};

export const ButtonFillExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonFillPreview} sourceCode={buttonFillCode} {...props}>
            <ButtonFill />
        </CodeExample>
    );
};

export const ButtonAlignTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonAlignTextPreview}
            sourceCode={buttonAlignTextCode}
            {...props}
        >
            <ButtonAlignText />
        </CodeExample>
    );
};

export const ButtonEllipsizeTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonEllipsizeTextPreview}
            sourceCode={buttonEllipsizeTextCode}
            {...props}
        >
            <ButtonEllipsizeText />
        </CodeExample>
    );
};

export const ButtonIconWithTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonIconWithTextPreview}
            sourceCode={buttonIconWithTextCode}
            {...props}
        >
            <ButtonIconWithText />
        </CodeExample>
    );
};

export const ButtonIconExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonIconPreview} sourceCode={buttonIconCode} {...props}>
            <ButtonIcon />
        </CodeExample>
    );
};

export const ButtonStatesExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={buttonStatesPreview} sourceCode={buttonStatesCode} {...props}>
            <ButtonStates />
        </CodeExample>
    );
};

export const ButtonAnchorButtonExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonAnchorButtonPreview}
            sourceCode={buttonAnchorButtonCode}
            {...props}
        >
            <ButtonAnchorButton />
        </CodeExample>
    );
};

export const ButtonDisabledButtonTooltipExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={buttonDisabledButtonTooltipPreview}
            sourceCode={buttonDisabledButtonTooltipCode}
            {...props}
        >
            <ButtonDisabledButtonTooltip />
        </CodeExample>
    );
};
