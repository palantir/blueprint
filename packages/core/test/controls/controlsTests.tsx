/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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

    controlsTests(Switch, "checkbox", Classes.SWITCH);

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
                assert.equal(control.text(), "Label Text");
            });

            it("supports JSX labelElement", () => {
                // uncommenting this line should present a tsc error on label prop:
                // <Checkbox label={<strong>boom</strong>} />;

                const control = mountControl({ labelElement: <strong>boom</strong> });
                assert.lengthOf(control.find("strong"), 1);
                assert.equal(control.text(), "boom");
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
