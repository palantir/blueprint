/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import CardBasic from "./CardBasic";
import cardBasicPreview from "./CardBasic.tsx.preview?raw";
import cardBasicCode from "./CardBasic.tsx?raw";
import CardCompact from "./CardCompact";
import cardCompactPreview from "./CardCompact.tsx.preview?raw";
import cardCompactCode from "./CardCompact.tsx?raw";
import CardElevation from "./CardElevation";
import cardElevationPreview from "./CardElevation.tsx.preview?raw";
import cardElevationCode from "./CardElevation.tsx?raw";
import CardInteractive from "./CardInteractive";
import cardInteractivePreview from "./CardInteractive.tsx.preview?raw";
import cardInteractiveCode from "./CardInteractive.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const {
    CardBasicExample,
    CardCompactExample,
    CardElevationExample,
    CardInteractiveExample,
} = createExamples({
    CardBasic: buildConfig(CardBasic, cardBasicPreview, cardBasicCode, BASE_PATH),
    CardCompact: buildConfig(CardCompact, cardCompactPreview, cardCompactCode, BASE_PATH),
    CardElevation: buildConfig(CardElevation, cardElevationPreview, cardElevationCode, BASE_PATH),
    CardInteractive: buildConfig(
        CardInteractive,
        cardInteractivePreview,
        cardInteractiveCode,
        BASE_PATH,
    ),
});
