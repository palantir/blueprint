/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

/**
 * Shared vitest setup file for Blueprint packages that don't use Enzyme.
 * For packages that use Enzyme, use vitest.setup.mts instead.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
    cleanup();
});
