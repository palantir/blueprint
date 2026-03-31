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

// Extract the resolved swc-loader path from the base config's TypeScript rule,
// since swc-loader is a dependency of webpack-build-scripts, not docs-app.
const swcLoaderPath = baseConfig.module?.rules?.find(
    rule => rule && typeof rule === "object" && rule.test?.toString().includes("tsx?") && "loader" in rule,
)?.loader;

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
            // MDX files: compile MDX → JSX, then transform JSX → JS via swc
            {
                test: /\.mdx$/,
                use: [
                    {
                        loader: swcLoaderPath,
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "ecmascript",
                                    jsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: "automatic",
                                        useBuiltins: true,
                                    },
                                },
                            },
                        },
                    },
                    {
                        loader: "@mdx-js/loader",
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

    output: {
        filename: "[name].js",
        path: resolve(cwd(), "./dist"),
        publicPath: "",
    },

    resolve: {
        ...baseConfig.resolve,
        extensions: [...(baseConfig.resolve?.extensions || []), ".mdx"],
        alias: {
            ...baseConfig.resolve?.alias,
            // MDX compiler injects `import … from "@mdx-js/react"` into every .mdx file.
            // Since .mdx files live in other packages (core, datetime, etc.) that don't
            // depend on @mdx-js/react, webpack can't resolve it from their directories.
            // This alias forces resolution through docs-app's own node_modules.
            "@mdx-js/react": resolve(cwd(), "node_modules/@mdx-js/react"),
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
