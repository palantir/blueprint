/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import userEvent from "@testing-library/user-event";

import { IconNames } from "@blueprintjs/icons";
import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, type OptionProps } from "../../common";

import { SegmentedControl } from "./segmentedControl";

const OPTIONS: Array<OptionProps<string>> = [
    {
        label: "List",
        value: "list",
    },
    {
        disabled: true,
        label: "Grid",
        value: "grid",
    },
    {
        label: "Gallery",
        value: "gallery",
    },
];

describe("<SegmentedControl>", () => {
    it("supports className", () => {
        render(<SegmentedControl className="test" options={OPTIONS} />);
        const segmentedControl = screen.getByRole("radiogroup");
        expect(segmentedControl).toHaveClass(Classes.SEGMENTED_CONTROL);
        expect(segmentedControl).toHaveClass("test");
    });

    it("supports icon", () => {
        render(<SegmentedControl options={[{ icon: IconNames.GRID, value: "grid" }]} />);
        const button = screen.getByRole("radio");
        const icon = button.querySelector(`.${Classes.ICON}`);
        expect(icon).not.toBeNull();
        expect(icon!).toHaveAttribute("data-icon", IconNames.GRID);
    });

    it("button text defaults to value when no label is passed", () => {
        render(<SegmentedControl options={[{ value: "val" }]} />);
        expect(screen.getByRole("radio", { name: "val" })).toBeInTheDocument();
    });

    it("when no default value passed, first button gets tabIndex=0, none have aria-checked initially", () => {
        render(<SegmentedControl options={OPTIONS} />);
        const radios = screen.getAllByRole("radio");
        const listRadio = screen.getByRole("radio", { name: /list/i });
        expect(radios[0]).toBe(listRadio);
        expect(listRadio).toHaveAttribute("tabIndex", "0");
        expect(listRadio).not.toBeChecked();
        expect(radios.filter(r => r.getAttribute("tabIndex") === "0")).toHaveLength(1);
        expect(radios.filter(r => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    });

    it("when defaultValue passed, tabIndex=0 and aria-checked applied to correct option, no others", () => {
        render(<SegmentedControl defaultValue={OPTIONS[2].value} options={OPTIONS} />);
        const radios = screen.getAllByRole("radio");
        const galleryRadio = screen.getByRole("radio", { name: /gallery/i });
        expect(radios[2]).toBe(galleryRadio);
        expect(galleryRadio).toHaveAttribute("tabIndex", "0");
        expect(galleryRadio).toBeChecked();
        expect(radios.filter(r => r.getAttribute("tabIndex") === "0")).toHaveLength(1);
        expect(radios.filter(r => r.getAttribute("aria-checked") === "true")).toHaveLength(1);
    });

    it("changes option button focus when arrow keys are pressed", async () => {
        const user = userEvent.setup();
        render(<SegmentedControl options={OPTIONS} />);
        const radios = screen.getAllByRole("radio");
        const listRadio = screen.getByRole("radio", { name: /list/i });
        const galleryRadio = screen.getByRole("radio", { name: /gallery/i });

        // tab here moves focus to the first radio
        await user.tab();

        await user.keyboard("{ArrowRight}");
        expect(radios[2]).toBe(galleryRadio);
        expect(galleryRadio).toHaveFocus(); // skips disabled Grid

        await user.keyboard("{ArrowRight}");
        expect(radios[0]).toBe(listRadio);
        expect(listRadio).toHaveFocus(); // wraps around to first

        await user.keyboard("{ArrowLeft}");
        expect(galleryRadio).toHaveFocus(); // wraps around to last

        await user.keyboard("{ArrowLeft}");
        expect(listRadio).toHaveFocus(); // moves left and skips disabled
    });

    it("should select the correct option when clicked", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} />);
        const listButton = screen.getByRole("radio", { name: /list/i });

        await user.click(listButton);

        expect(onValueChange).toHaveBeenCalledOnce();
        expect(onValueChange).toHaveBeenCalledWith("list", expect.any(HTMLElement));
        expect(listButton).toBeChecked();
    });

    it("should not allow disabled options to be selected", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} />);
        const gridButton = screen.getByRole("radio", { name: /grid/i });

        await user.click(gridButton);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(gridButton).not.toBeChecked();
    });

    it("should not allow any options to be selected when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<SegmentedControl disabled={true} onValueChange={onValueChange} options={OPTIONS} />);
        const listButton = screen.getByRole("radio", { name: /list/i });
        const gridButton = screen.getByRole("radio", { name: /grid/i });

        await user.click(listButton);
        await user.click(gridButton);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(listButton).not.toBeChecked();
        expect(gridButton).not.toBeChecked();
    });
});
