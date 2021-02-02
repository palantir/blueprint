/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

// only accessible within this file
declare let process: { env: any };

export function isNodeEnv(env: string) {
    return typeof process !== "undefined" && process.env?.NODE_ENV === env;
}

export async function wrapWithTimer(taskDescription: string, task: () => Promise<void>) {
    /* eslint-disable no-console */
    if (isNodeEnv("development")) {
        console.info(`[Blueprint] Started '${taskDescription}'...`);
        console.time(taskDescription);
    }

    await task();

    if (isNodeEnv("development")) {
        console.info(`[Blueprint] finished '${taskDescription}'...`);
        console.timeEnd(taskDescription);
    }
    return;
    /* eslint-enable no-console */
}
