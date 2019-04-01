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

import { ARROW_UP } from "../../src/common/keys";
import { Handle } from "../../src/components/slider/handle";
import { Classes, Slider } from "../../src/index";
import { simulateMovement } from "./sliderTestUtils";

const STEP_SIZE = 20;
const TRACK_SELECTOR = `.${Classes.SLIDER_TRACK}`;

describe("<Slider>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        // default min-max is 0-10 so there are 10 steps
        testsContainerElement.style.width = `${STEP_SIZE * 10}px`;
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("renders one interactive <Handle>", () => {
        const handles = renderSlider(<Slider />).find(Handle);
        assert.lengthOf(handles, 1);
    });

    it("renders primary track segment between initialValue and value", () => {
        const tracks = renderSlider(<Slider showTrackFill={true} initialValue={2} value={5} />).find(
            `.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`,
        );
        assert.lengthOf(tracks, 1);
        assert.equal(tracks.getDOMNode().getBoundingClientRect().width, STEP_SIZE * 3);
    });

    it("renders result of labelRenderer() in each label", () => {
        const labelRenderer = (val: number) => val + "#";
        const wrapper = renderSlider(<Slider min={0} max={50} labelStepSize={10} labelRenderer={labelRenderer} />);
        assert.strictEqual(wrapper.find(`.${Classes.SLIDER}-axis`).text(), "0#10#20#30#40#50#");
    });

    it("moving mouse calls onChange with nearest value", () => {
        const changeSpy = sinon.spy();
        simulateMovement(renderSlider(<Slider onChange={changeSpy} />), { dragTimes: 4, dragSize: STEP_SIZE });
        // called 4 times, for the move to 1, 2, 3, and 4
        assert.equal(changeSpy.callCount, 4, "call count");
        assert.deepEqual(changeSpy.args, [[1], [2], [3], [4]]);
    });

    it("releasing mouse calls onRelease with nearest value", () => {
        const releaseSpy = sinon.spy();
        simulateMovement(renderSlider(<Slider onRelease={releaseSpy} />), { dragTimes: 1, dragSize: STEP_SIZE });
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.equal(releaseSpy.args[0][0], 1);
    });

    it("disabled slider never invokes event handlers", () => {
        const eventSpy = sinon.spy();
        const slider = renderSlider(<Slider disabled={true} onChange={eventSpy} onRelease={eventSpy} />);
        // handle drag and keys
        simulateMovement(slider, { dragTimes: 3 });
        slider.simulate("keydown", { which: ARROW_UP });
        // track click
        slider
            .find(TRACK_SELECTOR)
            .simulate("mousedown", { target: testsContainerElement.querySelector(TRACK_SELECTOR) });
        assert.isTrue(eventSpy.notCalled);
    });

    function renderSlider(slider: JSX.Element) {
        return mount(slider, { attachTo: testsContainerElement });
    }
});
