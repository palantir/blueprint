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
            {
                extends: true,
                test: {
                    name: "labs",
                    root: "./packages/labs",
                    include: ["src/**/*.{test,spec}.{ts,tsx}"],
                    setupFiles: "@blueprintjs/test-commons/vitest-setup-no-enzyme",
                },
            },
            // TODO: Add core, datetime, datetime2, select, table as they migrate from Karma
        ],
    },
});
