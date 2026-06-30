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

/** A stand-in for a consumer-provided icon component injected as a JSX element. */
function CustomIcon() {
    return <span data-testid="custom-icon" />;
}

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

    describe("icon", () => {
        it("renders the double-caret-vertical icon by default", () => {
            const { container } = render(<HTMLSelect onChange={vi.fn()} options={["a"]} />);
            expect(container.querySelector('[data-icon="double-caret-vertical"]')).toBeInTheDocument();
        });

        it("renders a supported caret name passed via `icon`", () => {
            const { container } = render(<HTMLSelect icon="caret-down" onChange={vi.fn()} options={["a"]} />);
            expect(container.querySelector('[data-icon="caret-down"]')).toBeInTheDocument();
            expect(container.querySelector('[data-icon="double-caret-vertical"]')).not.toBeInTheDocument();
        });

        it("accepts any icon name, not just the carets", () => {
            const { container } = render(<HTMLSelect icon="filter" onChange={vi.fn()} options={["a"]} />);
            expect(container.querySelector('[data-icon="filter"]')).toBeInTheDocument();
        });

        it("renders an injected icon element", () => {
            render(<HTMLSelect icon={<CustomIcon />} onChange={vi.fn()} options={["a"]} />);
            expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
        });

        it("forwards `iconProps` to the icon", () => {
            const { container } = render(
                <HTMLSelect iconProps={{ className: "custom-icon-class" }} onChange={vi.fn()} options={["a"]} />,
            );
            expect(container.querySelector(".custom-icon-class")).toBeInTheDocument();
        });

        it("supports `iconName` prop", () => {
            const { container } = render(
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                <HTMLSelect iconName="caret-down" onChange={vi.fn()} options={["a"]} />,
            );
            expect(container.querySelector('[data-icon="caret-down"]')).toBeInTheDocument();
        });

        it("prefers `icon` over deprecated `iconName`", () => {
            const { container } = render(
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                <HTMLSelect icon="filter" iconName="caret-down" onChange={vi.fn()} options={["a"]} />,
            );
            expect(container.querySelector('[data-icon="filter"]')).toBeInTheDocument();
            expect(container.querySelector('[data-icon="caret-down"]')).not.toBeInTheDocument();
        });
    });
});
