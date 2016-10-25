/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Checkbox, Radio, Switch } from "../../src/index";

type ControlType = typeof Checkbox | typeof Radio | typeof Switch;

describe("Controls:", () => {
    controlsTests(Checkbox, "checkbox", "pt-checkbox", () => {
        describe("indeterminate", () => {
            let input: HTMLInputElement;
            const handleInputRef = (ref: HTMLInputElement) => input = ref;

            it("prop sets element state", () => {
                mount(<Checkbox indeterminate inputRef={handleInputRef} />);
                assert.isTrue(input.indeterminate);
            });

            it("default prop sets element state", () => {
                mount(<Checkbox defaultIndeterminate inputRef={handleInputRef} />);
                assert.isTrue(input.indeterminate);
            });
        });
    });

    controlsTests(Switch, "checkbox", "pt-switch");

    controlsTests(Radio, "radio", "pt-radio");

    function controlsTests(classType: ControlType, propType: string, className: string, moreTests?: () => void) {
        describe(`<${classType.displayName.split(".")[1]}>`, () => {
            it(`renders .pt-control.${className}`, () => {
                const control = mount(React.createElement(classType));
                assert.isTrue(control.find(".pt-control").hasClass(className));
            });

            it(`renders input[type=${propType}]`, () => {
                // ensure that `type` prop always comes out as expected, regardless of given value
                const control = mount(React.createElement(classType, { type: "failure" }));
                assert.equal(control.find("input").prop("type"), propType);
            });

            it("supports JSX children", () => {
                const control = mount(React.createElement(classType, {},
                    <span className="pt-icon-standard" />, "Label Text"));
                assert.lengthOf(control.find(".pt-icon-standard"), 1);
                assert.equal(control.text(), "Label Text");
            });

            it("inputRef receives reference to HTMLInputElement", () => {
                const inputRef = sinon.spy();
                mount(React.createElement(classType, { inputRef }));
                assert.isTrue(inputRef.calledOnce);
                assert.instanceOf(inputRef.args[0][0], HTMLInputElement);
            });

            if (moreTests != null) {
                moreTests();
            }
        });
    }
});
