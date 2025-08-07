/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import ButtonAlignText from "./ButtonAlignText";
import buttonAlignTextPreview from "./ButtonAlignText.tsx.preview?raw";
import buttonAlignTextCode from "./ButtonAlignText.tsx?raw";
import ButtonAnchorButton from "./ButtonAnchorButton";
import buttonAnchorButtonPreview from "./ButtonAnchorButton.tsx.preview?raw";
import buttonAnchorButtonCode from "./ButtonAnchorButton.tsx?raw";
import ButtonBasic from "./ButtonBasic";
import buttonBasicPreview from "./ButtonBasic.tsx.preview?raw";
import buttonBasicCode from "./ButtonBasic.tsx?raw";
import ButtonDisabledButtonTooltip from "./ButtonDisabledButtonTooltip";
import buttonDisabledButtonTooltipPreview from "./ButtonDisabledButtonTooltip.tsx.preview?raw";
import buttonDisabledButtonTooltipCode from "./ButtonDisabledButtonTooltip.tsx?raw";
import ButtonEllipsizeText from "./ButtonEllipsizeText";
import buttonEllipsizeTextPreview from "./ButtonEllipsizeText.tsx.preview?raw";
import buttonEllipsizeTextCode from "./ButtonEllipsizeText.tsx?raw";
import ButtonFill from "./ButtonFill";
import buttonFillPreview from "./ButtonFill.tsx.preview?raw";
import buttonFillCode from "./ButtonFill.tsx?raw";
import ButtonIcon from "./ButtonIcon";
import buttonIconPreview from "./ButtonIcon.tsx.preview?raw";
import buttonIconCode from "./ButtonIcon.tsx?raw";
import ButtonIconWithText from "./ButtonIconWithText";
import buttonIconWithTextPreview from "./ButtonIconWithText.tsx.preview?raw";
import buttonIconWithTextCode from "./ButtonIconWithText.tsx?raw";
import ButtonIntent from "./ButtonIntent";
import buttonIntentPreview from "./ButtonIntent.tsx.preview?raw";
import buttonIntentCode from "./ButtonIntent.tsx?raw";
import ButtonMinimal from "./ButtonMinimal";
import buttonMinimalPreview from "./ButtonMinimal.tsx.preview?raw";
import buttonMinimalCode from "./ButtonMinimal.tsx?raw";
import ButtonOutlined from "./ButtonOutlined";
import buttonOutlinedPreview from "./ButtonOutlined.tsx.preview?raw";
import buttonOutlinedCode from "./ButtonOutlined.tsx?raw";
import ButtonSize from "./ButtonSize";
import buttonSizePreview from "./ButtonSize.tsx.preview?raw";
import buttonSizeCode from "./ButtonSize.tsx?raw";
import ButtonStates from "./ButtonStates";
import buttonStatesPreview from "./ButtonStates.tsx.preview?raw";
import buttonStatesCode from "./ButtonStates.tsx?raw";
import ButtonVariant from "./ButtonVariant";
import buttonVariantPreview from "./ButtonVariant.tsx.preview?raw";
import buttonVariantCode from "./ButtonVariant.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const {
    ButtonAlignTextExample,
    ButtonAnchorButtonExample,
    ButtonBasicExample,
    ButtonDisabledButtonTooltipExample,
    ButtonEllipsizeTextExample,
    ButtonFillExample,
    ButtonIconExample,
    ButtonIconWithTextExample,
    ButtonIntentExample,
    ButtonMinimalExample,
    ButtonOutlinedExample,
    ButtonSizeExample,
    ButtonStatesExample,
    ButtonVariantExample,
} = createExamples({
    ButtonAlignText: buildConfig(
        ButtonAlignText,
        buttonAlignTextPreview,
        buttonAlignTextCode,
        BASE_PATH,
    ),
    ButtonAnchorButton: buildConfig(
        ButtonAnchorButton,
        buttonAnchorButtonPreview,
        buttonAnchorButtonCode,
        BASE_PATH,
    ),
    ButtonBasic: buildConfig(ButtonBasic, buttonBasicPreview, buttonBasicCode, BASE_PATH),
    ButtonDisabledButtonTooltip: buildConfig(
        ButtonDisabledButtonTooltip,
        buttonDisabledButtonTooltipPreview,
        buttonDisabledButtonTooltipCode,
        BASE_PATH,
    ),
    ButtonEllipsizeText: buildConfig(
        ButtonEllipsizeText,
        buttonEllipsizeTextPreview,
        buttonEllipsizeTextCode,
        BASE_PATH,
    ),
    ButtonFill: buildConfig(ButtonFill, buttonFillPreview, buttonFillCode, BASE_PATH),
    ButtonIcon: buildConfig(ButtonIcon, buttonIconPreview, buttonIconCode, BASE_PATH),
    ButtonIconWithText: buildConfig(
        ButtonIconWithText,
        buttonIconWithTextPreview,
        buttonIconWithTextCode,
        BASE_PATH,
    ),
    ButtonIntent: buildConfig(ButtonIntent, buttonIntentPreview, buttonIntentCode, BASE_PATH),
    ButtonMinimal: buildConfig(ButtonMinimal, buttonMinimalPreview, buttonMinimalCode, BASE_PATH),
    ButtonOutlined: buildConfig(
        ButtonOutlined,
        buttonOutlinedPreview,
        buttonOutlinedCode,
        BASE_PATH,
    ),
    ButtonSize: buildConfig(ButtonSize, buttonSizePreview, buttonSizeCode, BASE_PATH),
    ButtonStates: buildConfig(ButtonStates, buttonStatesPreview, buttonStatesCode, BASE_PATH),
    ButtonVariant: buildConfig(ButtonVariant, buttonVariantPreview, buttonVariantCode, BASE_PATH),
});
