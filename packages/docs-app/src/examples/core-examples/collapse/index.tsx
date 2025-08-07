/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import CollapseBasic from "./CollapseBasic";
import collapseBasicPreview from "./CollapseBasic.tsx.preview?raw";
import collapseBasicCode from "./CollapseBasic.tsx?raw";
import CollapseMounted from "./CollapseMounted";
import collapseMountedPreview from "./CollapseMounted.tsx.preview?raw";
import collapseMountedCode from "./CollapseMounted.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const { CollapseBasicExample, CollapseMountedExample } = createExamples({
    CollapseBasic: buildConfig(CollapseBasic, collapseBasicPreview, collapseBasicCode, BASE_PATH),
    CollapseMounted: buildConfig(
        CollapseMounted,
        collapseMountedPreview,
        collapseMountedCode,
        BASE_PATH,
    ),
});
