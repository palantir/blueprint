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

import { fireEvent, render, type RenderResult } from "@testing-library/react";

import { expectPropValidationError } from "@blueprintjs/test-commons";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { RangeSlider } from "./rangeSlider";

const STEP_SIZE = 20;

describe("<RangeSlider>", () => {
    let containerElement: HTMLElement;

    beforeEach(() => {
        containerElement = document.createElement("div");
        containerElement.style.width = `${STEP_SIZE * 10}px`;
        document.body.appendChild(containerElement);
    });

    afterEach(() => containerElement.remove());

    it("renders two interactive <Handle>s", () => {
        const { container } = renderSlider(<RangeSlider />);
        expect(container.querySelectorAll(`.${Classes.SLIDER_HANDLE}`)).toHaveLength(2);
    });

    it.skip("renders primary track segment between two values", () => {
        const { container } = renderSlider(<RangeSlider value={[2, 5]} />);
        const tracks = container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(tracks).toHaveLength(1);
        expect(tracks[0].getBoundingClientRect().width).toBe(STEP_SIZE * 3);
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
        const { container } = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />);
        const handles = container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_HANDLE}`);
        fireEvent.keyDown(handles[0], { key: "ArrowDown" });
        fireEvent.keyDown(handles[handles.length - 1], { key: "ArrowDown" });
        expect(changeSpy).not.toHaveBeenCalled();
    });

    function renderSlider(slider: React.JSX.Element): RenderResult {
        return render(slider, { container: containerElement });
    }
});
