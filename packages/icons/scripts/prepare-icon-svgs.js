/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

/**
 * @fileoverview Simplifies SVGs to make it easier for icon font generation tools to process.
 */

const fs = require("fs");
const path = require("path");
const svgFixer = require("oslllo-svg-fixer");

const { BUILD_DIR, RESOURCES_DIR } = require("./common");

(async function() {
    await fixSVGs(16);
    await fixSVGs(20);
})();

async function fixSVGs(size) {
    console.info(`Tranforming ${size}px icon SVGs into an icon-font-ready representation...`);
    const resourcesDir = path.join(RESOURCES_DIR, `${size}px`);
    const buildDir = path.join(BUILD_DIR, `${size}px`);
    fs.mkdirSync(buildDir, { recursive: true });
    return svgFixer(resourcesDir, buildDir, { showProgressBar: true }).fix();
}
