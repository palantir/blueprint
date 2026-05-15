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

import { fireEvent, render, type RenderResult } from "@testing-library/react";

import { expectPropValidationError } from "@blueprintjs/test-commons";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { MultiSlider, MultiSliderHandle, type MultiSliderProps } from "./multiSlider";
import { mouseUpHorizontal, simulateMovement } from "./sliderTestUtils";

const STEP_SIZE = 20;

describe("<MultiSlider>", () => {
    let containerElement: HTMLElement;

    const onChange = vi.fn();
    const onRelease = vi.fn();

    beforeEach(() => {
        containerElement = document.createElement("div");
        containerElement.style.width = `${STEP_SIZE * 10}px`;
        document.body.appendChild(containerElement);

        onChange.mockReset();
        onRelease.mockReset();
    });

    afterEach(() => {
        containerElement.remove();
    });

    describe("handles", () => {
        it.skip("handle values are automatically sorted", () => {
            const { container } = renderSlider({ onRelease, values: [5, 10, 0] });
            const firstHandle = container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_HANDLE}`)[0];
            fireEvent.mouseDown(firstHandle, { clientX: 0 });
            mouseUpHorizontal(0);
            expect(onRelease).toHaveBeenCalledOnce();
            expect(onRelease.mock.calls[0][0]).toEqual([0, 5, 10]);
        });

        it("propagates className to the handles", () => {
            const { container } = render(
                <MultiSlider>
                    <MultiSliderHandle value={3} className="testClass" />
                    <MultiSliderHandle value={5} />
                </MultiSlider>,
                { container: containerElement },
            );
            expect(container.querySelectorAll("span.testClass")).toHaveLength(1);
        });

        it.skip("moving mouse on the first handle updates the first value", () => {
            const { container } = renderSlider({ onChange });
            simulateMovement(container.firstElementChild as HTMLElement, {
                dragSize: STEP_SIZE,
                dragTimes: 4,
                handleIndex: 0,
            });
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onChange.mock.calls.map(arg => arg[0])).toEqual([
                [1, 5, 10],
                [2, 5, 10],
                [3, 5, 10],
                [4, 5, 10],
            ]);
        });

        it.skip("moving mouse on the middle handle updates the middle value", () => {
            const { container } = renderSlider({ onChange });
            simulateMovement(container.firstElementChild as HTMLElement, {
                dragSize: STEP_SIZE,
                dragTimes: 4,
                from: STEP_SIZE * 5,
                handleIndex: 1,
            });
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onChange.mock.calls.map(arg => arg[0])).toEqual([
                [0, 6, 10],
                [0, 7, 10],
                [0, 8, 10],
                [0, 9, 10],
            ]);
        });

        it.skip("moving mouse on the last handle updates the last value", () => {
            const { container } = renderSlider({ onChange });
            simulateMovement(container.firstElementChild as HTMLElement, {
                dragSize: -STEP_SIZE,
                dragTimes: 4,
                from: STEP_SIZE * 10,
                handleIndex: 2,
            });
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onChange.mock.calls.map(arg => arg[0])).toEqual([
                [0, 5, 9],
                [0, 5, 8],
                [0, 5, 7],
                [0, 5, 6],
            ]);
        });

        it.skip("releasing mouse on a track value closer to the first handle moves the first handle", () => {
            const { container } = renderSlider({ onChange });
            fireEvent.mouseDown(container.firstElementChild as HTMLElement, { clientX: STEP_SIZE });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([1, 5, 10]);
        });

        it.skip("releasing mouse on a track value slightly below the middle handle moves the middle handle", () => {
            const { container } = renderSlider({ onChange });
            fireEvent.mouseDown(container.firstElementChild as HTMLElement, { clientX: STEP_SIZE * 4 });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([0, 4, 10]);
        });

        it.skip("releasing mouse on a track value slightly above the middle handle moves the middle handle", () => {
            const { container } = renderSlider({ onChange });
            fireEvent.mouseDown(container.firstElementChild as HTMLElement, { clientX: STEP_SIZE * 6 });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([0, 6, 10]);
        });

        it.skip("releasing mouse on a track value closer to the last handle moves the last handle", () => {
            const { container } = renderSlider({ onChange });
            fireEvent.mouseDown(container.firstElementChild as HTMLElement, { clientX: STEP_SIZE * 9 });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([0, 5, 9]);
        });

        it.skip("when values are equal, releasing mouse on a track still moves the nearest handle", () => {
            const { container } = renderSlider({ onChange, values: [5, 5, 7] });
            const slider = container.firstElementChild as HTMLElement;

            fireEvent.mouseDown(slider, { clientX: STEP_SIZE * 1 });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([1, 5, 7]);
            onChange.mockClear();

            fireEvent.mouseDown(slider, { clientX: STEP_SIZE * 9 });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([5, 5, 9]);
        });

        it("values outside of bounds are clamped", () => {
            const { container } = renderSlider({ values: [-1, 5, 12] });
            container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}`).forEach(progress => {
                const { left, right } = progress.style;
                expect(parseFloat(left)).toBeGreaterThanOrEqual(0);
                expect(parseFloat(right)).toBeLessThanOrEqual(100);
            });
        });
    });

    describe("labels", () => {
        it("renders label with labelStepSize fallback of 1 when not provided", () => {
            // [0 1 2 3 4 5]
            const { container } = renderSlider({ max: 5, min: 0 });
            expectLabelCount(container, 6);
        });

        it("renders label for value and for each labelStepSize", () => {
            // [0  10  20  30  40  50]
            const { container } = renderSlider({ labelStepSize: 10, max: 50, min: 0 });
            expectLabelCount(container, 6);
        });

        it("renders labels provided in labelValues prop", () => {
            const labelValues = [0, 30, 50, 60];
            const { container } = renderSlider({ labelValues, max: 50, min: 0 });
            expectLabelCount(container, 4);
        });

        it("renders all labels even when floating point approx would cause the last one to be skipped", () => {
            // [0  0.14  0.28  0.42  0.56  0.70]
            const { container } = renderSlider({ labelStepSize: 0.14, max: 0.7, min: 0 });
            expectLabelCount(container, 6);
        });

        it("renders result of labelRenderer() in each label", () => {
            const labelRenderer = (val: number) => val + "#";
            const { container } = renderSlider({ labelRenderer, labelStepSize: 10, max: 50, min: 0 });
            expect(container.querySelector(`.${Classes.SLIDER}-axis`)?.textContent).toBe("0#10#20#30#40#50#");
        });

        it("renders result of labelRenderer() in each label with labelValues", () => {
            const labelRenderer = (val: number) => val + "#";
            const { container } = renderSlider({ labelRenderer, labelValues: [20, 40, 50], max: 50, min: 0 });
            expect(container.querySelector(`.${Classes.SLIDER}-axis`)?.textContent).toBe("20#40#50#");
        });

        it("default labelRenderer() fixes decimal places to labelPrecision", () => {
            const { container } = renderSlider({ labelPrecision: 1, values: [0.99 / 10, 1, 1] });
            const firstHandle = container.querySelector(`.${Classes.SLIDER_HANDLE}`);
            expect(firstHandle?.textContent).toBe("0.1");
        });

        it("infers precision of default labelRenderer from stepSize", () => {
            // stepSize 0.01 implies precision 2; verify via rendered label content.
            const { container } = renderSlider({ stepSize: 0.01 });
            const firstHandle = container.querySelector(`.${Classes.SLIDER_HANDLE}`);
            expect(firstHandle?.textContent).toBe("0.00");
        });

        it("labelRenderer={false} removes all labels", () => {
            const { container } = renderSlider({ labelRenderer: false });
            expectLabelCount(container, 0);
        });

        function expectLabelCount(container: HTMLElement, expected: number) {
            expect(container.querySelectorAll(`.${Classes.SLIDER}-axis .${Classes.SLIDER_LABEL}`)).toHaveLength(
                expected,
            );
        }
    });

    describe("track", () => {
        let result: RenderResult;
        beforeEach(() => {
            result = render(
                <MultiSlider defaultTrackIntent="warning">
                    <MultiSliderHandle value={3} intentBefore="primary" intentAfter="danger" />
                    <MultiSliderHandle value={5} intentBefore="primary" intentAfter="danger" />
                    <MultiSliderHandle value={7} intentBefore="primary" />
                </MultiSlider>,
                { container: containerElement },
            );
        });

        it("progress bars are rendered between all handles", () => {
            // N values = N+1 track segments
            expect(result.container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}`)).toHaveLength(4);
        });

        it("intentAfter beats intentBefore", () => {
            const intents = Array.from(
                result.container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}`),
            ).map(segment => segment.className.match(/-intent-(\w+)/)?.[1]);
            expect(intents).toEqual(["primary", "danger", "danger", "warning"]);
        });

        it("showTrackFill=false ignores track intents", () => {
            result.rerender(
                <MultiSlider defaultTrackIntent="warning" showTrackFill={false}>
                    <MultiSliderHandle value={3} intentBefore="primary" intentAfter="danger" />
                    <MultiSliderHandle value={5} intentBefore="primary" intentAfter="danger" />
                    <MultiSliderHandle value={7} intentBefore="primary" />
                </MultiSlider>,
            );
            result.container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}`).forEach(segment => {
                expect(segment.className.match(/-intent-(\w+)/)).toBeNull();
            });
        });

        it("track section positioning is correct", () => {
            const { container } = render(
                <MultiSlider max={1}>
                    <MultiSliderHandle value={1.2e-7} intentBefore="warning" intentAfter="warning" />
                    <MultiSliderHandle value={0.2} intentBefore="danger" intentAfter="success" />
                </MultiSlider>,
            );
            const locations = Array.from(container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}`)).map(
                segment => [parseFloat(segment.style.left), parseFloat(segment.style.right)],
            );
            expect(locations).toEqual([
                [0, 100],
                [0, 80],
                [20, 0],
            ]);
        });

        it("trackStyleBefore and trackStyleAfter work as intended", () => {
            const { container } = render(
                <MultiSlider>
                    <MultiSliderHandle
                        value={1}
                        trackStyleBefore={{ background: "red" }}
                        trackStyleAfter={{ background: "yellow" }}
                    />
                    <MultiSliderHandle
                        value={2}
                        trackStyleBefore={{ background: "blue" }}
                        trackStyleAfter={{ background: "purple" }}
                    />
                </MultiSlider>,
            );

            const trackBackgrounds = Array.from(
                container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}`),
            ).map(segment => segment.style.background);

            expect(trackBackgrounds[0]).toBe("red");
            expect(trackBackgrounds[1]).toBe("yellow");
            expect(trackBackgrounds[2]).toBe("purple");
        });
    });

    describe("validation", () => {
        it("throws an error if a child is not a slider handle", () => {
            expectPropValidationError(MultiSlider, { children: (<span>Bad</span>) as any });
        });

        it("throws error if stepSize <= 0", () => {
            [0, -10].forEach(stepSize => {
                expectPropValidationError(MultiSlider, { stepSize }, "greater than zero");
            });
        });

        it("throws error if labelStepSize <= 0", () => {
            [0, -10].forEach(labelStepSize => {
                expectPropValidationError(MultiSlider, { labelStepSize }, "greater than zero");
            });
        });

        it("throws an error if the min value is not finite", () => {
            expectPropValidationError(
                MultiSlider,
                { min: Number.NEGATIVE_INFINITY },
                "min prop must be a finite number",
            );
        });

        it("throws an error if the max value is not finite", () => {
            expectPropValidationError(
                MultiSlider,
                { max: Number.POSITIVE_INFINITY },
                "max prop must be a finite number",
            );
        });
    });

    function renderSlider(joinedProps: MultiSliderProps & { values?: [number, number, number] } = {}): RenderResult {
        const { values = [0, 5, 10], ...props } = joinedProps;
        return render(
            <MultiSlider {...props}>
                <MultiSliderHandle value={values[0]} />
                <MultiSliderHandle value={values[1]} />
                <MultiSliderHandle value={values[2]} />
            </MultiSlider>,
            { container: containerElement },
        );
    }
});
