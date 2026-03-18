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

import { fireEvent, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IconNames } from "@blueprintjs/icons";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";
import { assertElement } from "@blueprintjs/test-commons/vitest-utils";

import { Classes, type OptionProps } from "../../common";

import { SegmentedControl, type SegmentedControlProps } from "./segmentedControl";

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
    let containerElement: HTMLElement;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        containerElement.remove();
    });

    const renderSegmentedControl = (props?: Partial<SegmentedControlProps>) =>
        render(<SegmentedControl options={OPTIONS} {...props} />, {
            container: containerElement,
        }).container;

    it("supports className", () => {
        const testClassName = "test-class-name";
        const container = renderSegmentedControl({ className: testClassName });
        expect(container.querySelector(`.${Classes.SEGMENTED_CONTROL}`)).toBeInTheDocument();
        expect(container.querySelector(`.${testClassName}`)).toBeInTheDocument();
    });

    it("supports icon", () => {
        const container = renderSegmentedControl({ options: [{ icon: IconNames.GRID, value: "grid" }] });
        expect(container.querySelector(`.${Classes.ICON}`)).toBeInTheDocument();
        expect(container.querySelector(`[data-icon="${IconNames.GRID}"]`)).toBeInTheDocument();
    });

    it("button text defaults to value when no label is passed", () => {
        const container = renderSegmentedControl({ options: [{ value: "val" }] });
        const optionButtons = container.querySelectorAll("button");
        expect(optionButtons[0].textContent).toBe("val");
    });

    it("when no default value passed, first button gets tabIndex=0, none have aria-checked initially", () => {
        const container = renderSegmentedControl();
        expect(container.querySelectorAll("[tabIndex='0']")).toHaveLength(1);
        expect(container.querySelectorAll("[aria-checked='true']")).toHaveLength(0);
        const optionButtons = container.querySelectorAll("button");
        expect(optionButtons[0].getAttribute("tabIndex")).toBe("0");
        expect(optionButtons[0].getAttribute("aria-checked")).toBe("false");
    });

    it("when defaultValue passed, tabIndex=0 and aria-checked applied to correct option, no others", () => {
        const container = renderSegmentedControl({ defaultValue: OPTIONS[2].value });
        expect(container.querySelectorAll("[tabIndex='0']")).toHaveLength(1);
        expect(container.querySelectorAll("[aria-checked='true']")).toHaveLength(1);
        const optionButtons = container.querySelectorAll("button");
        expect(optionButtons[2].getAttribute("tabIndex")).toBe("0");
        expect(optionButtons[2].getAttribute("aria-checked")).toBe("true");
    });

    it("changes option button focus when arrow keys are pressed", () => {
        const container = renderSegmentedControl();
        const radioGroup = assertElement(container, '[role="radiogroup"]');

        const optionButtons = container.querySelectorAll<HTMLElement>('[role="radio"]');
        optionButtons[0].focus();

        fireEvent.keyDown(radioGroup, { key: "ArrowRight" });
        expect(document.activeElement).toBe(optionButtons[2]);
        fireEvent.keyDown(radioGroup, { key: "ArrowRight" });
        expect(document.activeElement).toBe(optionButtons[0]);
        fireEvent.keyDown(radioGroup, { key: "ArrowLeft" });
        expect(document.activeElement).toBe(optionButtons[2]);
        fireEvent.keyDown(radioGroup, { key: "ArrowLeft" });
        expect(document.activeElement).toBe(optionButtons[0]);
    });

    it("should select the correct option when clicked", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { container } = render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} />);
        const listButton = within(container).getByRole("radio", { name: /list/i });

        await user.click(listButton);

        expect(onValueChange).toHaveBeenCalled();
        expect(onValueChange.mock.calls[0][0]).toBe("list");
        expect(listButton.getAttribute("aria-checked")).toBe("true");
    });

    it("should not allow disabled options to be selected", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { container } = render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} />);
        const gridButton = within(container).getByRole("radio", { name: /grid/i });

        await user.click(gridButton);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(gridButton.getAttribute("aria-checked")).toBe("false");
    });

    it("should not allow any options to be selected when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { container } = render(
            <SegmentedControl onValueChange={onValueChange} options={OPTIONS} disabled={true} />,
        );
        const listButton = within(container).getByRole("radio", { name: /list/i });
        const gridButton = within(container).getByRole("radio", { name: /grid/i });

        await user.click(listButton);
        await user.click(gridButton);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(listButton.getAttribute("aria-checked")).toBe("false");
        expect(gridButton.getAttribute("aria-checked")).toBe("false");
    });
});
