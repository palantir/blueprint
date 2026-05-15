/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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
import { PureComponent } from "react";

import { assert, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest"; // this component is not part of the public API, but we want to test its implementation in isolation

import { sleep } from "../../common/test-utils";
import { ASYNC_CONTROLLABLE_VALUE_COMPOSITION_END_DELAY } from "../../hooks/useAsyncControllableValue";

import { AsyncControllableInput } from "./asyncControllableInput";
import { AsyncControllableTextArea } from "./asyncControllableTextArea";

/*
 * NOTE: AsyncControllableInput & AsyncControllableTextArea are very similar, so we test them together.
 * The only difference for now is that the AsyncControllableInput is implemented via class component & getDerivedStateFromProps
 * lifecycle while the AsyncControllableTextArea is implemented via wrapping a `useAsyncControllableValue` hook.
 */

describe("asyncControllable tests", () => {
    const tests = [
        {
            COMPOSITION_END_DELAY: AsyncControllableInput.COMPOSITION_END_DELAY,
            Component: AsyncControllableInput,
            element: "input",
            type: "text",
        },
        {
            COMPOSITION_END_DELAY: ASYNC_CONTROLLABLE_VALUE_COMPOSITION_END_DELAY,
            Component: AsyncControllableTextArea,
            element: "textarea",
            type: undefined,
        },
    ];

    tests.forEach(({ Component, element, type, COMPOSITION_END_DELAY }) =>
        describe(element, () => {
            describe("uncontrolled mode", () => {
                it(`renders a ${element}`, () => {
                    const handleChangeSpy = vi.fn();
                    const { container } = render(
                        <Component defaultValue="hi" onChange={handleChangeSpy} type={type} />,
                    );
                    expect(container.firstElementChild?.tagName.toLowerCase()).toBe(element);
                });

                it("triggers onChange", () => {
                    const handleChangeSpy = vi.fn();
                    const { container } = render(
                        <Component defaultValue="hi" onChange={handleChangeSpy} type={type} />,
                    );
                    const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;
                    fireEvent.change(input, { target: { value: "bye" } });
                    expect(handleChangeSpy).toHaveBeenCalledWith(
                        expect.objectContaining({
                            target: expect.objectContaining({ value: "bye" }),
                        }),
                    );
                });
            });

            describe("controlled mode", () => {
                it(`renders a ${element}`, () => {
                    const { container } = render(<Component value="hi" type={type} />);
                    expect(container.firstElementChild?.tagName.toLowerCase()).toBe(element);
                });

                it("accepts controlled update 'hi' -> 'bye'", () => {
                    const { container, rerender } = render(<Component value="hi" type={type} />);
                    const getInput = () => container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;
                    assert.strictEqual(getInput().value, "hi");
                    rerender(<Component value="bye" type={type} />);
                    assert.strictEqual(getInput().value, "bye");
                });

                it("triggers onChange events during composition", () => {
                    const handleChangeSpy = vi.fn();
                    const { container } = render(<Component value="hi" onChange={handleChangeSpy} type={type} />);
                    const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;

                    fireEvent.compositionStart(input, { data: "" });
                    fireEvent.compositionUpdate(input, { data: " " });
                    // some browsers trigger this change event during composition, so we test to ensure that our wrapper component does too
                    fireEvent.change(input, { target: { value: "hi " } });
                    fireEvent.compositionUpdate(input, { data: " ." });
                    fireEvent.change(input, { target: { value: "hi ." } });
                    fireEvent.compositionEnd(input, { data: " ." });

                    expect(handleChangeSpy).toHaveBeenCalledTimes(2);
                });

                it("external updates DO NOT override in-progress composition", async () => {
                    const { container, rerender } = render(<Component value="hi" type={type} />);
                    const getInput = () => container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;

                    fireEvent.compositionStart(getInput(), { data: "" });
                    fireEvent.compositionUpdate(getInput(), { data: " " });
                    fireEvent.change(getInput(), { target: { value: "hi " } });

                    await Promise.resolve();
                    rerender(<Component value="bye" type={type} />);

                    assert.strictEqual(getInput().value, "hi ");
                });

                it("external updates DO NOT flush with immediately ongoing compositions", async () => {
                    const { container, rerender } = render(<Component value="hi" type={type} />);
                    const getInput = () => container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;

                    fireEvent.compositionStart(getInput(), { data: "" });
                    fireEvent.compositionUpdate(getInput(), { data: " " });
                    fireEvent.change(getInput(), { target: { value: "hi " } });

                    rerender(<Component value="bye" type={type} />);

                    fireEvent.compositionEnd(getInput(), { data: " " });
                    fireEvent.compositionStart(getInput(), { data: "" });

                    // Wait for the composition ending delay to pass
                    await sleep(COMPOSITION_END_DELAY + 5);

                    assert.strictEqual(getInput().value, "hi ");
                });

                it("external updates flush after composition ends", async () => {
                    const { container, rerender } = render(<Component value="hi" type={type} />);
                    const getInput = () => container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;

                    fireEvent.compositionStart(getInput(), { data: "" });
                    fireEvent.compositionUpdate(getInput(), { data: " " });
                    fireEvent.change(getInput(), { target: { value: "hi " } });
                    fireEvent.compositionEnd(getInput(), { data: " " });

                    // Wait for the composition ending delay to pass
                    await sleep(COMPOSITION_END_DELAY + 5);

                    // we are "rejecting" the composition here by supplying a different controlled value
                    rerender(<Component value="bye" type={type} />);

                    assert.strictEqual(getInput().value, "bye");
                });

                it("accepts async controlled update, optimistically rendering new value while waiting for update", async () => {
                    class TestComponent extends PureComponent<{ initialValue: string }, { value: string }> {
                        public state = { value: this.props.initialValue };

                        public render() {
                            return <Component value={this.state.value} onChange={this.handleChange} type={type} />;
                        }

                        private handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                            const newValue = e.target.value;
                            await sleep(10);
                            this.setState({ value: newValue });
                        };
                    }

                    const { container } = render(<TestComponent initialValue="hi" />);
                    const getInput = () => container.querySelector<HTMLInputElement | HTMLTextAreaElement>(element)!;
                    assert.strictEqual(getInput().value, "hi");

                    fireEvent.change(getInput(), { target: { value: "hi " } });

                    // rendered input should optimistically show new value
                    assert.strictEqual(
                        getInput().value,
                        "hi ",
                        `rendered <${element}> should optimistically show new value`,
                    );

                    // after async delay, confirm the update
                    await sleep(20);
                    assert.strictEqual(getInput().value, "hi ", `rendered <${element}> should still show new value`);
                });
            });
        }),
    );
});
