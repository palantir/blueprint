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

import { mount, type ReactWrapper, shallow, type ShallowWrapper } from "enzyme";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { FileInput } from "./fileInput";

describe("<FileInput>", () => {
    it(`supports className, fill, & size="large"`, () => {
        const CUSTOM_CLASS = "foo";
        const wrapper = shallow(<FileInput className={CUSTOM_CLASS} fill={true} size="large" />);
        expect(wrapper.hasClass(Classes.FILE_INPUT), "Classes.FILE_INPUT").toBe(true);
        expect(wrapper.hasClass(CUSTOM_CLASS), CUSTOM_CLASS).toBe(true);
        expect(wrapper.hasClass(Classes.FILL), "Classes.FILL").toBe(true);
        expect(wrapper.hasClass(Classes.LARGE), "Classes.LARGE").toBe(true);
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

        expect(input.hasClass("bar"), "has custom class").toBe(true);
        expect(input.prop("required"), "required attribute").toBe(true);
        expect(input.prop("type"), "type attribute").toBe("file");
    });

    it("applies top-level disabled prop to the root and input (overriding inputProps.disabled)", () => {
        const wrapper = mount(<FileInput disabled={true} inputProps={{ disabled: false }} />);

        // should ignore inputProps.disabled in favor of the top-level prop
        expect(wrapper.children().hasClass(Classes.DISABLED), "wrapper has disabled class").toBe(true);
        expect(getInput(wrapper).prop("disabled"), "input is disabled").toBe(true);

        wrapper.setProps({ disabled: false, inputProps: { disabled: true } });

        // ensure inputProps.disabled is overriden in this case too
        expect(wrapper.children().hasClass(Classes.DISABLED), "wrapper no longer has disabled class").toBe(false);
        expect(getInput(wrapper).prop("disabled"), "input no longer disabled").toBe(false);
    });

    it("renders default or custom text", () => {
        const wrapper = mount(<FileInput />);
        const span = wrapper.find(`.${Classes.FILE_UPLOAD_INPUT}`);

        // default text
        expect(span.text()).toBe("Choose file...");

        // custom text
        wrapper.setProps({ text: "Input file..." });
        expect(span.text()).toBe("Input file...");
    });

    it("invokes change callbacks", () => {
        const inputProps = { onChange: vi.fn() };
        const onChange = vi.fn();
        const onInputChange = vi.fn();

        const wrapper = shallow(
            <FileInput inputProps={inputProps} onChange={onChange} onInputChange={onInputChange} />,
        );
        const input = getInput(wrapper);
        input.simulate("change");

        expect(onChange).not.toHaveBeenCalled(); // because it's spread to the label, not the input
        expect(onInputChange).toHaveBeenCalledOnce();
        expect(inputProps.onChange).toHaveBeenCalledOnce();
    });
});

function getInput(wrapper: ShallowWrapper<any, any> | ReactWrapper<any, any>) {
    return wrapper.find("input");
}
