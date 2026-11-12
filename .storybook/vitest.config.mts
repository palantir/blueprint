/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    root: fileURLToPath(new URL(".", import.meta.url)),
    test: {
        environment: "node",
        include: ["tokens/**/*.test.ts"],
        name: "storybook-tokens",
    },
});
