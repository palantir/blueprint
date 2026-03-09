/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "datetime",
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["lib/**", "node_modules/**", "src/isotest.test.ts"],
        setupFiles: "@blueprintjs/test-commons/vitest.setup",
        coverage: {
            provider: "v8",
            exclude: [
                // barrel files
                "src/**/index.ts",
                // not worth coverage, fairly simple implementation
                "src/common/timezoneDisplayFormat.ts",
                "src/common/classes.ts",
                // these functions are mocked out in tests to avoid using dynamic imports
                "src/common/dateFnsLocaleUtils.ts",
                // colocated test files and test utilities
                "src/**/*.test.ts",
                "src/**/*.test.tsx",
                "src/**/dateFormatTestUtils.ts",
                "src/**/dayPickerTestUtils.ts",
                "src/**/loadDateFnsLocaleFake.ts",
            ],
            thresholds: {
                // Global aggregate thresholds (not per-file).
                // Per-file checking is handled via glob-pattern overrides below,
                // since Vitest applies the global perFile threshold to ALL files
                // including those with glob overrides (unlike Karma's coverageOverrides).
                lines: 80,
                statements: 80,
                // Per-file overrides (glob-pattern keys).
                // NOTE: global thresholds are NOT inherited for matched files —
                // only the explicitly listed thresholds apply.
                "src/common/dateFnsFormatUtils.ts": {
                    lines: 75,
                    statements: 75,
                },
                "src/common/dayPickerModifiers.ts": {
                    lines: 50,
                    statements: 50,
                },
                "src/common/timezoneMetadata.ts": {
                    lines: 75,
                    statements: 75,
                },
                "src/components/date-input/useDateParser.ts": {
                    lines: 70,
                    statements: 70,
                },
                "src/components/timezone-select/timezoneSelect.tsx": {
                    statements: 75,
                },
                "src/dateInputMigrationUtils.ts": {
                    lines: 70,
                    statements: 70,
                },
            },
        },
    },
});
