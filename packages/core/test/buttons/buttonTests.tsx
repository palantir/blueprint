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
import { mount, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { AnchorButton, Button, Classes, IButtonProps, Icon, Spinner } from "../../src";
import * as Keys from "../../src/common/keys";

describe("Buttons:", () => {
    buttonTestSuite(Button, "button");
    buttonTestSuite(AnchorButton, "a");
});

function buttonTestSuite(component: React.ComponentClass<any>, tagName: string) {
    describe(`<${component.displayName!.split(".")[1]}>`, () => {
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

        it("renders the button text prop", () => {
            const wrapper = mount(<Button data-test-foo="bar" />);
            assert.isTrue(wrapper.find('[data-test-foo="bar"]').exists());
        });

        it("wraps string children in spans", () => {
            // so text can be hidden when loading
            const wrapper = button({}, true, "raw string", <em>not a string</em>);
            assert.equal(wrapper.find("span").length, 1, "span not found");
            assert.equal(wrapper.find("em").length, 1, "em not found");
        });

        it("renders span if text={0}", () => {
            const wrapper = button({ text: 0 }, true);
            assert.equal(wrapper.text(), "0");
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

        // This tests some subtle (potentialy unexpected) behavior, but it was an API decision we
        // made a long time ago which we rely on and should not break.
        // See https://github.com/palantir/blueprint/issues/3819#issuecomment-1189478596
        it("button is disabled when the loading prop is true, even if disabled={false}", () => {
            const wrapper = button({ disabled: false, loading: true });
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

        if (typeof React.createRef !== "undefined") {
            it("matches buttonRef with elementRef.current using createRef", done => {
                const elementRef = React.createRef<HTMLButtonElement>();
                const wrapper = button({ elementRef }, true);

                // wait for the whole lifecycle to run
                setTimeout(() => {
                    assert.equal(elementRef.current, (wrapper.instance() as any).buttonRef);
                    done();
                }, 0);
            });
        }

        it("matches buttonRef with elementRef using callback", done => {
            let elementRef: HTMLElement | null = null;
            const wrapper = button(
                {
                    elementRef: (ref: HTMLButtonElement | null) => (elementRef = ref),
                },
                true,
            );

            // wait for the whole lifecycle to run
            setTimeout(() => {
                assert.equal(elementRef, (wrapper.instance() as any).buttonRef);
                done();
            }, 0);
        });

        it("updates on ref change", () => {
            const Component = component;
            let elementRef: HTMLElement | null = null;
            let elementRefNew: HTMLElement | null = null;
            let callCount = 0;
            let newCallCount = 0;

            const buttonRefCallback = (ref: HTMLElement | null) => {
                callCount += 1;
                elementRef = ref;
            };
            const buttonNewRefCallback = (ref: HTMLElement | null) => {
                newCallCount += 1;
                elementRefNew = ref;
            };

            const wrapper = mount(<Component elementRef={buttonRefCallback} />);

            assert.instanceOf(elementRef, HTMLElement);
            assert.strictEqual(callCount, 1);

            wrapper.setProps({ elementRef: buttonNewRefCallback });
            wrapper.update();
            assert.strictEqual(callCount, 2);
            assert.isNull(elementRef);
            assert.strictEqual(newCallCount, 1);
            assert.instanceOf(elementRefNew, HTMLElement);
        });

        if (typeof React.useRef !== "undefined") {
            it("matches buttonRef with elementRef.current using useRef", done => {
                let elementRef: React.RefObject<HTMLElement>;
                const Component = component;

                const Test = () => {
                    elementRef = React.useRef<HTMLButtonElement>(null);

                    return <Component elementRef={elementRef} />;
                };

                const wrapper = mount(<Test />);

                // wait for the whole lifecycle to run
                setTimeout(() => {
                    assert.equal(elementRef.current, (wrapper.find(Component).instance() as any).buttonRef);
                    done();
                }, 0);
            });
        }

        function button(props: IButtonProps, useMount = false, ...children: React.ReactNode[]) {
            const element = React.createElement(component, props, ...children);
            return useMount ? mount(element) : shallow(element);
        }

        function checkClickTriggeredOnKeyUp(
            done: Mocha.Done,
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
