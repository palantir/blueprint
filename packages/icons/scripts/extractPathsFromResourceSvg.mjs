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

/**
 * Extracts path `d` strings from an on-disk icon SVG.
 *
 * Resource SVGs are expected to be SVGO-normalized in version control (`icons:verify`); this does not re-run SVGO.
 * Each icon has at most one `<path>`; blank icons have none.
 *
 * @param {16 | 20} iconSize
 * @param {string} iconName
 * @returns {string[]}
 */
export function extractPathsFromResourceSvg(iconSize, iconName) {
    const filepath = join(iconResourcesDir, `${iconSize}px`, `${iconName}.svg`);
    const svg = readFileSync(filepath, "utf-8");
    /** @type {string[]} */
    const ds = [];
    let i = 0;
    while (i < svg.length) {
        const pathIdx = svg.indexOf("<path", i);
        if (pathIdx === -1) {
            break;
        }
        const gt = svg.indexOf(">", pathIdx);
        if (gt === -1) {
            break;
        }
        const tag = svg.slice(pathIdx, gt + 1);
        const dq = /\bd\s*=\s*"([^"]*)"/.exec(tag);
        const sq = /\bd\s*=\s*'([^']*)'/.exec(tag);
        const d = dq ? dq[1] : sq ? sq[1] : null;
        if (d !== null) {
            ds.push(d);
        }
        i = gt + 1;
    }
    if (ds.length > 1) {
        throw new Error(
            `Expected at most one <path> in ${filepath} (icon "${iconName}", ${iconSize}px), found ${ds.length}`,
        );
    }
    return ds;
}
