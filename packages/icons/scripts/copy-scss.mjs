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
 * Reason: provide a public API to import Sass variables
 * Set INPUT / OUTPUT env varibles to change directories
 */

import * as fs from "fs";
import * as path from "path";

const inputDir = path.join(process.env.INPUT ?? "", "src");
const outputDir = path.join(process.env.OUTPUT ?? "", "lib/scss");

console.log(`copying scss (from ${inputDir} to ${outputDir})...`);

fs.mkdirSync(outputDir, { recursive: true });

for (const size of [16, 20]) {
    fs.copyFileSync(
        path.join(inputDir, `generated/${size}px/_icon-variables.scss`),
        path.join(outputDir, `blueprint-icons-${size}.scss`),
    );
}

fs.copyFileSync(path.join(inputDir, "templates/_lib_variables.scss"), path.join(outputDir, "variables.scss"));
