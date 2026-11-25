/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import { describe, expect, it, vi } from "vitest";

import { Classes } from "../../common";

import { MultiSlider, MultiSliderHandle } from "./multiSlider";

describe("<MultiSlider> changing bounds during a drag", () => {
    const cases = [
        { handleIndex: 0, max: 60, min: 0 },
        { handleIndex: 1, max: 100, min: 40 },
        { handleIndex: 0, max: 60, min: 40 },
    ].flatMap(bounds => [false, true].map(touch => ({ ...bounds, touch })));

    it.each(cases)("clamps released values to [$min, $max], touch=$touch", ({ handleIndex, max, min, touch }) => {
        const onRelease = vi.fn();
        const onHandleRelease = vi.fn();
        const renderSlider = (lower: number, upper: number) => (
            <MultiSlider min={lower} max={upper} onRelease={onRelease}>
                <MultiSliderHandle value={20} onRelease={onHandleRelease} />
                <MultiSliderHandle value={80} onRelease={onHandleRelease} />
            </MultiSlider>
        );
        const { container, rerender } = render(renderSlider(0, 100));
        const handle = container.querySelectorAll(`.${Classes.SLIDER_HANDLE}`)[handleIndex];
        if (touch) {
            fireEvent.touchStart(handle, { changedTouches: [{ clientX: 50 }] });
        } else {
            fireEvent.mouseDown(handle, { clientX: 50 });
        }
        rerender(renderSlider(min, max));
        if (touch) {
            fireEvent.touchEnd(document, { changedTouches: [{ clientX: 50 }] });
        } else {
            fireEvent.mouseUp(document, { clientX: 50 });
        }
        expect(onRelease).toHaveBeenCalledOnce();
        const values: number[] = onRelease.mock.calls[0][0];
        expect(values).toHaveLength(2);
        expect(onHandleRelease.mock.calls.map(([value]) => value)).toEqual(values);
        for (const value of values) {
            expect(value).toBeGreaterThanOrEqual(min);
            expect(value).toBeLessThanOrEqual(max);
        }
    });
});
