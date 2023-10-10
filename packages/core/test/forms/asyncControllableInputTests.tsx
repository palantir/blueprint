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

/* eslint-disable max-classes-per-file */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

// this component is not part of the public API, but we want to test its implementation in isolation
import { AsyncControllableInput } from "../../src/components/forms/asyncControllableInput";
import { AsyncControllableTextArea } from "../../src/components/forms/asyncControllableTextArea";
import { ASYNC_CONTROLLABLE_VALUE_COMPOSITION_END_DELAY } from "../../src/hooks/useAsyncControllableValue";
import { sleep } from "../utils";

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
                    const handleChangeSpy = spy();
                    const wrapper = mount(<Component defaultValue="hi" onChange={handleChangeSpy} type={type} />);
                    assert.strictEqual(wrapper.childAt(0).type(), element);
                });

                it("triggers onChange", () => {
                    const handleChangeSpy = spy();
                    const wrapper = mount(<Component defaultValue="hi" onChange={handleChangeSpy} type={type} />);
                    const input = wrapper.find(element);
                    input.simulate("change", { target: { value: "bye" } });
                    const simulatedEvent: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> =
                        handleChangeSpy.getCall(0).lastArg;
                    assert.strictEqual(simulatedEvent.target.value, "bye");
                });
            });

            describe("controlled mode", () => {
                it(`renders a ${element}`, () => {
                    const wrapper = mount(<Component value="hi" type={type} />);
                    assert.strictEqual(wrapper.childAt(0).type(), element);
                });

                it("accepts controlled update 'hi' -> 'bye'", () => {
                    const wrapper = mount(<Component value="hi" type={type} />);
                    assert.strictEqual(wrapper.find(element).prop("value"), "hi");
                    wrapper.setProps({ value: "bye" });
                    assert.strictEqual(wrapper.find(element).prop("value"), "bye");
                });

                it("triggers onChange events during composition", () => {
                    const handleChangeSpy = spy();
                    const wrapper = mount(<Component value="hi" onChange={handleChangeSpy} type={type} />);
                    const input = wrapper.find(element);

                    input.simulate("compositionstart", { data: "" });
                    input.simulate("compositionupdate", { data: " " });
                    // some browsers trigger this change event during composition, so we test to ensure that our wrapper component does too
                    input.simulate("change", { target: { value: "hi " } });
                    input.simulate("compositionupdate", { data: " ." });
                    input.simulate("change", { target: { value: "hi ." } });
                    input.simulate("compositionend", { data: " ." });

                    assert.strictEqual(handleChangeSpy.callCount, 2);
                });

                it("external updates DO NOT override in-progress composition", async () => {
                    const wrapper = mount(<Component value="hi" type={type} />);
                    const input = wrapper.find(element);

                    input.simulate("compositionstart", { data: "" });
                    input.simulate("compositionupdate", { data: " " });
                    input.simulate("change", { target: { value: "hi " } });

                    await Promise.resolve();
                    wrapper.setProps({ value: "bye" }).update();

                    assert.strictEqual(wrapper.find(element).prop("value"), "hi ");
                });

                it("external updates DO NOT flush with immediately ongoing compositions", async () => {
                    const wrapper = mount(<Component value="hi" type={type} />);
                    const input = wrapper.find(element);

                    input.simulate("compositionstart", { data: "" });
                    input.simulate("compositionupdate", { data: " " });
                    input.simulate("change", { target: { value: "hi " } });

                    wrapper.setProps({ value: "bye" }).update();

                    input.simulate("compositionend", { data: " " });
                    input.simulate("compositionstart", { data: "" });

                    // Wait for the composition ending delay to pass
                    await new Promise(resolve => setTimeout(() => resolve(null), COMPOSITION_END_DELAY + 5));

                    assert.strictEqual(wrapper.find(element).prop("value"), "hi ");
                });

                it("external updates flush after composition ends", async () => {
                    const wrapper = mount(<Component value="hi" type={type} />);
                    const input = wrapper.find(element);

                    input.simulate("compositionstart", { data: "" });
                    input.simulate("compositionupdate", { data: " " });
                    input.simulate("change", { target: { value: "hi " } });
                    input.simulate("compositionend", { data: " " });

                    // Wait for the composition ending delay to pass
                    await new Promise(resolve => setTimeout(() => resolve(null), COMPOSITION_END_DELAY + 5));

                    // we are "rejecting" the composition here by supplying a different controlled value
                    wrapper.setProps({ value: "bye" }).update();

                    assert.strictEqual(wrapper.find(element).prop("value"), "bye");
                });

                it("accepts async controlled update, optimistically rendering new value while waiting for update", async () => {
                    class TestComponent extends React.PureComponent<{ initialValue: string }, { value: string }> {
                        public state = { value: this.props.initialValue };

                        public render() {
                            return <Component value={this.state.value} onChange={this.handleChange} type={type} />;
                        }

                        private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                            const newValue = e.target.value;
                            window.setTimeout(() => this.setState({ value: newValue }), 10);
                        };
                    }

                    const wrapper = mount(<TestComponent initialValue="hi" />);
                    assert.strictEqual(wrapper.find(element).prop("value"), "hi");

                    wrapper.find(element).simulate("change", { target: { value: "hi " } });
                    wrapper.update();

                    assert.strictEqual(
                        wrapper.find(Component).prop("value"),
                        "hi",
                        "local state should still have initial value",
                    );
                    // but rendered input should optimistically show new value
                    assert.strictEqual(
                        wrapper.find(element).prop("value"),
                        "hi ",
                        `rendered <${element}> should optimistically show new value`,
                    );

                    // after async delay, confirm the update
                    await sleep(20);
                    assert.strictEqual(
                        wrapper.find(element).prop("value"),
                        "hi ",
                        `rendered <${element}> should still show new value`,
                    );
                    return;
                });
            });
        }),
    );
});
