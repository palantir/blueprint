/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import DividerBasic from "./DividerBasic";
import dividerBasicPreview from "./DividerBasic.tsx.preview?raw";
import dividerBasicCode from "./DividerBasic.tsx?raw";
import DividerVertical from "./DividerVertical";
import dividerVerticalPreview from "./DividerVertical.tsx.preview?raw";
import dividerVerticalCode from "./DividerVertical.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const { DividerBasicExample, DividerVerticalExample } = createExamples({
    DividerBasic: buildConfig(DividerBasic, dividerBasicPreview, dividerBasicCode, BASE_PATH),
    DividerVertical: buildConfig(
        DividerVertical,
        dividerVerticalPreview,
        dividerVerticalCode,
        BASE_PATH,
    ),
});
