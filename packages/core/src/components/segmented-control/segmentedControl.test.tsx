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
import { mount } from "enzyme";

import { IconNames } from "@blueprintjs/icons";
import { afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

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

    const mountSegmentedControl = (props?: Partial<SegmentedControlProps>) =>
        mount(<SegmentedControl options={OPTIONS} {...props} />, {
            attachTo: containerElement,
        });

    it("supports className", () => {
        const testClassName = "test-class-name";
        const wrapper = mountSegmentedControl({ className: testClassName });
        assert.isTrue(wrapper.find(`.${Classes.SEGMENTED_CONTROL}`).hostNodes().exists());
        assert.isTrue(wrapper.find(`.${testClassName}`).hostNodes().exists());
    });

    it("supports icon", () => {
        const wrapper = mountSegmentedControl({ options: [{ icon: IconNames.GRID, value: "grid" }] });
        assert.isTrue(wrapper.find(`.${Classes.ICON}`).hostNodes().exists());
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.GRID}"]`).exists());
    });

    it("button text defaults to value when no label is passed", () => {
        mountSegmentedControl({ options: [{ value: "val" }] });
        const optionButtons = containerElement.querySelectorAll("button")!;
        assert.equal(optionButtons[0].textContent, "val");
    });

    it("when no default value passed, first button gets tabIndex=0, none have aria-checked initially", () => {
        const wrapper = mountSegmentedControl();
        assert.lengthOf(wrapper.find("[tabIndex=0]").hostNodes(), 1);
        assert.lengthOf(wrapper.find("[aria-checked=true]").hostNodes(), 0);
        const optionButtons = containerElement.querySelectorAll("button")!;
        assert.equal(optionButtons[0].getAttribute("tabIndex"), "0");
        assert.equal(optionButtons[0].getAttribute("aria-checked"), "false");
    });

    it("when defaultValue passed, tabIndex=0 and aria-checked applied to correct option, no others", () => {
        const wrapper = mountSegmentedControl({ defaultValue: OPTIONS[2].value });
        assert.lengthOf(wrapper.find("[tabIndex=0]").hostNodes(), 1);
        assert.lengthOf(wrapper.find("[aria-checked=true]").hostNodes(), 1);
        const optionButtons = containerElement.querySelectorAll("button")!;
        assert.equal(optionButtons[2].getAttribute("tabIndex"), "0");
        assert.equal(optionButtons[2].getAttribute("aria-checked"), "true");
    });

    it("changes option button focus when arrow keys are pressed", () => {
        const wrapper = mountSegmentedControl();
        const radioGroup = wrapper.find('[role="radiogroup"]');

        const optionButtons = containerElement.querySelectorAll<HTMLElement>('[role="radio"]');
        optionButtons[0].focus();

        radioGroup.simulate("keydown", { key: "ArrowRight" });
        assert.equal(document.activeElement, optionButtons[2], "move right and skip disabled");
        radioGroup.simulate("keydown", { key: "ArrowRight" });
        assert.equal(document.activeElement, optionButtons[0], "wrap around to first option");
        radioGroup.simulate("keydown", { key: "ArrowLeft" });
        assert.equal(document.activeElement, optionButtons[2], "wrap around to last option");
        radioGroup.simulate("keydown", { key: "ArrowLeft" });
        assert.equal(document.activeElement, optionButtons[0], "move left and skip disabled");
    });

    it("should select the correct option when clicked", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} />);
        const listButton = screen.getByRole("radio", { name: /list/i });

        await user.click(listButton);

        expect(onValueChange).toHaveBeenCalled();
        expect(onValueChange.mock.calls[0][0]).to.equal("list");
        expect(listButton.getAttribute("aria-checked")).to.equal("true");
    });

    it("should not allow disabled options to be selected", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} />);
        const gridButton = screen.getByRole("radio", { name: /grid/i });

        await user.click(gridButton);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(gridButton.getAttribute("aria-checked")).to.equal("false");
    });

    it("should not allow any options to be selected when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<SegmentedControl onValueChange={onValueChange} options={OPTIONS} disabled={true} />);
        const listButton = screen.getByRole("radio", { name: /list/i });
        const gridButton = screen.getByRole("radio", { name: /grid/i });

        await user.click(listButton);
        await user.click(gridButton);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(listButton.getAttribute("aria-checked")).to.equal("false");
        expect(gridButton.getAttribute("aria-checked")).to.equal("false");
    });
});
