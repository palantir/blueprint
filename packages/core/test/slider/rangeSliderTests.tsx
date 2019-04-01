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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { expectPropValidationError } from "@blueprintjs/test-commons";

import { ARROW_DOWN } from "../../src/common/keys";
import { Handle } from "../../src/components/slider/handle";
import { Classes, RangeSlider } from "../../src/index";

const STEP_SIZE = 20;

describe("<RangeSlider>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        // default min-max is 0-10 so there are 10 steps
        testsContainerElement.style.width = `${STEP_SIZE * 10}px`;
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("renders two interactive <Handle>s", () => {
        const handles = renderSlider(<RangeSlider />).find(Handle);
        assert.lengthOf(handles, 2);
    });

    it("renders primary track segment between two values", () => {
        const track = renderSlider(<RangeSlider value={[2, 5]} />).find(
            `.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`,
        );
        assert.lengthOf(track, 1);
        assert.equal(track.getDOMNode().getBoundingClientRect().width, STEP_SIZE * 3);
    });

    it("throws error if range value contains null", () => {
        expectPropValidationError(RangeSlider, { value: [null, 5] });
        expectPropValidationError(RangeSlider, { value: [100, null] });
    });

    it("disabled slider does not respond to key presses", () => {
        const changeSpy = sinon.spy();
        const handles = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />).find(Handle);
        handles.first().simulate("keydown", { which: ARROW_DOWN });
        handles.last().simulate("keydown", { which: ARROW_DOWN });
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    function renderSlider(slider: JSX.Element) {
        return mount(slider, { attachTo: testsContainerElement });
    }
});
