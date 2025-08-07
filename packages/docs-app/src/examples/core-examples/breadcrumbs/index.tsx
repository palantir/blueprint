/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import BreadcrumbsBasic from "./BreadcrumbsBasic";
import BreadcrumbsBasicPreview from "./BreadcrumbsBasic.tsx.preview?raw";
import BreadcrumbsBasicCode from "./BreadcrumbsBasic.tsx?raw";
import BreadcrumbsOverflow from "./BreadcrumbsOverflow";
import BreadcrumbsOverflowPreview from "./BreadcrumbsOverflow.tsx.preview?raw";
import BreadcrumbsOverflowCode from "./BreadcrumbsOverflow.tsx?raw";
import BreadcrumbsRenderer from "./BreadcrumbsRenderer";
import BreadcrumbsRendererPreview from "./BreadcrumbsRenderer.tsx.preview?raw";
import BreadcrumbsRendererCode from "./BreadcrumbsRenderer.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const { BreadcrumbsBasicExample, BreadcrumbsOverflowExample, BreadcrumbsRendererExample } =
    createExamples({
        BreadcrumbsBasic: buildConfig(
            BreadcrumbsBasic,
            BreadcrumbsBasicPreview,
            BreadcrumbsBasicCode,
            BASE_PATH,
        ),
        BreadcrumbsOverflow: buildConfig(
            BreadcrumbsOverflow,
            BreadcrumbsOverflowPreview,
            BreadcrumbsOverflowCode,
            BASE_PATH,
        ),
        BreadcrumbsRenderer: buildConfig(
            BreadcrumbsRenderer,
            BreadcrumbsRendererPreview,
            BreadcrumbsRendererCode,
            BASE_PATH,
        ),
    });
