/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { "@blueprintjs/core": fileURLToPath(new URL("../../../packages/core/src/index.ts", import.meta.url)) },
        dedupe: ["react", "react-dom"],
    },
    test: {
        css: true,
        environment: "jsdom",
        include: [".storybook/spikes/tabs/*.test.tsx"],
    },
});
