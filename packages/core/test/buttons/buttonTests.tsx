/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { AnchorButton, Button, Classes, IButtonProps } from "../../src/index";

describe("Buttons:", () => {
    buttonTests(Button, "button");
    buttonTests(AnchorButton, "a");
});

function buttonTests(classType: React.ComponentClass<any>, tagName: string, moreTests?: () => void) {
    describe(`<${classType.displayName.split(".")[1]}>`, () => {
        function button(props: IButtonProps, useMount = false) {
            const element = React.createElement(classType, props);
            return useMount ? mount(element) : shallow(element);
        }

        it("renders its contents", () => {
            const wrapper = button({ className: "foo" });
            assert.isTrue(wrapper.is(tagName));
            assert.isTrue(wrapper.hasClass(Classes.BUTTON));
            assert.isTrue(wrapper.hasClass("foo"));
        });

        it("iconName=\"style\" gets icon class", () => {
            const wrapper = button({ iconName: "style" });
            assert.isTrue(wrapper.hasClass(Classes.iconClass("style")));
        });

        it("clicking button triggers onClick prop", () => {
            const onClick = sinon.spy();
            button({ onClick }).simulate("click");
            assert.equal(onClick.callCount, 1);
        });

        it("clicking disabled button does not trigger onClick prop", () => {
            const onClick = sinon.spy();
            // full DOM mount so `button` element will ignore click
            button({ disabled: true, onClick }, true).simulate("click");
            assert.equal(onClick.callCount, 0);
        });

        it("elementRef receives reference to HTML element", () => {
            const elementRef = sinon.spy();
            // full DOM rendering here so the ref handler is invoked
            button({ elementRef }, true);
            assert.isTrue(elementRef.calledOnce);
            assert.instanceOf(elementRef.args[0][0], HTMLElement);
        });

        if (moreTests != null) {
            moreTests();
        }
    });
}
