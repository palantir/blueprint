/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import CardListBasic from "./CardListBasic";
import cardListBasicPreview from "./CardListBasic.tsx.preview?raw";
import cardListBasicCode from "./CardListBasic.tsx?raw";
import CardListBordered from "./CardListBordered";
import cardListBorderedPreview from "./CardListBordered.tsx.preview?raw";
import cardListBorderedCode from "./CardListBordered.tsx?raw";
import CardListCompact from "./CardListCompact";
import cardListCompactPreview from "./CardListCompact.tsx.preview?raw";
import cardListCompactCode from "./CardListCompact.tsx?raw";
import CardListSection from "./CardListSection";
import cardListSectionPreview from "./CardListSection.tsx.preview?raw";
import cardListSectionCode from "./CardListSection.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const {
    CardListBasicExample,
    CardListBorderedExample,
    CardListCompactExample,
    CardListSectionExample,
} = createExamples({
    CardListBasic: buildConfig(CardListBasic, cardListBasicPreview, cardListBasicCode, BASE_PATH),
    CardListBordered: buildConfig(
        CardListBordered,
        cardListBorderedPreview,
        cardListBorderedCode,
        BASE_PATH,
    ),
    CardListCompact: buildConfig(
        CardListCompact,
        cardListCompactPreview,
        cardListCompactCode,
        BASE_PATH,
    ),
    CardListSection: buildConfig(
        CardListSection,
        cardListSectionPreview,
        cardListSectionCode,
        BASE_PATH,
    ),
});
