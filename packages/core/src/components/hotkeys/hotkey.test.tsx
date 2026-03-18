/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
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

import { render, screen } from "@testing-library/react";

import { afterAll, afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Hotkey } from "./";

describe("Hotkey", () => {
    it("renders hotkey label", () => {
        render(<Hotkey combo="cmd+C" label="test copy me" group="editing" />);
        expect(screen.getByText("test copy me")).toBeInTheDocument();
    });

    describe("validation", () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());
        afterEach(() => consoleError.mockClear());
        afterAll(() => consoleError.mockRestore());

        it("logs an error for non-global hotkey without a group", () => {
            render(<Hotkey combo="cmd+C" label="test copy me" />);
            expect(consoleError.mock.calls.length).to.equal(1);
        });
    });
});
