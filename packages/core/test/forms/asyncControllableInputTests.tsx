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
import React from "react";
import { spy } from "sinon";

// this component is not part of the public API, but we want to test its implementation in isolation
import { AsyncControllableInput } from "../../src/components/forms/asyncControllableInput";
import { sleep } from "../utils";

describe("<AsyncControllableInput>", () => {
    describe("uncontrolled mode", () => {
        it("renders an input", () => {
            const handleChangeSpy = spy();
            const wrapper = mount(<AsyncControllableInput type="text" defaultValue="hi" onChange={handleChangeSpy} />);
            assert.strictEqual(wrapper.childAt(0).type(), "input");
        });

        it("triggers onChange", () => {
            const handleChangeSpy = spy();
            const wrapper = mount(<AsyncControllableInput type="text" defaultValue="hi" onChange={handleChangeSpy} />);
            const input = wrapper.find("input");
            input.simulate("change", { target: { value: "bye" } });
            const simulatedEvent: React.ChangeEvent<HTMLInputElement> = handleChangeSpy.getCall(0).lastArg;
            assert.strictEqual(simulatedEvent.target.value, "bye");
        });
    });

    describe("controlled mode", () => {
        it("renders an input", () => {
            const wrapper = mount(<AsyncControllableInput type="text" value="hi" />);
            assert.strictEqual(wrapper.childAt(0).type(), "input");
        });

        it("accepts controlled update 'hi' -> 'bye'", () => {
            const wrapper = mount(<AsyncControllableInput type="text" value="hi" />);
            assert.strictEqual(wrapper.find("input").prop("value"), "hi");
            wrapper.setProps({ value: "bye" });
            assert.strictEqual(wrapper.find("input").prop("value"), "bye");
        });

        it("triggers onChange events during composition", () => {
            const handleChangeSpy = spy();
            const wrapper = mount(<AsyncControllableInput type="text" value="hi" onChange={handleChangeSpy} />);
            const input = wrapper.find("input");

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
            const wrapper = mount(<AsyncControllableInput type="text" value="hi" />);
            const input = wrapper.find("input");

            input.simulate("compositionstart", { data: "" });
            input.simulate("compositionupdate", { data: " " });
            input.simulate("change", { target: { value: "hi " } });

            await Promise.resolve();
            wrapper.setProps({ value: "bye" }).update();

            assert.strictEqual(wrapper.find("input").prop("value"), "hi ");
        });

        it("external updates flush after composition ends", async () => {
            const wrapper = mount(<AsyncControllableInput type="text" value="hi" />);
            const input = wrapper.find("input");

            input.simulate("compositionstart", { data: "" });
            input.simulate("compositionupdate", { data: " " });
            input.simulate("change", { target: { value: "hi " } });
            input.simulate("compositionend", { data: " " });

            await Promise.resolve();
            // we are "rejecting" the composition here by supplying a different controlled value
            wrapper.setProps({ value: "bye" }).update();

            assert.strictEqual(wrapper.find("input").prop("value"), "bye");
        });

        // this test only seems to work in React 16, where we don't rely on the react-lifecycles-compat polyfill
        if (React.version.startsWith("16")) {
            it("accepts async controlled update, optimistically rendering new value while waiting for update", async () => {
                class TestComponent extends React.PureComponent<{ initialValue: string }, { value: string }> {
                    public state = { value: this.props.initialValue };

                    public render() {
                        return (
                            <AsyncControllableInput type="text" value={this.state.value} onChange={this.handleChange} />
                        );
                    }

                    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const newValue = e.target.value;
                        window.setTimeout(() => this.setState({ value: newValue }), 10);
                    };
                }

                const wrapper = mount(<TestComponent initialValue="hi" />);
                assert.strictEqual(wrapper.find("input").prop("value"), "hi");

                wrapper.find("input").simulate("change", { target: { value: "hi " } });
                wrapper.update();

                assert.strictEqual(
                    wrapper.find(AsyncControllableInput).prop("value"),
                    "hi",
                    "local state should still have initial value",
                );
                // but rendered input should optimistically show new value
                assert.strictEqual(
                    wrapper.find("input").prop("value"),
                    "hi ",
                    "rendered <input> should optimistically show new value",
                );

                // after async delay, confirm the update
                await sleep(20);
                assert.strictEqual(
                    wrapper.find("input").prop("value"),
                    "hi ",
                    "rendered <input> should still show new value",
                );
                return;
            });
        }
    });
});
