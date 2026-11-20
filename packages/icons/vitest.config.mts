/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "icons",
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["lib/**", "node_modules/**", "src/isotest.test.ts"],
        setupFiles: "@blueprintjs/test-commons/vitest-setup-no-enzyme",
        // Written inside the package so turbo caches it with the test task
        ...(process.env.JUNIT_REPORT_PATH && {
            outputFile: { junit: `${process.env.JUNIT_REPORT_PATH}/junit.xml` },
            reporters: ["default", "junit"],
        }),
    },
});
