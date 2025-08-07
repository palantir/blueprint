/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import ButtonGroupBasic from "./ButtonGroupBasic";
import buttonGroupBasicPreview from "./ButtonGroupBasic.tsx.preview?raw";
import buttonGroupBasicCode from "./ButtonGroupBasic.tsx?raw";
import ButtonGroupFlex from "./ButtonGroupFlex";
import buttonGroupFlexPreview from "./ButtonGroupFlex.tsx.preview?raw";
import buttonGroupFlexCode from "./ButtonGroupFlex.tsx?raw";
import ButtonGroupIntent from "./ButtonGroupIntent";
import buttonGroupIntentPreview from "./ButtonGroupIntent.tsx.preview?raw";
import buttonGroupIntentCode from "./ButtonGroupIntent.tsx?raw";
import ButtonGroupOutlinedMinimal from "./ButtonGroupOutlinedMinimal";
import buttonGroupOutlinedMinimalPreview from "./ButtonGroupOutlinedMinimal.tsx.preview?raw";
import buttonGroupOutlinedMinimalCode from "./ButtonGroupOutlinedMinimal.tsx?raw";
import ButtonGroupSize from "./ButtonGroupSize";
import buttonGroupSizePreview from "./ButtonGroupSize.tsx.preview?raw";
import buttonGroupSizeCode from "./ButtonGroupSize.tsx?raw";
import ButtonGroupVariant from "./ButtonGroupVariant";
import buttonGroupVariantPreview from "./ButtonGroupVariant.tsx.preview?raw";
import buttonGroupVariantCode from "./ButtonGroupVariant.tsx?raw";
import ButtonGroupVertical from "./ButtonGroupVertical";
import buttonGroupVerticalPreview from "./ButtonGroupVertical.tsx.preview?raw";
import buttonGroupVerticalCode from "./ButtonGroupVertical.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const {
    ButtonGroupBasicExample,
    ButtonGroupFlexExample,
    ButtonGroupIntentExample,
    ButtonGroupOutlinedMinimalExample,
    ButtonGroupSizeExample,
    ButtonGroupVariantExample,
    ButtonGroupVerticalExample,
} = createExamples({
    ButtonGroupBasic: buildConfig(
        ButtonGroupBasic,
        buttonGroupBasicPreview,
        buttonGroupBasicCode,
        BASE_PATH,
    ),
    ButtonGroupFlex: buildConfig(
        ButtonGroupFlex,
        buttonGroupFlexPreview,
        buttonGroupFlexCode,
        BASE_PATH,
    ),
    ButtonGroupIntent: buildConfig(
        ButtonGroupIntent,
        buttonGroupIntentPreview,
        buttonGroupIntentCode,
        BASE_PATH,
    ),
    ButtonGroupOutlinedMinimal: buildConfig(
        ButtonGroupOutlinedMinimal,
        buttonGroupOutlinedMinimalPreview,
        buttonGroupOutlinedMinimalCode,
        BASE_PATH,
    ),
    ButtonGroupSize: buildConfig(
        ButtonGroupSize,
        buttonGroupSizePreview,
        buttonGroupSizeCode,
        BASE_PATH,
    ),
    ButtonGroupVariant: buildConfig(
        ButtonGroupVariant,
        buttonGroupVariantPreview,
        buttonGroupVariantCode,
        BASE_PATH,
    ),
    ButtonGroupVertical: buildConfig(
        ButtonGroupVertical,
        buttonGroupVerticalPreview,
        buttonGroupVerticalCode,
        BASE_PATH,
    ),
});
