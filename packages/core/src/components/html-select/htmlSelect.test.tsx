/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { type OptionProps } from "../../common";

import { HTMLSelect } from "./htmlSelect";

describe("<HtmlSelect>", () => {
    it("renders options strings", () => {
        render(<HTMLSelect onChange={vi.fn()} options={["a", "b"]} />);
        expect(screen.getByRole("option", { name: "a" })).toHaveValue("a");
        expect(screen.getByRole("option", { name: "b" })).toHaveValue("b");
    });

    it("renders options props", () => {
        const OPTIONS: OptionProps[] = [
            { value: "a" },
            { className: "foo", value: "b" },
            { disabled: true, value: "c" },
            { label: "Dog", value: "d" },
        ];
        render(<HTMLSelect onChange={vi.fn()} options={OPTIONS} />);
        expect(screen.getByRole("option", { name: "a" })).toHaveValue("a");
        expect(screen.getByRole("option", { name: "b" })).toHaveValue("b");
        expect(screen.getByRole("option", { name: "b" })).toHaveClass("foo");
        expect(screen.getByRole("option", { name: "c" })).toHaveValue("c");
        expect(screen.getByRole("option", { name: "c" })).toBeDisabled();
        expect(screen.getByRole("option", { name: "Dog" })).toHaveValue("d");
    });
});
