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
    buttonTestSuite(AnchorButton, "a");
});

function buttonTestSuite(component: React.ComponentClass<any>, tagName: string) {
    describe(`<${component.displayName.split(".")[1]}>`, () => {
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

        it("renders the button text prop", () => {
            const wrapper = button({ text: "some text" }, true);
            assert.equal(wrapper.text(), "some text");
        });

        it("renders a loading spinner when the loading prop is true", () => {
            const wrapper = button({ loading: true });
            assert.lengthOf(wrapper.find(Spinner), 1);
        });

        it("button is disabled when the loading prop is true", () => {
            const wrapper = button({ loading: true });
            assert.isTrue(wrapper.hasClass(Classes.DISABLED));
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

        it("pressing enter triggers onKeyDown props with any modifier flags", () => {
            checkKeyEventCallbackInvoked("onKeyDown", "keydown", Keys.ENTER);
        });

        it("pressing space triggers onKeyDown props with any modifier flags", () => {
            checkKeyEventCallbackInvoked("onKeyDown", "keydown", Keys.SPACE);
        });

        it("calls onClick when enter key released", (done) => {
            checkClickTriggeredOnKeyUp(done, {}, { which: Keys.ENTER });
        });

        it("calls onClick when space key released", (done) => {
            checkClickTriggeredOnKeyUp(done, {}, { which: Keys.SPACE });
        });

        it("elementRef receives reference to HTML element", () => {
            const elementRef = sinon.spy();
            // full DOM rendering here so the ref handler is invoked
            button({ elementRef }, true);
            assert.isTrue(elementRef.calledOnce);
            assert.instanceOf(elementRef.args[0][0], HTMLElement);
        });

        function button(props: IButtonProps, useMount = false) {
            const element = React.createElement(component, props);
            return useMount ? mount(element) : shallow(element);
        }

        function checkClickTriggeredOnKeyUp(done: MochaDone,
                                            buttonProps: Partial<IButtonProps>,
                                            keyEventProps: Partial<React.KeyboardEvent<any>>) {
            const wrapper = button(buttonProps, true);

            // mock the DOM click() function, because enzyme only handles
            // simulated React events
            const buttonRef = (wrapper.instance() as any).buttonRef;
            const onClick = sinon.spy(buttonRef, "click");

            wrapper.simulate("keyup", keyEventProps);

            // wait for the whole lifecycle to run
            setTimeout(() => {
                assert.equal(onClick.callCount, 1);
                done();
            }, 0);
        }

        function checkKeyEventCallbackInvoked(callbackPropName: string, eventName: string, keyCode: number) {
            const callback = sinon.spy();

            // IButtonProps doesn't include onKeyDown or onKeyUp in its
            // definition, even though Buttons support those props. Casting as
            // `any` gets around that for the purpose of these tests.
            const wrapper = button({ [callbackPropName]: callback } as any);
            const eventProps = { keyCode, shiftKey: true, metaKey: true};
            wrapper.simulate(eventName, eventProps);

            // check that the callback was invoked with modifier key flags included
            assert.equal(callback.callCount, 1);
            assert.equal(callback.firstCall.args[0].shiftKey, true);
            assert.equal(callback.firstCall.args[0].metaKey, true);
        }
    });
}
