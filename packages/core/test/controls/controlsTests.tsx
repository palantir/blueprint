/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "../../src";
import { Checkbox, IControlProps, Radio, Switch } from "../../src/components/forms/controls";

type ControlType = typeof Checkbox | typeof Radio | typeof Switch;

describe("Controls:", () => {
    controlsTests(Checkbox, "checkbox", Classes.CHECKBOX, () => {
        describe("indeterminate", () => {
            let input: HTMLInputElement;
            const handleInputRef = (ref: HTMLInputElement) => (input = ref);

            it("prop sets element state", () => {
                mount(<Checkbox indeterminate={true} inputRef={handleInputRef} />);
                assert.isTrue(input.indeterminate);
            });

            it("default prop sets element state", () => {
                mount(<Checkbox defaultIndeterminate={true} inputRef={handleInputRef} />);
                assert.isTrue(input.indeterminate);
            });
        });
    });

    controlsTests(Switch, "checkbox", Classes.SWITCH, () => {
        describe("internal text", () => {
            it("renders both innerLabels when both defined", () => {
                const switchWithText = mount(<Switch innerLabelChecked="checked" innerLabel="unchecked" />);
                const innerTextNodes = switchWithText.find(`.${Classes.SWITCH_INNER_TEXT}`);
                const checkedTest = innerTextNodes.first().text();
                const uncheckedText = innerTextNodes.last().text();
                assert.lengthOf(innerTextNodes, 2);
                assert.equal(checkedTest.trim(), "checked");
                assert.equal(uncheckedText.trim(), "unchecked");
            });
            it("does not render innerLabel components when neither defined", () => {
                const switchWithoutText = mount(<Switch />);
                const innerTextNodes = switchWithoutText.find(`.${Classes.SWITCH_INNER_TEXT}`);
                assert.lengthOf(innerTextNodes, 0);
            });
            it("renders innerLabel when innerLabelChecked is undefined", () => {
                const switchWithText = mount(<Switch innerLabel="onlyInnerLabel" />);
                const innerTextNodes = switchWithText.find(`.${Classes.SWITCH_INNER_TEXT}`);
                const checkedText = innerTextNodes.last().text();
                const uncheckedText = innerTextNodes.first().text();
                assert.equal(checkedText.trim(), "onlyInnerLabel");
                assert.equal(checkedText.trim(), uncheckedText.trim());
            });
            it("renders innerLabelChecked only when checked", () => {
                const switchWithText = mount(<Switch innerLabelChecked="onlyChecked" />);
                const innerTextNodes = switchWithText.find(`.${Classes.SWITCH_INNER_TEXT}`);
                const checked = innerTextNodes.first().text();
                const uncheckedText = innerTextNodes.last().text();
                assert.equal(checked.trim(), "onlyChecked");
                assert.equal(uncheckedText.trim(), "");
            });
        });
    });

    controlsTests(Radio, "radio", Classes.RADIO);

    function controlsTests(classType: ControlType, propType: string, className: string, moreTests?: () => void) {
        describe(`<${classType.displayName.split(".")[1]}>`, () => {
            it(`renders .${Classes.CONTROL}.${className}`, () => {
                const control = mountControl();
                assert.isTrue(control.find(`.${Classes.CONTROL}`).hasClass(className));
            });

            it(`renders input[type=${propType}]`, () => {
                // ensure that `type` prop always comes out as expected, regardless of given value
                const control = mountControl({ type: "failure" });
                assert.equal(control.find("input").prop("type"), propType);
            });

            it("supports JSX children", () => {
                const control = mountControl({}, <span className="jsx-child" key="jsx" />, "Label Text");
                assert.lengthOf(control.find(".jsx-child"), 1);
                assert.equal(control.text().trim(), "Label Text");
            });

            it("supports JSX labelElement", () => {
                // uncommenting this line should present a tsc error on label prop:
                // <Checkbox label={<strong>boom</strong>} />;

                const control = mountControl({ labelElement: <strong>boom</strong> });
                assert.lengthOf(control.find("strong"), 1);
                assert.equal(control.text().trim(), "boom");
            });

            if (moreTests != null) {
                moreTests();
            }
        });

        function mountControl(props?: IControlProps, ...children: React.ReactNode[]) {
            return mount(React.createElement(classType, props, children));
        }
    }
});
