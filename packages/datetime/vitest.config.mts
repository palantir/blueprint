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
        globals: true,
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["lib/**", "node_modules/**"],
        setupFiles: "@blueprintjs/test-commons/vitest.setup",
        env: {
            TZ: "Etc/UTC",
        },
    },
});
