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
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { baseConfig } from "@blueprintjs/webpack-build-scripts";

// Get the swc-loader path and options from the base config's TypeScript rule
const baseTsRule = baseConfig.module?.rules?.find(
    rule => rule && typeof rule === "object" && rule.test?.toString().includes("tsx?") && "loader" in rule,
);
const swcLoaderPath = baseTsRule?.loader;
const swcLoaderOptions = baseTsRule?.options;

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
            // MDX files: compile to React components via @mdx-js/loader, then transform JSX via swc
            {
                test: /\.mdx$/,
                use: [
                    {
                        loader: swcLoaderPath,
                        options: swcLoaderOptions,
                    },
                    {
                        loader: fileURLToPath(import.meta.resolve("@mdx-js/loader")),
                        options: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [rehypeSlug],
                            providerImportSource: "@mdx-js/react",
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

    resolve: {
        ...baseConfig.resolve,
        extensions: [...(baseConfig.resolve?.extensions || []), ".mdx"],
        alias: {
            ...baseConfig.resolve?.alias,
            // MDX files across all packages generate `import { useMDXComponents } from '@mdx-js/react'`
            // (due to providerImportSource). Ensure this resolves to docs-app's copy.
            "@mdx-js/react": fileURLToPath(import.meta.resolve("@mdx-js/react")),
        },
    },
};
