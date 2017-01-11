/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import * as Keys from "../../src/common/keys";
import { AnchorButton, Button, Classes, IButtonProps, Spinner } from "../../src/index";

describe("Buttons:", () => {
    buttonTestSuite(Button, "button");
    buttonTestSuite(AnchorButton, "a", () => {
        it("calls onClick when enter key pressed", () => {
            const onClick = sinon.spy();
            button(AnchorButton, { onClick }).simulate("keydown", { which: Keys.ENTER });
            assert.equal(onClick.callCount, 1);
        });

        it("calls onClick when space key released", () => {
            const onClick = sinon.spy();
            button(AnchorButton, { onClick }).simulate("keyup", { which: Keys.SPACE });
            assert.equal(onClick.callCount, 1);
        });
    });
});

function buttonTestSuite(component: React.ComponentClass<any>, tagName: string, moreTests?: () => void) {
    describe(`<${component.displayName.split(".")[1]}>`, () => {
        it("renders its contents", () => {
            const wrapper = button(component, { className: "foo" });
            assert.isTrue(wrapper.is(tagName));
            assert.isTrue(wrapper.hasClass(Classes.BUTTON));
            assert.isTrue(wrapper.hasClass("foo"));
        });

        it("iconName=\"style\" gets icon class", () => {
            const wrapper = button(component, { iconName: "style" });
            assert.isTrue(wrapper.hasClass(Classes.iconClass("style")));
        });

        it("renders the button text prop", () => {
            const wrapper = button(component, { text: "some text" }, true);
            assert.equal(wrapper.text(), "some text");
        });

        it("renders a loading spinner when the loading prop is true", () => {
            const wrapper = button(component, { loading: true });
            assert.lengthOf(wrapper.find(Spinner), 1);
        });

        it("button is disabled when the loading prop is true", () => {
            const wrapper = button(component, { loading: true });
            assert.isTrue(wrapper.hasClass(Classes.DISABLED));
        });

        it("clicking button triggers onClick prop", () => {
            const onClick = sinon.spy();
            button(component, { onClick }).simulate("click");
            assert.equal(onClick.callCount, 1);
        });

        it("clicking disabled button does not trigger onClick prop", () => {
            const onClick = sinon.spy();
            // full DOM mount so `button` element will ignore click
            button(component, { disabled: true, onClick }, true).simulate("click");
            assert.equal(onClick.callCount, 0);
        });

        it("elementRef receives reference to HTML element", () => {
            const elementRef = sinon.spy();
            // full DOM rendering here so the ref handler is invoked
            button(component, { elementRef }, true);
            assert.isTrue(elementRef.calledOnce);
            assert.instanceOf(elementRef.args[0][0], HTMLElement);
        });

        if (moreTests != null) {
            moreTests();
        }
    });
}

function button(component: React.ComponentClass<any>, props: IButtonProps, useMount = false) {
    const element = React.createElement(component, props);
    return useMount ? mount(element) : shallow(element);
}
