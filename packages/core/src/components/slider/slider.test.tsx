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

import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Slider } from "./slider";
import { simulateMovement } from "./sliderTestUtils";

const STEP_SIZE = 20;

describe("<Slider>", () => {
    it("renders one interactive slider handle", () => {
        render(<Slider />);
        expect(screen.getAllByRole("slider")).toHaveLength(1);
    });

    it.skip("renders primary track segment between initialValue and value", () => {
        const { container } = render(<Slider showTrackFill={true} initialValue={2} value={5} />);
        const tracks = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(1);
        expect(tracks[0].getBoundingClientRect().width).toBe(STEP_SIZE * 3);
    });

    it.skip("renders primary track segment between initialValue and value when value is less than initial value", () => {
        const { container } = render(<Slider showTrackFill={true} initialValue={5} value={2} />);
        const tracks = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(1);
        expect(tracks[0].getBoundingClientRect().width).toBe(STEP_SIZE * 3);
    });

    it("renders no primary track segment when value equals initial value", () => {
        const { container } = render(<Slider showTrackFill={true} initialValue={2} value={2} min={0} max={5} />);
        const tracks = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(0);
    });

    it("renders result of labelRenderer() in each label and differently in handle", () => {
        const labelRenderer = (val: number, opts?: { isHandleTooltip: boolean }) =>
            val + (opts?.isHandleTooltip ? "!" : "#");
        const { container } = render(
            <Slider min={0} max={50} value={10} labelStepSize={10} labelRenderer={labelRenderer} />,
        );
        expect(container.querySelector(`.${Classes.SLIDER}-axis`)).toHaveTextContent("0#10#20#30#40#50#");
        const handleLabel = container.querySelector(`.${Classes.SLIDER_HANDLE} .${Classes.SLIDER_LABEL}`);
        expect(handleLabel).toHaveTextContent("10!");
    });

    it.skip("moving mouse calls onChange with nearest value", () => {
        const changeSpy = vi.fn();
        render(<Slider onChange={changeSpy} />);
        simulateMovement(screen.getByRole("slider"), {
            dragSize: STEP_SIZE,
            dragTimes: 4,
        });
        // called 4 times, for the move to 1, 2, 3, and 4
        expect(changeSpy).toHaveBeenCalledTimes(4);
        expect(changeSpy.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it.skip("releasing mouse calls onRelease with nearest value", () => {
        const releaseSpy = vi.fn();
        render(<Slider onRelease={releaseSpy} />);
        simulateMovement(screen.getByRole("slider"), {
            dragSize: STEP_SIZE,
            dragTimes: 1,
        });
        expect(releaseSpy).toHaveBeenCalledOnce();
        expect(releaseSpy.mock.calls[0][0]).toBe(1);
    });

    it.skip("disabled slider never invokes event handlers", () => {
        const eventSpy = vi.fn();
        const { container } = render(<Slider disabled={true} onChange={eventSpy} onRelease={eventSpy} />);
        // handle drag and keys
        simulateMovement(screen.getByRole("slider"), { dragTimes: 3 });
        fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowUp" });
        // track click
        const track = container.querySelector(`.${Classes.SLIDER_TRACK}`)!;
        fireEvent.mouseDown(track);
        expect(eventSpy).not.toHaveBeenCalled();
    });
});
