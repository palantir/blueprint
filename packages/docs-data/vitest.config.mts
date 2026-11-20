/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "docs-data",
        environment: "node",
        include: ["**/*.test.{ts,mts}"],
        exclude: ["lib/**", "node_modules/**"],
        setupFiles: "@blueprintjs/test-commons/vitest-setup-no-enzyme",
        // Written inside the package so turbo caches it with the test task
        ...(process.env.JUNIT_REPORT_PATH && {
            outputFile: { junit: `${process.env.JUNIT_REPORT_PATH}/junit.xml` },
            reporters: ["default", "junit"],
        }),
    },
});
