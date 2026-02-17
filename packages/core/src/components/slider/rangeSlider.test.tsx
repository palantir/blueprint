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

import { expectPropValidationError } from "@blueprintjs/test-commons";
import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { RangeSlider } from "./rangeSlider";

const STEP_SIZE = 20;

describe("<RangeSlider>", () => {
    it("renders two interactive slider handles", () => {
        render(<RangeSlider />);
        expect(screen.getAllByRole("slider")).toHaveLength(2);
    });

    it.skip("renders primary track segment between two values", () => {
        const { container } = render(<RangeSlider value={[2, 5]} />);
        const track = container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}.${Classes.INTENT_PRIMARY}`);
        expect(track).toHaveLength(1);
        expect(track[0].getBoundingClientRect().width).toBe(STEP_SIZE * 3);
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
        render(<RangeSlider disabled={true} onChange={changeSpy} />);
        const handles = screen.getAllByRole("slider");
        fireEvent.keyDown(handles[0], { key: "ArrowDown" });
        fireEvent.keyDown(handles[1], { key: "ArrowDown" });
        expect(changeSpy).not.toHaveBeenCalled();
    });
});
