/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "select",
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        include: ["src/**/*.test.{ts,tsx}"],
        setupFiles: "@blueprintjs/test-commons/vitest.setup",
    },
});
