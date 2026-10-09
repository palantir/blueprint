/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const coreRequire = createRequire(new URL("../packages/core/package.json", import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@testing-library/react": coreRequire.resolve("@testing-library/react"),
            "@testing-library/user-event": coreRequire.resolve("@testing-library/user-event"),
        },
    },
    test: {
        environment: "jsdom",
        include: [".storybook/**/*.test.{ts,tsx}"],
        root: fileURLToPath(new URL("..", import.meta.url)),
    },
});
