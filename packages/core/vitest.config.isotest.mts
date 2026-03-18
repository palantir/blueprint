/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "core-iso",
        environment: "node",
        include: ["src/isotest.test.ts"],
    },
});
