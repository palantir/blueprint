/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

import { createCliLogger } from "./cliLogger.mjs";
import { ICON_SIZES_PX, iconResourcesDir, repoRelative } from "./common.mjs";
import { optimizeSvg } from "./iconSvgoConfig.mjs";

const logger = createCliLogger("icons:format");

async function main() {
    logger.header("Normalizing icon SVG resources");
    let changed = 0;
    let total = 0;

    for (const size of ICON_SIZES_PX) {
        const sizeDir = join(iconResourcesDir, size);
        logger.info(repoRelative(sizeDir));
        const filenames = readdirSync(sizeDir)
            .filter(name => extname(name) === ".svg")
            .sort();

        for (const filename of filenames) {
            total += 1;
            const path = join(sizeDir, filename);
            const source = readFileSync(path, "utf8");
            const optimized = optimizeSvg(source, path);
            if (optimized !== source) {
                writeFileSync(path, optimized);
                changed += 1;
            }
        }
    }

    logger.success(`Checked ${total} SVG file(s), updated ${changed}.`);
}

await main();
