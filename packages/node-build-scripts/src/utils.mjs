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

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { cwd, env } from "node:process";

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
 * Finds the workspace root containing the current package. For standalone packages,
 * falls back to the closest directory containing a package.json file.
 *
 * @param {string} startDir directory to start searching from
 * @returns the root directory of the current workspace or package
 */
export function getRootDir(startDir = cwd()) {
    let currentDir = resolve(startDir);
    let closestPackageDir;

    while (true) {
        const manifestFilePath = join(currentDir, "package.json");
        if (existsSync(manifestFilePath)) {
            closestPackageDir ??= currentDir;

            try {
                const manifest = JSON.parse(readFileSync(manifestFilePath, "utf8"));
                if (manifest.workspaces !== undefined) {
                    return currentDir;
                }
            } catch {
                // Ignore malformed manifests here; the package manager will report them separately.
            }
        }

        if (existsSync(join(currentDir, "pnpm-workspace.yaml"))) {
            return currentDir;
        }

        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) {
            return closestPackageDir;
        }
        currentDir = parentDir;
    }
}
