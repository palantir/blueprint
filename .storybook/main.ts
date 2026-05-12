/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mergeConfig } from "vite";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const storybookConfig: StorybookConfig = {
    core: {
        disableTelemetry: true,
    },

    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },

    stories: ["../packages/{core,datetime,labs,select,table}/src/**/*.stories.@(ts|tsx)"],

    async viteFinal(config) {
        return mergeConfig(config, {
            optimizeDeps: {
                // Pre-bundle icons and React so workspace packages resolve them from root
                include: ["@blueprintjs/icons", "react", "react-dom"],
            },
            plugins: [react()],
            resolve: {
                // Blueprint workspace packages: use package names so preview and stories share one copy.
                // Array form so order is guaranteed: more specific (core/lib) must match before core.
                alias: [
                    { find: "@storybook-common", replacement: resolve(rootDir, ".storybook/common") },
                    { find: "@blueprintjs/core/lib", replacement: resolve(rootDir, "packages/core/lib") },
                    { find: "@blueprintjs/core", replacement: resolve(rootDir, "packages/core/src") },
                    { find: "@blueprintjs/datetime", replacement: resolve(rootDir, "packages/datetime") },
                    { find: "@blueprintjs/icons", replacement: resolve(rootDir, "packages/icons") },
                    { find: "@blueprintjs/labs", replacement: resolve(rootDir, "packages/labs") },
                    { find: "@blueprintjs/select", replacement: resolve(rootDir, "packages/select") },
                    { find: "@blueprintjs/table", replacement: resolve(rootDir, "packages/table") },
                    { find: "react", replacement: resolve(rootDir, "node_modules/react") },
                    { find: "react-dom", replacement: resolve(rootDir, "node_modules/react-dom") },
                ],
                dedupe: ["react", "react-dom"],
            },
        });
    },

    addons: [
        getAbsolutePath("@storybook/addon-a11y"),
        getAbsolutePath("@storybook/addon-docs"),
        getAbsolutePath("@storybook/addon-themes"),
    ],
};

// eslint-disable-next-line import/no-default-export
export default storybookConfig;

function getAbsolutePath(value: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
