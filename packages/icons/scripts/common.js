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

const fs = require("fs");
const path = require("path");

const RESOURCES_DIR = path.resolve(__dirname, "../../../resources/icons");
const GENERATED_SRC_DIR = path.resolve(__dirname, "../src/generated");
const NS = "bp4";

/**
 * Writes lines to given filename in GENERATED_SRC_DIR.
 *
 * @param {string} filename
 * @param {Array<string>} lines
 */
function writeLinesToFile(filename, ...lines) {
    const outputPath = path.join(GENERATED_SRC_DIR, filename);
    const contents = [...lines, ""].join("\n");
    fs.writeFileSync(outputPath, contents);
}

module.exports = {
    RESOURCES_DIR,
    GENERATED_SRC_DIR,
    NS,
    writeLinesToFile,
};
