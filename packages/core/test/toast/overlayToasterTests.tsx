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
import * as ReactDOM from "react-dom";
import sinon, { spy } from "sinon";

import { expectPropValidationError } from "@blueprintjs/test-commons";

import { Classes, OverlayToaster, type OverlayToasterProps, type Toaster } from "../../src";
import { TOASTER_CREATE_NULL, TOASTER_MAX_TOASTS_INVALID } from "../../src/common/errors";
import { OVERLAY_TOASTER_DELAY_MS } from "../../src/components/toast/overlayToaster";

const SPECS = [
    {
        cleanup: unmountReact16Toaster,
        create: (props: OverlayToasterProps | undefined, containerElement: HTMLElement) =>
            OverlayToaster.create(props, containerElement),
        name: "create",
    },
    {
        cleanup: unmountReact16Toaster,
        create: (props: OverlayToasterProps | undefined, containerElement: HTMLElement) =>
            OverlayToaster.createAsync(props, { container: containerElement }),
        name: "createAsync",
    },
];

/**
 * Dynamically run describe blocks. The helper function here reduces indentation
 * width compared to inlining a for loop.
 *
 * https://mochajs.org/#dynamically-generating-tests
 */
function describeEach<T extends { name: string }>(specs: readonly T[], runner: (spec: T) => void) {
    for (const spec of specs) {
        describe(spec.name, () => runner(spec));
    }
}

/**
 * @param containerElement The container argument passed to OverlayToaster.create/OverlayToaster.createAsync
 */
function unmountReact16Toaster(containerElement: HTMLElement) {
    const toasterRenderRoot = containerElement.firstElementChild;
    if (toasterRenderRoot == null) {
        throw new Error("No elements were found under Toaster container.");
    }
    // TODO(React 18): Replace deprecated ReactDOM methods. See: https://github.com/palantir/blueprint/issues/7167
    // eslint-disable-next-line deprecation/deprecation
    ReactDOM.unmountComponentAtNode(toasterRenderRoot);
}

describe("OverlayToaster", () => {
    let clock: sinon.SinonFakeTimers;
    let testsContainerElement: HTMLElement;
    let toaster: Toaster;

    describeEach(SPECS, spec => {
        describe("with default props", () => {
            before(async () => {
                testsContainerElement = document.createElement("div");
                document.documentElement.appendChild(testsContainerElement);
                toaster = await spec.create({}, testsContainerElement);
            });

            beforeEach(() => {
                clock = sinon.useFakeTimers();
            });

            afterEach(() => {
                clock.restore();
                toaster.clear();
            });

            after(() => {
                spec.cleanup(testsContainerElement);
                document.documentElement.removeChild(testsContainerElement);
            });

            it("does not attach toast container to body on script load", () => {
                assert.lengthOf(
                    document.getElementsByClassName(Classes.TOAST_CONTAINER),
                    0,
                    "unexpected toast container",
                );
            });

            it("show() renders toast on next tick", done => {
                clock.restore();
                toaster.show({
                    message: "Hello world",
                });
                assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
                // setState needs a tick to flush DOM updates
                setTimeout(() => {
                    assert.isNotNull(
                        document.querySelector(`.${Classes.TOAST_CONTAINER}.${Classes.OVERLAY_OPEN}`),
                        "expected toast container element to have 'overlay open' class name",
                    );
                    done();
                });
            });

            it("multiple show()s renders them all", () => {
                toaster.show({ message: "one" });
                toaster.show({ message: "two" });
                toaster.show({ message: "six" });
                clock.tick(3 * OVERLAY_TOASTER_DELAY_MS);
                assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
            });

            it("multiple shows() get queued if provided too quickly", () => {
                toaster.show({ message: "one" });
                toaster.show({ message: "two" });
                toaster.show({ message: "three" });
                assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
                clock.tick(3 * OVERLAY_TOASTER_DELAY_MS);
                assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts after delay");
            });

            it("show() immediately displays a toast when waiting after the previous show()", () => {
                toaster.show({ message: "one" });
                assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
                clock.tick(2 * OVERLAY_TOASTER_DELAY_MS);
                toaster.show({ message: "two" });
                assert.lengthOf(toaster.getToasts(), 2, "expected 2 toasts");
            });

            it("show() updates existing toast", () => {
                const key = toaster.show({ message: "one" });
                assert.deepEqual(toaster.getToasts()[0].message, "one");
                toaster.show({ message: "two" }, key);
                assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
                assert.deepEqual(toaster.getToasts()[0].message, "two");
            });

            it("show() updates existing toast in queue", () => {
                toaster.show({ message: "one" });
                const key = toaster.show({ message: "two" });
                toaster.show({ message: "two updated" }, key);
                clock.tick(2 * OVERLAY_TOASTER_DELAY_MS);
                assert.lengthOf(toaster.getToasts(), 2, "expected 2 toasts");
                assert.deepEqual(toaster.getToasts()[0].message, "two updated");
            });

            it("dismiss() removes just the toast in question", () => {
                toaster.show({ message: "one" });
                const key = toaster.show({ message: "two" });
                toaster.show({ message: "six" });
                clock.tick(3 * OVERLAY_TOASTER_DELAY_MS);
                toaster.dismiss(key);
                assert.deepEqual(
                    toaster.getToasts().map(t => t.message),
                    ["six", "one"],
                );
            });

            it("clear() removes all toasts", () => {
                toaster.show({ message: "one" });
                toaster.show({ message: "two" });
                toaster.show({ message: "six" });
                clock.tick(OVERLAY_TOASTER_DELAY_MS);
                assert.lengthOf(toaster.getToasts(), 2, "expected 2 toasts");
                toaster.clear();
                assert.lengthOf(toaster.getToasts(), 0, "expected 0 toasts");
                // Ensure the queue is cleared
                clock.tick(2 * OVERLAY_TOASTER_DELAY_MS);
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
                const action = document.querySelector<HTMLElement>(`.${Classes.TOAST} .${Classes.BUTTON}`);
                action?.click();
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
                const dismiss = document.querySelector<HTMLElement>(`.${Classes.TOAST} .${Classes.BUTTON}`);
                dismiss?.click();
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
                try {
                    // if Toaster doesn't clone the props object before injecting key then there will be a
                    // React error that both toasts have the same key, because both instances refer to the
                    // same object.
                    const toast = { message: "repeat" };
                    toaster.show(toast);
                    toaster.show(toast);
                    assert.isFalse(errorSpy.calledWithMatch("two children with the same key"), "mutation side effect!");
                } finally {
                    // Restore console.error. Otherwise other tests will fail
                    // with "TypeError: Attempted to wrap error which is already
                    // wrapped" when attempting to spy on console.error again.
                    sinon.restore();
                }
            });
        });

        describe("with maxToasts set to finite value", () => {
            before(async () => {
                testsContainerElement = document.createElement("div");
                document.documentElement.appendChild(testsContainerElement);
                toaster = await spec.create({ maxToasts: 3 }, testsContainerElement);
            });

            beforeEach(() => {
                clock = sinon.useFakeTimers();
            });

            after(() => {
                unmountReact16Toaster(testsContainerElement);
                document.documentElement.removeChild(testsContainerElement);
            });
            afterEach(() => {
                clock.restore();
            });

            it("does not exceed the maximum toast limit set", () => {
                toaster.show({ message: "one" });
                toaster.show({ message: "two" });
                toaster.show({ message: "three" });
                toaster.show({ message: "oh no" });
                clock.tick(4 * OVERLAY_TOASTER_DELAY_MS);
                assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
            });

            it("does not dismiss toasts when updating an existing toast at the limit", async () => {
                toaster.show({ message: "one" });
                toaster.show({ message: "two" });
                toaster.show({ message: "three" }, "3");
                toaster.show({ message: "three updated" }, "3");
                clock.tick(4 * OVERLAY_TOASTER_DELAY_MS);
                assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
            });
        });

        describe("with autoFocus set to true", () => {
            before(async () => {
                testsContainerElement = document.createElement("div");
                document.documentElement.appendChild(testsContainerElement);
                toaster = await spec.create({ autoFocus: true }, testsContainerElement);
            });

            after(() => {
                spec.cleanup(testsContainerElement);
                document.documentElement.removeChild(testsContainerElement);
            });

            it("focuses inside toast container", done => {
                toaster.show({ message: "focus near me" });
                // small explicit timeout reduces flakiness of these tests
                setTimeout(() => {
                    const toastElement = testsContainerElement.querySelector(`.${Classes.TOAST_CONTAINER}`);
                    assert.isTrue(toastElement?.contains(document.activeElement));
                    done();
                }, 100);
            });
        });

        it("throws an error if used within a React lifecycle method", () => {
            testsContainerElement = document.createElement("div");

            class LifecycleToaster extends React.Component {
                public render() {
                    return React.createElement("div");
                }

                public componentDidMount() {
                    try {
                        spec.create({}, testsContainerElement);
                    } catch (err: any) {
                        assert.equal(err.message, TOASTER_CREATE_NULL);
                    } finally {
                        spec.cleanup(testsContainerElement);
                    }
                }
            }
            mount(React.createElement(LifecycleToaster));
        });
    });

    describe("validation", () => {
        it("throws an error when max toast is set to a number less than 1", () => {
            expectPropValidationError(OverlayToaster, { maxToasts: 0 }, TOASTER_MAX_TOASTS_INVALID);
        });
    });
});
