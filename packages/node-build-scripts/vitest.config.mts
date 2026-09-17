/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["src/**/*.test.{mjs,ts}"],
        name: "node-build-scripts",
    },
});
