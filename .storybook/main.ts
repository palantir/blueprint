/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mergeConfig } from "vite";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

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
            plugins: [react()],
            optimizeDeps: {
                // Pre-bundle icons and React so workspace packages resolve them from root
                include: ["@blueprintjs/icons", "react", "react-dom"],
            },
            resolve: {
                // Blueprint workspace packages: use package names so preview and stories share one copy.
                // Array form so order is guaranteed: more specific (core/lib) must match before core.
                alias: [
                    { find: "@blueprintjs/core/lib", replacement: path.resolve(rootDir, "packages/core/lib") },
                    { find: "@blueprintjs/core", replacement: path.resolve(rootDir, "packages/core/src") },
                    { find: "@blueprintjs/datetime", replacement: path.resolve(rootDir, "packages/datetime") },
                    { find: "@blueprintjs/icons", replacement: path.resolve(rootDir, "packages/icons") },
                    { find: "@blueprintjs/labs", replacement: path.resolve(rootDir, "packages/labs") },
                    { find: "@blueprintjs/select", replacement: path.resolve(rootDir, "packages/select") },
                    { find: "@blueprintjs/table", replacement: path.resolve(rootDir, "packages/table") },
                    { find: "react", replacement: path.resolve(rootDir, "node_modules/react") },
                    { find: "react-dom", replacement: path.resolve(rootDir, "node_modules/react-dom") },
                ],
                dedupe: ["react", "react-dom"],
            },
        });
    },
};

// eslint-disable-next-line import/no-default-export
export default storybookConfig;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
