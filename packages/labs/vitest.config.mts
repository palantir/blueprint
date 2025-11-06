/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        setupFiles: "./vitest.setup.mts",
    },
});
