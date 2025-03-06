/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

/*
 * Reason: fonts must exist in output dir for CSS to reference them
 * Set INPUT / OUTPUT env varibles to change directories
 */

import * as fs from "fs";
import * as path from "path";

const inputDir = path.join(process.env.INPUT ?? "", "src/generated");
const outputDir = path.join(process.env.OUTPUT ?? "", "lib/css");

console.log(`copying fonts (from ${inputDir} to ${outputDir})...`);

fs.mkdirSync(outputDir, { recursive: true });

for (const size of [16, 20]) {
    const dir = path.join(inputDir, `${size}px`);
    const files = fs.readdirSync(dir).filter(fn => /.*(eot|ttf|svg|woff|woff2)$/.test(fn));

    for (const font of files) {
        const inputFile = path.join(dir, font);
        const outputFile = path.join(outputDir, path.basename(font));
        fs.copyFileSync(inputFile, outputFile);
    }
}
