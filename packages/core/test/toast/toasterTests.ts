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
import * as React from "react";
import * as ReactDOM from "react-dom";
import { spy } from "sinon";

import { mount } from "enzyme";
import * as Classes from "../../src/common/classes";
import { TOASTER_CREATE_NULL } from "../../src/common/errors";
import { IToaster, Toaster } from "../../src/index";

describe("Toaster", () => {
    let testsContainerElement: HTMLElement;
    let toaster: IToaster;

    before(() => {
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
        toaster = Toaster.create({}, testsContainerElement);
    });

    afterEach(() => {
        toaster.clear();
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("does not attach toast container to body on script load", () => {
        assert.lengthOf(document.getElementsByClassName(Classes.TOAST_CONTAINER), 0, "unexpected toast container");
    });

    it("show() renders toast immediately", () => {
        toaster.show({
            message: "Hello world",
        });
        assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
        assert.isNotNull(document.querySelector(`.${Classes.TOAST_CONTAINER}.${Classes.OVERLAY_OPEN}`));
    });

    it("multiple show()s renders them all", () => {
        toaster.show({ message: "one" });
        toaster.show({ message: "two" });
        toaster.show({ message: "six" });
        assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
    });

    it("show() updates existing toast", () => {
        const key = toaster.show({ message: "one" });
        assert.deepEqual(toaster.getToasts()[0].message, "one");
        toaster.show({ message: "two" }, key);
        assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
        assert.deepEqual(toaster.getToasts()[0].message, "two");
    });

    it("dismiss() removes just the toast in question", () => {
        toaster.show({ message: "one" });
        const key = toaster.show({ message: "two" });
        toaster.show({ message: "six" });
        toaster.dismiss(key);
        assert.deepEqual(toaster.getToasts().map(t => t.message), ["six", "one"]);
    });

    it("clear() removes all toasts", () => {
        toaster.show({ message: "one" });
        toaster.show({ message: "two" });
        toaster.show({ message: "six" });
        assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
        toaster.clear();
        assert.lengthOf(toaster.getToasts(), 0, "expected 0 toasts");
    });

    it("action onClick callback invoked when action clicked", () => {
        const onClick = spy();
        toaster.show({
            action: { onClick, text: "action" },
            message: "message",
            timeout: 0,
        });
        // action is first descendant button
        const action = document.querySelector(`.${Classes.TOAST} .${Classes.BUTTON}`) as HTMLElement;
        action.click();
        assert.isTrue(onClick.calledOnce, "expected onClick to be called once");
    });

    it("onDismiss callback invoked when close button clicked", () => {
        const handleDismiss = spy();
        toaster.show({
            message: "dismiss",
            onDismiss: handleDismiss,
            timeout: 0,
        });
        // without action, dismiss is first descendant button
        const dismiss = document.querySelector(`.${Classes.TOAST} .${Classes.BUTTON}`) as HTMLElement;
        dismiss.click();
        assert.isTrue(handleDismiss.calledOnce);
    });

    it("onDismiss callback invoked on toaster.dismiss()", () => {
        const onDismiss = spy();
        const key = toaster.show({ message: "dismiss me", onDismiss });
        toaster.dismiss(key);
        assert.isTrue(onDismiss.calledOnce, "onDismiss not called");
    });

    it("onDismiss callback invoked on toaster.clear()", () => {
        const onDismiss = spy();
        toaster.show({ message: "dismiss me", onDismiss });
        toaster.clear();
        assert.isTrue(onDismiss.calledOnce, "onDismiss not called");
    });

    it("reusing props object does not produce React errors", () => {
        const errorSpy = spy(console, "error");
        // if Toaster doesn't clone the props object before injecting key then there will be a
        // React error that both toasts have the same key, because both instances refer to the
        // same object.
        const toast = { message: "repeat" };
        toaster.show(toast);
        toaster.show(toast);
        assert.isFalse(errorSpy.calledWithMatch("two children with the same key"), "mutation side effect!");
    });

    describe("with autoFocus set to true", () => {
        before(() => {
            testsContainerElement = document.createElement("div");
            document.documentElement.appendChild(testsContainerElement);
            toaster = Toaster.create({ autoFocus: true }, testsContainerElement);
        });

        it("focuses on newly created toast", done => {
            toaster.show({ message: "focus on me" });
            // small explicit timeout reduces flakiness of these tests
            setTimeout(() => {
                assert.equal(testsContainerElement.querySelector(`.${Classes.TOAST}`), document.activeElement);
                done();
            }, 10);
        });
    });

    it("throws an error if used within a React lifecycle method", () => {
        class LifecycleToaster extends React.Component {
            public render() {
                return React.createElement("div");
            }

            public componentDidMount() {
                try {
                    Toaster.create();
                } catch (err) {
                    assert.equal(err.message, TOASTER_CREATE_NULL);
                }
            }
        }
        mount(React.createElement(LifecycleToaster));
    });
});
