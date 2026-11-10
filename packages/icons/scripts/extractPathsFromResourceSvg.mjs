/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-check

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { iconResourcesDir } from "./common.mjs";
import { optimizeSvg } from "./iconSvgoConfig.mjs";

/**
 * Extracts path `d` strings from an SVG file on disk, running it through the same SVGO normalization
 * as the rest of the icon pipeline. This is the single place coupled to SVGO's output shape; callers
 * supply the file path. Used by both the legacy ({@link generate-icon-paths.mjs},
 * {@link generate-icon-components.mjs}) and next ({@link generate-next-icon-components.mjs}) pipelines.
 *
 * @param {string} svgPath absolute path to an `.svg` file
 * @returns {string[]}
 */
export function extractPathsFromSvgFile(svgPath) {
    const source = readFileSync(svgPath, "utf-8");
    const optimized = optimizeSvg(source, svgPath);
    /** @type string[] */
    const paths = [];
    // Match `d` attributes on `<path>` elements from our normalized SVGO output.
    const re = /<path[^>]*\sd="([^"]+)"/g;
    let m;
    while ((m = re.exec(optimized)) !== null) {
        paths.push(m[1]);
    }
    return paths;
}

/**
 * Extracts path `d` strings from a legacy 16px/20px resource icon SVG. This matches the pipeline used
 * for {@link generate-icon-paths.mjs} and the path modules consumed by `<Icon />` from core.
 *
 * @param {16 | 20} iconSize
 * @param {string} iconName
 * @returns {Promise<string[]>}
 */
export async function extractPathsFromResourceSvg(iconSize, iconName) {
    return extractPathsFromSvgFile(join(iconResourcesDir, `${iconSize}px`, `${iconName}.svg`));
}
