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

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCallback, useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

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
            element: "input" as const,
            role: "textbox" as const,
            type: "text" as const,
        },
        {
            COMPOSITION_END_DELAY: ASYNC_CONTROLLABLE_VALUE_COMPOSITION_END_DELAY,
            Component: AsyncControllableTextArea,
            element: "textarea" as const,
            role: "textbox" as const,
            type: undefined,
        },
    ];

    tests.forEach(({ Component, element, role, type, COMPOSITION_END_DELAY }) =>
        describe(element, () => {
            describe("uncontrolled mode", () => {
                it(`renders a ${element}`, () => {
                    render(<Component defaultValue="hi" onChange={vi.fn()} type={type} />);
                    expect(screen.getByRole(role).tagName.toLowerCase()).toBe(element);
                });

                it("triggers onChange", async () => {
                    const user = userEvent.setup();
                    const handleChangeSpy = vi.fn();
                    render(<Component defaultValue="hi" onChange={handleChangeSpy} type={type} />);
                    const input = screen.getByRole(role);

                    await user.type(input, " bye");

                    expect(handleChangeSpy).toHaveBeenLastCalledWith(
                        expect.objectContaining({ target: expect.objectContaining({ value: "hi bye" }) }),
                    );
                });
            });

            describe("controlled mode", () => {
                it(`renders a ${element}`, () => {
                    render(<Component value="hi" type={type} />);
                    expect(screen.getByRole(role).tagName.toLowerCase()).toBe(element);
                });

                it("accepts controlled update 'hi' -> 'bye'", () => {
                    const { rerender } = render(<Component value="hi" type={type} />);
                    const input = screen.getByRole(role);
                    expect(input).toHaveValue("hi");
                    rerender(<Component value="bye" type={type} />);
                    expect(input).toHaveValue("bye");
                });

                it("triggers onChange events during composition", () => {
                    const handleChangeSpy = vi.fn();
                    render(<Component value="hi" onChange={handleChangeSpy} type={type} />);
                    const input = screen.getByRole(role);

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
                    const { rerender } = render(<Component value="hi" type={type} />);
                    const input = screen.getByRole(role);

                    fireEvent.compositionStart(input, { data: "" });
                    fireEvent.compositionUpdate(input, { data: " " });
                    fireEvent.change(input, { target: { value: "hi " } });

                    await Promise.resolve();
                    rerender(<Component value="bye" type={type} />);

                    expect(input).toHaveValue("hi ");
                });

                it("external updates DO NOT flush with immediately ongoing compositions", () => {
                    vi.useFakeTimers();
                    const { rerender } = render(<Component value="hi" type={type} />);
                    const input = screen.getByRole(role);

                    fireEvent.compositionStart(input, { data: "" });
                    fireEvent.compositionUpdate(input, { data: " " });
                    fireEvent.change(input, { target: { value: "hi " } });

                    rerender(<Component value="bye" type={type} />);

                    fireEvent.compositionEnd(input, { data: " " });
                    fireEvent.compositionStart(input, { data: "" });

                    // Advance past the composition ending delay
                    vi.advanceTimersByTime(COMPOSITION_END_DELAY);

                    expect(input).toHaveValue("hi ");
                    vi.useRealTimers();
                });

                it("external updates flush after composition ends", () => {
                    vi.useFakeTimers();
                    const { rerender } = render(<Component value="hi" type={type} />);
                    const input = screen.getByRole(role);

                    fireEvent.compositionStart(input, { data: "" });
                    fireEvent.compositionUpdate(input, { data: " " });
                    fireEvent.change(input, { target: { value: "hi " } });
                    fireEvent.compositionEnd(input, { data: " ." });

                    // Advance past the composition ending delay
                    vi.advanceTimersByTime(COMPOSITION_END_DELAY);

                    // we are "rejecting" the composition here by supplying a different controlled value
                    rerender(<Component value="bye" type={type} />);

                    expect(input).toHaveValue("bye");
                    vi.useRealTimers();
                });

                it("accepts async controlled update, optimistically rendering new value while waiting for update", async () => {
                    vi.useFakeTimers();

                    function TestWrapper() {
                        const [value, setValue] = useState("hi");

                        const handleChange = useCallback(
                            async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                const newValue = e.target.value;
                                await new Promise(resolve => setTimeout(resolve, 10));
                                setValue(newValue);
                            },
                            [],
                        );

                        return <Component value={value} onChange={handleChange} type={type} />;
                    }

                    render(<TestWrapper />);
                    const input = screen.getByRole(role);
                    expect(input).toHaveValue("hi");

                    fireEvent.change(input, { target: { value: "hi " } });

                    // rendered input should optimistically show new value
                    expect(input).toHaveValue("hi ");

                    // advance past the async delay and confirm the update
                    await vi.advanceTimersByTimeAsync(10);
                    expect(input).toHaveValue("hi ");
                    vi.useRealTimers();
                });
            });
        }),
    );
});
