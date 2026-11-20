/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * @module vitest.config
 * @layer Infrastructure
 * Runs the proposal's color contracts without the component-test workspace.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: [".storybook/tokens/generateConsumerColors.test.ts"],
    },
});
