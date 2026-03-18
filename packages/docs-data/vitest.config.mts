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
    },
});
