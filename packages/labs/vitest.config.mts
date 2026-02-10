/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "labs",
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        setupFiles: "@blueprintjs/test-commons/vitest-setup-no-enzyme",
    },
});
