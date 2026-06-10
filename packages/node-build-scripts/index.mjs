/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { optimize } from "svgo";

export const svgOptimizer = { optimize };
export { loadPaths as sassNodeModulesLoadPaths } from "./src/sass/sassNodeModulesLoadPaths.mjs";
export { sassSvgInlinerFactory } from "./src/sass/sassSvgInliner.mjs";
