/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import CopyWebpackPlugin from "copy-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";

import { baseConfig } from "@blueprintjs/webpack-build-scripts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const monacoThemesDir = resolve(__dirname, "node_modules/monaco-themes/themes");

export default {
    ...baseConfig,

    entry: {
        "docs-app": [
            // bundle entry points
            "./src/index.tsx",
            "./src/index.scss",
        ],
    },

    module: {
        ...baseConfig.module,
        rules: [
            // Import files with ?raw query parameter as strings
            {
                resourceQuery: /raw/,
                type: "asset/source",
            },
            ...(baseConfig.module?.rules
                ?.map(rule => {
                    // prevent ?raw TS files from being processed by TypeScript loader
                    const isTypescriptRule =
                        rule && typeof rule === "object" && rule.test?.toString().includes("tsx?") && "loader" in rule;
                    if (isTypescriptRule) {
                        return { ...rule, resourceQuery: { not: [/raw/] } };
                    }
                    return rule;
                })
                .filter(Boolean) || []),
        ],
    },

    output: {
        filename: "[name].js",
        path: resolve(cwd(), "./dist"),
        publicPath: "",
    },

    resolve: {
        ...baseConfig.resolve,
        alias: {
            ...baseConfig.resolve?.alias,
            // monaco-themes package.json "exports" doesn't expose theme JSON files directly,
            // so we alias the imports to their actual file paths on disk.
            "monaco-themes/themes/GitHub Light.json": resolve(monacoThemesDir, "GitHub Light.json"),
            "monaco-themes/themes/GitHub Dark.json": resolve(monacoThemesDir, "GitHub Dark.json"),
        },
    },

    plugins: [
        ...(baseConfig.plugins || []),
        new CopyWebpackPlugin({
            patterns: [
                // to: is relative to dist/
                { from: "src/index.html", to: "." },
                { from: "src/assets/favicon.png", to: "assets" },
            ],
        }),
        new MonacoWebpackPlugin(),
    ],
};
