/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for @blueprintjs/core with both jsdom (unit) and browser projects.
 *
 * - Unit tests run in jsdom (fast, for most tests)
 * - Browser tests run in Chromium via Playwright (for tests requiring real browser APIs)
 *
 * Tests use `describe.runIf(isBrowser)` or `describe.runIf(isJsdom)` to select which
 * environment they run in. Tests without a condition run in both environments.
 */
export default defineConfig({
    plugins: [react()],
    test: {
        projects: [
            {
                test: {
                    name: "unit",
                    include: ["test/**/*Tests.{ts,tsx}"],
                    exclude: ["lib/**", "node_modules/**", "test/**/*.browser.{ts,tsx}"],
                    environment: "jsdom",
                    setupFiles: "@blueprintjs/test-commons/vitest.setup",
                },
            },
            {
                test: {
                    name: "browser",
                    // Only include explicitly marked browser tests
                    include: ["test/**/*.browser.{ts,tsx}"],
                    exclude: ["lib/**", "node_modules/**"],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        instances: [{ browser: "chromium" }],
                    },
                    setupFiles: "@blueprintjs/test-commons/vitest-browser.setup",
                },
            },
        ],
    },
});
