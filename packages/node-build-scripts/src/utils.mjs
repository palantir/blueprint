/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { basename, dirname, join, resolve } from "node:path";
import { cwd, env } from "node:process";
import { fileURLToPath } from "node:url";
import { packageUpSync } from "package-up";

/**
 * @param {string} dirName name of directory containing XML file.
 * @param {string} fileName name of XML file (defaults to current directory name).
 */
export function junitReportPath(dirName, fileName = basename(cwd())) {
    if (env.JUNIT_REPORT_PATH === undefined) {
        return undefined;
    }

    const rootDir = getRootDir();

    if (rootDir === undefined) {
        return undefined;
    }

    return join(rootDir, env.JUNIT_REPORT_PATH, dirName, `${fileName}.xml`);
}

/**
 * WARNING: this function only works inside the palantir/blueprint monorepo. It is currently broken for
 * consumers who use @blueprintjs/node-build-scripts as an NPM dependency.
 *
 * @see https://github.com/palantir/blueprint/issues/5295
 * @see https://github.com/palantir/blueprint/issues/4942
 *
 * @returns the root directory of this Blueprint monorepo
 */
export function getRootDir() {
    const thisDirName = dirname(fileURLToPath(import.meta.url));
    const manifestFilePath = packageUpSync({ cwd: thisDirName });
    if (manifestFilePath === undefined) {
        return undefined;
    }
    const nodeModuleScriptsDir = dirname(manifestFilePath);
    return resolve(nodeModuleScriptsDir, "..", "..");
}
