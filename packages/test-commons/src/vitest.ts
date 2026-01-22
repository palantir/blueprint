/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Re-exports vitest test utilities with legacy (jasmine/mocha-style) naming.
 * This provides a single import source with consistent naming conventions.
 *
 * @example
 * // Instead of:
 * import { afterAll as after, beforeAll as before, test as it, ... } from "vitest";
 *
 * // Use:
 * import { after, before, it, describe, expect } from "@blueprintjs/test-commons";
 */

// Re-export with legacy naming (jasmine/mocha style)
export { test as it, beforeAll as before, afterAll as after } from "vitest";

// Re-export with original naming (commonly used as-is)
export { describe, beforeEach, afterEach, expect, assert, vi } from "vitest";
