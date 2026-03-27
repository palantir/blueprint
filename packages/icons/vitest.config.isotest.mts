/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "icons-iso",
        environment: "node",
        include: ["src/isotest.test.ts"],
    },
});
