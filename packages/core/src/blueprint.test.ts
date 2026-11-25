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

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

const SRC_DIR = dirname(fileURLToPath(import.meta.url));
const CORE_DIR = resolve(SRC_DIR, "..");
const MONOREPO_ROOT = resolve(CORE_DIR, "../..");

function listScssFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
        entry.isDirectory()
            ? listScssFiles(join(dir, entry.name))
            : entry.name.endsWith(".scss")
              ? [join(dir, entry.name)]
              : [],
    );
}

describe("blueprint.scss", () => {
    // see https://github.com/palantir/blueprint/issues/6051 — `svg-icon()` is a custom Sass
    // function only registered by the Blueprint build, so calling it in shipped sources makes
    // them uncompilable for consumers using plain dart-sass (e.g. webpack sass-loader).
    it("does not invoke the custom `svg-icon()` Sass function in shipped .scss sources", () => {
        const offenders = listScssFiles(SRC_DIR).filter(filePath =>
            /svg-icon\s*\(\s*["']/.test(readFileSync(filePath, "utf8")),
        );
        expect(offenders).toEqual([]);
    });

    // Compiling blueprint.scss requires generated sources from `pnpm compile`
    // (design-tokens/build, @blueprintjs/colors & @blueprintjs/icons lib/scss).
    const generatedSources = [
        join(SRC_DIR, "design-tokens/build/tokens.css"),
        join(CORE_DIR, "node_modules/@blueprintjs/colors/lib/scss/colors.scss"),
        join(CORE_DIR, "node_modules/@blueprintjs/icons/lib/scss/variables.scss"),
    ];
    it.skipIf(!generatedSources.every(existsSync))(
        "compiles with plain dart-sass, without custom functions registered (consumer setup)",
        async () => {
            const result = await sass.compileAsync(join(SRC_DIR, "blueprint.scss"), {
                loadPaths: [join(MONOREPO_ROOT, "node_modules"), join(CORE_DIR, "node_modules")],
                logger: sass.Logger.silent,
            });
            expect(result.css.length).toBeGreaterThan(0);
        },
        60_000,
    );
});
