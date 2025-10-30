/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        passWithNoTests: true,
        setupFiles: "./vitest.setup.ts",
    },
});
