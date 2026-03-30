/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "eslint-plugin",
        environment: "node",
        include: ["test/**/*.test.{ts,tsx}"],
        // required: @typescript-eslint/rule-tester auto-detects describe/it/afterAll from globals
        globals: true,
    },
});
