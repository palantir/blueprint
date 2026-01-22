/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { basename } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Default coverage exclusions for Blueprint packages.
 * Ported from karma.conf.js coverageExcludes.
 */
const DEFAULT_COVERAGE_EXCLUDE = [
    // don't check barrel files
    "src/**/index.ts",

    // no need to test legacy APIs
    "src/legacy/*",
    "src/common/keyCodes.ts",

    // not worth full coverage
    "src/accessibility/*",
    "src/common/abstractComponent*",
    "src/common/abstractPureComponent*",
    "src/common/alignment.ts",
    "src/common/buttonVariant.ts",
    "src/common/size.ts",
    "src/common/errors.ts",
    "src/components/html/html.tsx",
    // focus management is difficult to test
    "src/components/overlay/overlayUtils.ts",
    // simple wrapper component
    "src/context/blueprintProvider.tsx",

    // HACKHACK: for karma upgrade only
    "src/common/refs.ts",

    // HACKHACK: need to add hotkeys tests
    "src/components/hotkeys/*",
    "src/context/hotkeys/hotkeysProvider.tsx",

    // HACKHACK: need to add section tests
    "src/components/section/*",
];

const COVERAGE_PERCENT = 80;

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

    /**
     * Additional patterns to exclude from coverage.
     * Default exclusions are always applied.
     */
    coverageExclude?: string[];

    /**
     * Coverage threshold overrides for specific files.
     * Keys are glob patterns, values are threshold objects.
     */
    coverageThresholds?: {
        lines?: number;
        statements?: number;
        branches?: number;
        functions?: number;
    };
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
    const {
        include = ["test/**/*Tests.{ts,tsx}"],
        exclude = [],
        includeEnzyme = true,
        coverageExclude = [],
        coverageThresholds,
    } = options;

    const setupFile = includeEnzyme
        ? "@blueprintjs/test-commons/vitest.setup"
        : "@blueprintjs/test-commons/vitest-setup-no-enzyme";

    // Match Karma's behavior: use JUnit reporter when JUNIT_REPORT_PATH is set (e.g., on CircleCI)
    const junitReportPath = process.env.JUNIT_REPORT_PATH;
    const isCI = !!junitReportPath;

    return defineConfig({
        plugins: [react()],
        test: {
            environment: "jsdom",
            exclude: ["lib/**", "node_modules/**", ...exclude],
            include,
            setupFiles: setupFile,

            // CI-specific configuration for test reporting
            reporters: isCI ? ["default", "junit"] : ["default"],
            outputFile: isCI
                ? {
                      // Match Karma's output structure: reports/<package-name>/report.xml
                      junit: `${junitReportPath}/${basename(process.cwd())}/report.xml`,
                  }
                : undefined,

            // Coverage configuration (run with --coverage flag)
            coverage: {
                provider: "v8",
                exclude: [...DEFAULT_COVERAGE_EXCLUDE, ...coverageExclude],
                thresholds: coverageThresholds ?? {
                    lines: COVERAGE_PERCENT,
                    statements: COVERAGE_PERCENT,
                },
                reporter: ["text", "html", "cobertura"],
                reportsDirectory: "./coverage",
            },
        },
    });
}
