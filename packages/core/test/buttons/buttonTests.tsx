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
import React from "react";
import { spy } from "sinon";

import { AnchorButton, Button, Classes, ButtonProps, Icon, Spinner } from "../../src";
import * as Keys from "../../src/common/keys";

describe("Buttons:", () => {
    buttonTestSuite(Button, "button");
    buttonTestSuite(AnchorButton, "a");
});

function buttonTestSuite(component: React.FC<any>, tagName: string) {
    describe(`<${component.displayName!.split(".")[1]}>`, () => {
        it("renders its contents", () => {
            const wrapper = button({ className: "foo" });
            const el = wrapper.find(tagName);
            assert.isTrue(el.exists());
            assert.isTrue(el.hasClass(Classes.BUTTON));
            assert.isTrue(el.hasClass("foo"));
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

        it("renders the button text prop", () => {
            const wrapper = mount(<Button data-test-foo="bar" />);
            assert.isTrue(wrapper.find('[data-test-foo="bar"]').exists());
        });

        it("wraps string children in spans", () => {
            // so text can be hidden when loading
            const wrapper = button({}, "raw string", <em>not a string</em>);
            assert.equal(wrapper.find("span").length, 1, "span not found");
            assert.equal(wrapper.find("em").length, 1, "em not found");
        });

        it("renders span if text={0}", () => {
            const wrapper = button({ text: 0 }, true);
            assert.equal(wrapper.text(), "0");
        });

        it('doesn\'t render a text span if children=""', () => {
            const wrapper = button({}, "");
            assert.equal(wrapper.find("span").length, 0);
        });

        it('doesn\'t render a text span if text=""', () => {
            const wrapper = button({ text: "" });
            assert.equal(wrapper.find("span").length, 0);
        });

        it("renders a loading spinner when the loading prop is true", () => {
            const wrapper = button({ loading: true });
            assert.lengthOf(wrapper.find(Spinner), 1);
        });

        it("button is disabled when the loading prop is true", () => {
            const wrapper = button({ loading: true });
            assert.isTrue(wrapper.find(tagName).hasClass(Classes.DISABLED));
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

        it("attaches ref with createRef", () => {
            const ref = React.createRef<HTMLButtonElement>();
            const wrapper = button({ ref });
            wrapper.update();
            assert.isTrue(
                ref.current instanceof (tagName === "button" ? HTMLButtonElement : HTMLAnchorElement),
                `ref.current should be a(n) ${tagName} element`,
            );
        });

        it("attaches ref with useRef", () => {
            let buttonRef: React.RefObject<any> | undefined;
            const Component = component;

            const Test = () => {
                buttonRef = React.useRef<any>(null);

                return <Component ref={buttonRef} />;
            };

            const wrapper = mount(<Test />);
            wrapper.update();

            assert.isTrue(
                buttonRef?.current instanceof (tagName === "button" ? HTMLButtonElement : HTMLAnchorElement),
                `ref.current should be a(n) ${tagName} element`,
            );
        });

        function button(props: ButtonProps, ...children: React.ReactNode[]) {
            const element = React.createElement(component, props, ...children);
            return mount(element);
        }

        function checkKeyEventCallbackInvoked(callbackPropName: string, eventName: string, keyCode: number) {
            const callback = spy();

            // ButtonProps doesn't include onKeyDown or onKeyUp in its
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
