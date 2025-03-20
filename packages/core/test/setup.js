/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(matchers);

afterEach(() => {
    cleanup();
});
