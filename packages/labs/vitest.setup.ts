/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
    cleanup();
});
