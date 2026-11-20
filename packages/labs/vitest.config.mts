/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "labs",
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        setupFiles: "@blueprintjs/test-commons/vitest-setup-no-enzyme",
        // Written inside the package so turbo caches it with the test task
        ...(process.env.JUNIT_REPORT_PATH && {
            outputFile: { junit: `${process.env.JUNIT_REPORT_PATH}/junit.xml` },
            reporters: ["default", "junit"],
        }),
    },
});
