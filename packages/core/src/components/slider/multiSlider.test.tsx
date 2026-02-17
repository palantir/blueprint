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

import { render, screen } from "@testing-library/react";

import { expectPropValidationError } from "@blueprintjs/test-commons";
import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { MultiSlider, MultiSliderHandle, type MultiSliderProps } from "./multiSlider";
import { mouseUpHorizontal, simulateMovement } from "./sliderTestUtils";

const STEP_SIZE = 20;

describe("<MultiSlider>", () => {
    describe("handles", () => {
        it.skip("handle values are automatically sorted", () => {
            const onRelease = vi.fn();
            renderSlider({ onRelease, values: [5, 10, 0] });
            const handles = screen.getAllByRole("slider");
            simulateMovement(handles[0], { dragTimes: 0 });
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
            );
            expect(container.querySelectorAll("span.testClass")).toHaveLength(1);
        });

        it.skip("moving mouse on the first handle updates the first value", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            const handles = screen.getAllByRole("slider");
            simulateMovement(handles[0], { dragSize: STEP_SIZE, dragTimes: 4 });
            // called 3 times for the move to 1, 2, 3, and 4
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onChange.mock.calls.map(arg => arg[0])).toEqual([
                [1, 5, 10],
                [2, 5, 10],
                [3, 5, 10],
                [4, 5, 10],
            ]);
        });

        it.skip("moving mouse on the middle handle updates the middle value", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            const handles = screen.getAllByRole("slider");
            simulateMovement(handles[1], {
                dragSize: STEP_SIZE,
                dragTimes: 4,
                from: STEP_SIZE * 5,
            });
            // called 3 times for the move to 6, 7, 8, and 9
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onChange.mock.calls.map(arg => arg[0])).toEqual([
                [0, 6, 10],
                [0, 7, 10],
                [0, 8, 10],
                [0, 9, 10],
            ]);
        });

        it.skip("moving mouse on the last handle updates the last value", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            const handles = screen.getAllByRole("slider");
            simulateMovement(handles[2], {
                dragSize: -STEP_SIZE,
                dragTimes: 4,
                from: STEP_SIZE * 10,
            });
            // called 3 times for the move to 9, 8, 7, and 6
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onChange.mock.calls.map(arg => arg[0])).toEqual([
                [0, 5, 9],
                [0, 5, 8],
                [0, 5, 7],
                [0, 5, 6],
            ]);
        });

        it.skip("releasing mouse on a track value closer to the first handle moves the first handle", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            // TODO: convert when track click simulation is available
        });

        it.skip("releasing mouse on a track value slightly below the middle handle moves the middle handle", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            // TODO: convert when track click simulation is available
        });

        it.skip("releasing mouse on a track value slightly above the middle handle moves the middle handle", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            // TODO: convert when track click simulation is available
        });

        it.skip("releasing mouse on a track value closer to the last handle moves the last handle", () => {
            const onChange = vi.fn();
            renderSlider({ onChange });
            // TODO: convert when track click simulation is available
        });

        it.skip("when values are equal, releasing mouse on a track still moves the nearest handle", () => {
            const onChange = vi.fn();
            renderSlider({ onChange, values: [5, 5, 7] });
            // TODO: convert when track click simulation is available
        });

        it("values outside of bounds are clamped", () => {
            const { container } = renderSlider({ values: [-1, 5, 12] });
            const progressSegments = container.querySelectorAll<HTMLElement>(`.${Classes.SLIDER_PROGRESS}`);
            progressSegments.forEach(segment => {
                const { left, right } = segment.style;
                // CSS properties are percentage strings, but parsing will ignore trailing "%".
                // percentages should be in 0-100% range.
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
            expect(container.querySelector(`.${Classes.SLIDER}-axis`)).toHaveTextContent("0#10#20#30#40#50#");
        });

        it("renders result of labelRenderer() in each label with labelValues", () => {
            const labelRenderer = (val: number) => val + "#";
            const { container } = renderSlider({ labelRenderer, labelValues: [20, 40, 50], max: 50, min: 0 });
            expect(container.querySelector(`.${Classes.SLIDER}-axis`)).toHaveTextContent("20#40#50#");
        });

        it("default labelRenderer() fixes decimal places to labelPrecision", () => {
            const { container } = renderSlider({ labelPrecision: 1, values: [0.99 / 10, 1, 1] });
            const handleLabels = container.querySelectorAll(`.${Classes.SLIDER_HANDLE} .${Classes.SLIDER_LABEL}`);
            expect(handleLabels[0]).toHaveTextContent("0.1");
        });

        it("infers precision of default labelRenderer from stepSize", () => {
            const { container } = renderSlider({ stepSize: 0.01 });
            // With stepSize 0.01, labels should have 2 decimal places
            const handleLabels = container.querySelectorAll(`.${Classes.SLIDER_HANDLE} .${Classes.SLIDER_LABEL}`);
            expect(handleLabels[0]).toHaveTextContent("0.00");
        });

        it("labelRenderer={false} removes all labels", () => {
            const { container } = renderSlider({ labelRenderer: false });
            expectLabelCount(container, 0);
        });
    });

    describe("track", () => {
        it("progress bars are rendered between all handles", () => {
            const { container } = renderTrackSlider();
            // N values = N+1 track segments
            expect(container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}`)).toHaveLength(4);
        });

        it("intentAfter beats intentBefore", () => {
            const { container } = renderTrackSlider();
            const intents = Array.from(container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}`)).map(segment => {
                const match = segment.className.match(/-intent-(\w+)/) || [];
                return match[1];
            });
            // last segment has default intent
            expect(intents).toEqual(["primary", "danger", "danger", "warning"]);
        });

        it("showTrackFill=false ignores track intents", () => {
            const { rerender, container } = renderTrackSlider();
            rerender(
                <MultiSlider defaultTrackIntent="warning" showTrackFill={false}>
                    <MultiSliderHandle value={3} intentBefore="primary" intentAfter="danger" />
                    <MultiSliderHandle value={5} intentBefore="primary" intentAfter="danger" />
                    <MultiSliderHandle value={7} intentBefore="primary" />
                </MultiSlider>,
            );
            container.querySelectorAll(`.${Classes.SLIDER_PROGRESS}`).forEach(segment => {
                // segments rendered but they have no intent
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
                segment => [segment.style.left, segment.style.right],
            );
            expect(locations).toEqual([
                ["0%", "100%"],
                ["0%", "80%"],
                ["20%", "0%"],
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
});

function renderSlider(joinedProps: MultiSliderProps & { values?: [number, number, number] } = {}) {
    const { values = [0, 5, 10], ...props } = joinedProps;
    return render(
        <MultiSlider {...props}>
            <MultiSliderHandle value={values[0]} />
            <MultiSliderHandle value={values[1]} />
            <MultiSliderHandle value={values[2]} />
        </MultiSlider>,
    );
}

function renderTrackSlider() {
    return render(
        <MultiSlider defaultTrackIntent="warning">
            <MultiSliderHandle value={3} intentBefore="primary" intentAfter="danger" />
            <MultiSliderHandle value={5} intentBefore="primary" intentAfter="danger" />
            <MultiSliderHandle value={7} intentBefore="primary" />
        </MultiSlider>,
    );
}

function expectLabelCount(container: HTMLElement, expected: number) {
    expect(container.querySelectorAll(`.${Classes.SLIDER}-axis .${Classes.SLIDER_LABEL}`)).toHaveLength(expected);
}
