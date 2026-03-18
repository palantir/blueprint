/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { mount } from "enzyme";

import { expectPropValidationError } from "@blueprintjs/test-commons";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Handle } from "./handle";
import { RangeSlider } from "./rangeSlider";

const STEP_SIZE = 20;

describe("<RangeSlider>", () => {
    let containerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        containerElement = document.createElement("div");
        // default min-max is 0-10 so there are 10 steps
        containerElement.style.width = `${STEP_SIZE * 10}px`;
        document.body.appendChild(containerElement);
    });

    afterEach(() => containerElement.remove());

    it("renders two interactive <Handle>s", () => {
        const handles = renderSlider(<RangeSlider />).find(Handle);
        expect(handles).toHaveLength(2);
    });

    it.skip("renders primary track segment between two values", () => {
        const track = renderSlider(<RangeSlider value={[2, 5]} />).find(
            `.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`,
        );
        expect(track).toHaveLength(1);
        expect(track.getDOMNode().getBoundingClientRect().width).toBe(STEP_SIZE * 3);
    });

    it("throws error if range value contains null", () => {
        expectPropValidationError(RangeSlider, {
            // @ts-expect-error
            value: [null, 5],
        });
        expectPropValidationError(RangeSlider, {
            // @ts-expect-error
            value: [100, null],
        });
    });

    it("disabled slider does not respond to key presses", () => {
        const changeSpy = vi.fn();
        const handles = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />).find(Handle);
        handles.first().simulate("keydown", { key: "ArrowDown" });
        handles.last().simulate("keydown", { key: "ArrowDown" });
        expect(changeSpy).not.toHaveBeenCalled();
    });

    function renderSlider(slider: React.JSX.Element) {
        return mount(slider, { attachTo: containerElement });
    }
});
