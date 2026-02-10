/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

/**
 * Shared vitest setup file for Blueprint packages that use Enzyme.
 * For packages that don't use Enzyme, use vitest-setup-no-enzyme.mts instead.
 */

import "@testing-library/jest-dom/vitest";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { cleanup } from "@testing-library/react";
import Enzyme from "enzyme";
import { afterEach } from "vitest";

Enzyme.configure({ adapter: new Adapter() });

// Cleanup after each test
afterEach(() => {
    cleanup();
});
