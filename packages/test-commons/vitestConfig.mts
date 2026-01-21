/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export interface BlueprintVitestOptions {
    /**
     * Test file patterns to include.
     *
     * @default ["test/**\/*Tests.{ts,tsx}"]
     */
    include?: string[];

    /**
     * Additional patterns to exclude from tests.
     * "lib/**" and "node_modules/**" are always excluded.
     */
    exclude?: string[];

    /**
     * Whether to include Enzyme setup (configures React 18 adapter).
     * Set to false for packages using only testing-library.
     *
     * @default true
     */
    includeEnzyme?: boolean;
}

/**
 * Creates a vitest configuration for Blueprint packages.
 *
 * @example
 * // vitest.config.mts
 * import { createBlueprintVitestConfig } from "@blueprintjs/test-commons/vitestConfig";
 *
 * export default createBlueprintVitestConfig({
 *     include: ["test/**\/*Tests.{ts,tsx}"],
 * });
 *
 * @example
 * // For packages not using Enzyme (modern testing-library only)
 * export default createBlueprintVitestConfig({
 *     include: ["src/**\/*.{test,spec}.{ts,tsx}"],
 *     includeEnzyme: false,
 * });
 */
export function createBlueprintVitestConfig(options: BlueprintVitestOptions = {}) {
    const { include = ["test/**/*Tests.{ts,tsx}"], exclude = [], includeEnzyme = true } = options;

    const setupFile = includeEnzyme
        ? "@blueprintjs/test-commons/vitest.setup"
        : "@blueprintjs/test-commons/vitest-setup-no-enzyme";

    return defineConfig({
        plugins: [react()],
        test: {
            environment: "jsdom",
            exclude: ["lib/**", "node_modules/**", ...exclude],
            include,
            setupFiles: setupFile,
        },
    });
}
