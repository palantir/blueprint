/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: "./test/setup.js",
    },
});
