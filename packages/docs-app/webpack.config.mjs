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
import { resolve } from "node:path";
import { cwd } from "node:process";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import { baseConfig } from "@blueprintjs/webpack-build-scripts";

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
            // Compile .mdx files with @mdx-js/loader
            {
                test: /\.mdx$/,
                use: [
                    {
                        loader: "@mdx-js/loader",
                        /** @type {import("@mdx-js/loader").Options} */
                        options: {
                            providerImportSource: "@mdx-js/react",
                            remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
                        },
                    },
                ],
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

    resolve: {
        ...baseConfig.resolve,
        alias: {
            // MDX files live outside docs-app (e.g. in packages/core), so webpack can't
            // resolve @mdx-js/react from their directories. Alias it to docs-app's copy.
            "@mdx-js/react": resolve(cwd(), "node_modules/@mdx-js/react"),
        },
    },

    output: {
        filename: "[name].js",
        path: resolve(cwd(), "./dist"),
        publicPath: "",
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
