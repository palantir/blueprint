/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

// See https://vitest.dev/guide/browser/ for setup info
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: [
            // without this first import, we hit reference errors
            "@blueprintjs/icons",
            "@cfaester/enzyme-adapter-react-18",
            "@testing-library/jest-dom/vitest",
            "enzyme",
        ],
    },
    test: {
        name: "select",
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["lib/**", "node_modules/**", "src/isotest.test.ts"],
        setupFiles: ["@blueprintjs/test-commons/vitest.setup", "./src/testSetup.ts"],
        browser: {
            provider: playwright(),
            // without screenshotFailures={false}, screenshots are automatically saved to disk
            screenshotFailures: false,
            enabled: true,
            // headless={true} prevents a chrome browser from opening
            headless: true,
            // at least one instance is required
            instances: [{ browser: "chromium" }],
        },
    },
});
