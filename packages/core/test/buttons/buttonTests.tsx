/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import * as Keys from "../../src/common/keys";
import { AnchorButton, Button, Classes, IButtonProps, Icon, Spinner } from "../../src/index";

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

        it('icon="style" renders Icon as first child', () => {
            const wrapper = button({ icon: "style" });
            const firstChild = wrapper.find(Icon).at(0);
            assert.strictEqual(firstChild.prop("icon"), "style");
        });

        it("renders the button text prop", () => {
            const wrapper = button({ text: "some text" }, true);
            assert.equal(wrapper.text(), "some text");
        });

        it("renders the button text prop when text={0}", () => {
            const wrapper = button({ text: 0 }, true);
            assert.equal(wrapper.text(), "0");
        });

        it("wraps string children in spans", () => {
            // so text can be hidden when loading
            const wrapper = button({}, true, "raw string", <em>not a string</em>);
            assert.equal(wrapper.find("span").length, 1, "span not found");
            assert.equal(wrapper.find("em").length, 1, "em not found");
        });

        it('doesn\'t render a span if text=""', () => {
            assert.equal(button({}, true, "").find("span").length, 0);
            assert.equal(button({ text: "" }, true).find("span").length, 0);
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
            const onClick = spy();
            button({ onClick }).simulate("click");
            assert.equal(onClick.callCount, 1);
        });

        it("clicking disabled button does not trigger onClick prop", () => {
            const onClick = spy();
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

        it("calls onClick when enter key released", done => {
            checkClickTriggeredOnKeyUp(done, {}, { which: Keys.ENTER });
        });

        it("calls onClick when space key released", done => {
            checkClickTriggeredOnKeyUp(done, {}, { which: Keys.SPACE });
        });

        function button(props: IButtonProps, useMount = false, ...children: React.ReactNode[]) {
            const element = React.createElement(component, props, ...children);
            return useMount ? mount(element) : shallow(element);
        }

        function checkClickTriggeredOnKeyUp(
            done: MochaDone,
            buttonProps: Partial<IButtonProps>,
            keyEventProps: Partial<React.KeyboardEvent<any>>,
        ) {
            const wrapper = button(buttonProps, true);

            // mock the DOM click() function, because enzyme only handles
            // simulated React events
            const buttonRef = (wrapper.instance() as any).buttonRef;
            const onClick = spy(buttonRef, "click");

            wrapper.simulate("keyup", keyEventProps);

            // wait for the whole lifecycle to run
            setTimeout(() => {
                assert.equal(onClick.callCount, 1);
                done();
            }, 0);
        }

        function checkKeyEventCallbackInvoked(callbackPropName: string, eventName: string, keyCode: number) {
            const callback = spy();

            // IButtonProps doesn't include onKeyDown or onKeyUp in its
            // definition, even though Buttons support those props. Casting as
            // `any` gets around that for the purpose of these tests.
            const wrapper = button({ [callbackPropName]: callback } as any);
            const eventProps = { keyCode, shiftKey: true, metaKey: true };
            wrapper.simulate(eventName, eventProps);

            // check that the callback was invoked with modifier key flags included
            assert.equal(callback.callCount, 1);
            assert.equal(callback.firstCall.args[0].shiftKey, true);
            assert.equal(callback.firstCall.args[0].metaKey, true);
        }
    });
}
