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

import { fireEvent, render } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";
import { assertElement } from "@blueprintjs/test-commons/vitest-utils";

import { Classes } from "../../common";

import { Slider } from "./slider";
import { simulateMovement } from "./sliderTestUtils";

const STEP_SIZE = 20;
const TRACK_SELECTOR = `.${Classes.SLIDER_TRACK}`;

describe("<Slider>", () => {
    let containerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        containerElement = document.createElement("div");
        // default min-max is 0-10 so there are 10 steps
        containerElement.style.width = `${STEP_SIZE * 10}px`;
        document.body.appendChild(containerElement);
    });

    afterEach(() => containerElement.remove());

    it("renders one interactive <Handle>", () => {
        const container = renderSlider(<Slider />);
        expect(container.querySelectorAll(`.${Classes.SLIDER_HANDLE}`)).toHaveLength(1);
    });

    it.skip("renders primary track segment between initialValue and value", () => {
        const container = renderSlider(<Slider showTrackFill={true} initialValue={2} value={5} />);
        const tracks = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(1);
        expect(tracks[0].getBoundingClientRect().width).toBe(STEP_SIZE * 3);
    });

    it.skip("renders primary track segment between initialValue and value when value is less than initial value", () => {
        const container = renderSlider(<Slider showTrackFill={true} initialValue={5} value={2} />);
        const tracks = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(1);
        expect(tracks[0].getBoundingClientRect().width).toBe(STEP_SIZE * 3);
    });

    it("renders no primary track segment when value equals initial value", () => {
        const container = renderSlider(
            <Slider showTrackFill={true} initialValue={2} value={2} min={0} max={5} />,
        );
        const tracks = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(0);
    });

    it("renders result of labelRenderer() in each label and differently in handle", () => {
        const labelRenderer = (val: number, opts?: { isHandleTooltip: boolean }) =>
            val + (opts?.isHandleTooltip ? "!" : "#");
        const container = renderSlider(
            <Slider min={0} max={50} value={10} labelStepSize={10} labelRenderer={labelRenderer} />,
        );
        const axis = assertElement(container, `.${Classes.SLIDER}-axis`);
        expect(axis.textContent).toBe("0#10#20#30#40#50#");
        const sliderHandle = assertElement(container, `.${Classes.SLIDER_HANDLE}`);
        const sliderLabel = assertElement(sliderHandle, `.${Classes.SLIDER_LABEL}`);
        expect(sliderLabel.textContent).toBe("10!");
    });

    it.skip("moving mouse calls onChange with nearest value", () => {
        const changeSpy = vi.fn();
        simulateMovement(renderSlider(<Slider onChange={changeSpy} />), {
            dragSize: STEP_SIZE,
            dragTimes: 4,
        });
        // called 4 times, for the move to 1, 2, 3, and 4
        expect(changeSpy).toHaveBeenCalledTimes(4);
        expect(changeSpy.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it.skip("releasing mouse calls onRelease with nearest value", () => {
        const releaseSpy = vi.fn();
        simulateMovement(renderSlider(<Slider onRelease={releaseSpy} />), {
            dragSize: STEP_SIZE,
            dragTimes: 1,
        });
        expect(releaseSpy).toHaveBeenCalledOnce();
        expect(releaseSpy.mock.calls[0][0]).toBe(1);
    });

    it.skip("disabled slider never invokes event handlers", () => {
        const eventSpy = vi.fn();
        const container = renderSlider(<Slider disabled={true} onChange={eventSpy} onRelease={eventSpy} />);
        // handle drag and keys
        simulateMovement(container, { dragTimes: 3 });
        const handle = assertElement(container, `.${Classes.SLIDER_HANDLE}`);
        fireEvent.keyDown(handle, { key: "ArrowUp" });
        // track click
        const track = assertElement(container, TRACK_SELECTOR);
        fireEvent.mouseDown(track);
        expect(eventSpy).not.toHaveBeenCalled();
    });

    function renderSlider(slider: React.JSX.Element) {
        return render(slider, { container: containerElement }).container;
    }
});
