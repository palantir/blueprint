/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { svgOptimizer } from "@blueprintjs/node-build-scripts";

/** @type {import("svgo").Config} */
export const iconSvgoConfig = {
    js2svg: {
        indent: 2,
        pretty: true,
    },
    multipass: true,
    plugins: [
        "removeDimensions",
        {
            name: "removeAttrs",
            params: {
                attrs: [
                    "svg:(id|version|x|y|xml.space|xmlns.xlink|enable-background)",
                    "clip-rule|fill-rule|fill|id|stroke|stroke-width",
                ],
            },
        },
        "removeTitle",
        {
            name: "preset-default",
            params: {
                overrides: {
                    mergePaths: { force: true },
                },
            },
        },
    ],
};

/**
 * @param {string} source
 * @param {string} path
 */
export function optimizeSvg(source, path) {
    return svgOptimizer.optimize(source, { path, ...iconSvgoConfig }).data;
}
