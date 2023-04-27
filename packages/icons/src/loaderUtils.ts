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

// injected by webpack.DefinePlugin
declare let NODE_ENV: string;

/** Returns whether bundler-injected variable `NODE_ENV` equals `env`. */
function isNodeEnv(env: string) {
    return typeof NODE_ENV !== "undefined" && NODE_ENV === env;
}

/**
 * Wraps an async task with a performance timer. Only logs to console in development.
 */
export async function wrapWithTimer(taskDescription: string, task: () => Promise<void>) {
    const shouldMeasure = isNodeEnv("development") && typeof performance !== "undefined";
    let start: number;

    /* eslint-disable no-console */
    if (shouldMeasure) {
        start = performance.now();
        console.info(`Started '${taskDescription}'...`);
    }

    await task();

    if (shouldMeasure) {
        const time = Math.round(performance.now() - start!);
        console.info(`Finished '${taskDescription}' in ${time}ms`);
    }
    return;
    /* eslint-enable no-console */
}
