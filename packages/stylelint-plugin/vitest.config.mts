/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "stylelint-plugin",
        environment: "node",
        include: ["test/**/*.test.mjs"],
    },
});
