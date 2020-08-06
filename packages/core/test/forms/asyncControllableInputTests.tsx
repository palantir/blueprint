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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

// this component is not part of the public API, but we want to test its implementation in isolation
import { AsyncControllableInput } from "../../src/components/forms/asyncControllableInput";

describe("<AsyncControllableInput>", () => {
    it("renders an input", () => {
        const wrapper = mount(<AsyncControllableInput type="text" value="hi" />);
        assert.strictEqual(wrapper.childAt(0).type(), "input");
    });

    it("accepts controlled updates", () => {
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

    it("external updates do not override in-progress composition", async () => {
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
        wrapper.setProps({ value: "bye" }).update();

        assert.strictEqual(wrapper.find("input").prop("value"), "bye");
    });
});
