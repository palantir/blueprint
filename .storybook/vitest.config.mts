/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    root: import.meta.dirname,
    test: {
        environment: "node",
        include: ["tokens/**/*.test.ts"],
        name: "storybook-tokens",
    },
});
