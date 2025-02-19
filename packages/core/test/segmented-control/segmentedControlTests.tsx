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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, type OptionProps, SegmentedControl, type SegmentedControlProps } from "../../src";

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
        containerElement?.remove();
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
});
