/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        projects: [
            "packages/core/vitest.config.mts",
            "packages/datetime/vitest.config.mts",
            "packages/docs-data/vitest.config.mts",
            "packages/eslint-plugin/vitest.config.mts",
            "packages/icons/vitest.config.mts",
            "packages/labs/vitest.config.mts",
            "packages/node-build-scripts/vitest.config.mts",
            "packages/select/vitest.config.mts",
            "packages/stylelint-plugin/vitest.config.mts",
            "packages/table/vitest.config.mts",
        ],
    },
});
