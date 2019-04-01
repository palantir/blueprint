/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Classes, FileInput } from "../../src/index";

describe("<FileInput>", () => {
    it("supports className, fill, & large", () => {
        const CUSTOM_CLASS = "foo";
        const wrapper = shallow(<FileInput className={CUSTOM_CLASS} fill={true} large={true} />);
        assert.isTrue(wrapper.hasClass(Classes.FILE_INPUT), "Classes.FILE_INPUT");
        assert.isTrue(wrapper.hasClass(CUSTOM_CLASS), CUSTOM_CLASS);
        assert.isTrue(wrapper.hasClass(Classes.FILL), "Classes.FILL");
        assert.isTrue(wrapper.hasClass(Classes.LARGE), "Classes.LARGE");
    });

    it("supports custom input props", () => {
        const wrapper = mount(
            <FileInput
                inputProps={{
                    className: "bar",
                    required: true,
                    type: "text", // overridden by type="file"
                }}
            />,
        );
        const input = getInput(wrapper);

        assert.isTrue(input.hasClass("bar"), "has custom class");
        assert.isTrue(input.prop("required"), "required attribute");
        assert.strictEqual(input.prop("type"), "file", "type attribute");
    });

    it("applies top-level disabled prop to the root and input (overriding inputProps.disabled)", () => {
        const wrapper = mount(<FileInput disabled={true} inputProps={{ disabled: false }} />);

        // should ignore inputProps.disabled in favor of the top-level prop
        assert.isTrue(wrapper.children().hasClass(Classes.DISABLED), "wrapper has disabled class");
        assert.isTrue(getInput(wrapper).prop("disabled"), "input is disabled");

        wrapper.setProps({ disabled: false, inputProps: { disabled: true } });

        // ensure inputProps.disabled is overriden in this case too
        assert.isFalse(wrapper.children().hasClass(Classes.DISABLED), "wrapper no longer has disabled class");
        assert.isFalse(getInput(wrapper).prop("disabled"), "input no longer disabled");
    });

    it("renders default or custom text", () => {
        const wrapper = mount(<FileInput />);
        const span = wrapper.find(`.${Classes.FILE_UPLOAD_INPUT}`);

        // default text
        assert.strictEqual(span.text(), "Choose file...");

        // custom text
        wrapper.setProps({ text: "Input file..." });
        assert.strictEqual(span.text(), "Input file...");
    });

    it("invokes change callbacks", () => {
        const inputProps = { onChange: sinon.spy() };
        const onChange = sinon.spy();
        const onInputChange = sinon.spy();

        const wrapper = shallow(<FileInput {...{ onChange, onInputChange, inputProps }} />);
        const input = getInput(wrapper);
        input.simulate("change");

        assert.isFalse(onChange.called, "onChange not called"); // because it's spread to the label, not the input
        assert.isTrue(onInputChange.calledOnce, "onInputChange called");
        assert.isTrue(inputProps.onChange.calledOnce, "inputProps.onChange called");
    });
});

function getInput(wrapper: ShallowWrapper<any, any> | ReactWrapper<any, any>) {
    return wrapper.find("input");
}
