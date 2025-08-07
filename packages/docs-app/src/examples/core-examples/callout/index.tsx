/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import CalloutBasic from "./CalloutBasic";
import calloutBasicPreview from "./CalloutBasic.tsx.preview?raw";
import calloutBasicCode from "./CalloutBasic.tsx?raw";
import CalloutCompact from "./CalloutCompact";
import calloutCompactPreview from "./CalloutCompact.tsx.preview?raw";
import calloutCompactCode from "./CalloutCompact.tsx?raw";
import CalloutIcon from "./CalloutIcon";
import calloutIconPreview from "./CalloutIcon.tsx.preview?raw";
import calloutIconCode from "./CalloutIcon.tsx?raw";
import CalloutIntent from "./CalloutIntent";
import calloutIntentPreview from "./CalloutIntent.tsx.preview?raw";
import calloutIntentCode from "./CalloutIntent.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const {
    CalloutBasicExample,
    CalloutCompactExample,
    CalloutIconExample,
    CalloutIntentExample,
} = createExamples({
    CalloutBasic: buildConfig(CalloutBasic, calloutBasicPreview, calloutBasicCode, BASE_PATH),
    CalloutCompact: buildConfig(
        CalloutCompact,
        calloutCompactPreview,
        calloutCompactCode,
        BASE_PATH,
    ),
    CalloutIcon: buildConfig(CalloutIcon, calloutIconPreview, calloutIconCode, BASE_PATH),
    CalloutIntent: buildConfig(CalloutIntent, calloutIntentPreview, calloutIntentCode, BASE_PATH),
});
