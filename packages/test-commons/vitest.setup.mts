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
import { afterAll, afterEach, beforeAll, it } from "vitest";

// Mocha-style lifecycle hooks for packages that still use them (e.g. table)
(globalThis as any).before = beforeAll;
(globalThis as any).after = afterAll;
// Mocha-style xit = skip (e.g. table selectionTests)
(globalThis as any).xit = (name: string, fn: () => void) => it.skip(name, fn);

Enzyme.configure({ adapter: new Adapter() });

// Cleanup after each test
afterEach(() => {
    cleanup();
});
