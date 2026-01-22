/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import type { StorybookConfig } from "@storybook/react-webpack5";
import webpack from "webpack";

const config: StorybookConfig = {
    stories: ["../packages/core/src/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-essentials", "@storybook/addon-webpack5-compiler-swc"],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    typescript: {
        check: false,
        reactDocgen: "react-docgen-typescript",
    },
    swc: () => ({
        jsc: {
            transform: {
                react: {
                    runtime: "classic",
                },
            },
        },
    }),
    webpackFinal: async config => {
        // Add SCSS support
        config.module?.rules?.push({
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
        });

        // Provide React globally for components that use classic JSX transform
        config.plugins?.push(
            new webpack.ProvidePlugin({
                React: "react",
            }),
        );

        return config;
    },
};

export default config;
