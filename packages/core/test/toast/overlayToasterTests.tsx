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

import { waitFor } from "@testing-library/dom";
import { assert } from "chai";
import { createRoot, type Root } from "react-dom/client";
import sinon, { spy } from "sinon";

import { expectPropValidationError } from "@blueprintjs/test-commons";

import { Classes, OverlayToaster, type Toaster } from "../../src";
import { TOASTER_MAX_TOASTS_INVALID } from "../../src/common/errors";
import { OVERLAY_TOASTER_DELAY_MS, type OverlayToasterDOMRenderer } from "../../src/components/toast/overlayToaster";

let react18Root: Root | undefined;

describe("OverlayToaster", () => {
    let containerElement: HTMLElement;
    let toaster: Toaster;

    const domRenderer: OverlayToasterDOMRenderer = (element, container) => {
        react18Root?.unmount();
        react18Root = createRoot(container);
        react18Root.render(element);
    };

    describe("with default props", () => {
        before(async () => {
            containerElement = document.createElement("div");
            document.documentElement.appendChild(containerElement);
            toaster = await OverlayToaster.create(
                {},
                {
                    container: containerElement,
                    domRenderer,
                },
            );
        });

        afterEach(() => {
            toaster.clear();
        });

        after(() => {
            document.documentElement.removeChild(containerElement);
        });

        it("does not attach toast container to body on script load", () => {
            assert.lengthOf(document.getElementsByClassName(Classes.TOAST_CONTAINER), 0, "unexpected toast container");
        });

        it("show() renders toast on next tick", async () => {
            toaster.show({
                message: "Hello world",
            });
            await waitFor(() => {
                assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
            });
            assert.isNotNull(
                document.querySelector(`.${Classes.TOAST_CONTAINER}.${Classes.OVERLAY_OPEN}`),
                "expected toast container element to have 'overlay open' class name",
            );
        });

        it("multiple show()s renders them all", async () => {
            toaster.show({ message: "one" });
            toaster.show({ message: "two" });
            toaster.show({ message: "six" });
            await waitFor(() => assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts"), {
                timeout: 3 * OVERLAY_TOASTER_DELAY_MS,
            });
        });

        it("multiple shows() get queued if provided too quickly", async () => {
            toaster.show({ message: "one" });
            toaster.show({ message: "two" });
            toaster.show({ message: "three" });
            await waitFor(() => assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast"));
            await waitFor(() => assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts after delay"), {
                timeout: 3 * OVERLAY_TOASTER_DELAY_MS,
            });
        });

        it("show() immediately displays a toast when waiting after the previous show()", async () => {
            toaster.show({ message: "one" });
            await waitFor(() => assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast"));
            await waitFor(
                () => {
                    toaster.show({ message: "two" });
                    assert.lengthOf(toaster.getToasts(), 2, "expected 2 toasts");
                },
                { timeout: 2 * OVERLAY_TOASTER_DELAY_MS },
            );
        });

        it("show() updates existing toast", async () => {
            const key = toaster.show({ message: "one" });
            await waitFor(() => {
                assert.deepEqual(toaster.getToasts()[0].message, "one");
            });
            toaster.show({ message: "two" }, key);
            await waitFor(() => {
                assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
                assert.deepEqual(toaster.getToasts()[0].message, "two");
            });
        });

        it("show() updates existing toast in queue", async () => {
            toaster.show({ message: "one" });
            const key = toaster.show({ message: "two" });
            toaster.show({ message: "two updated" }, key);
            await waitFor(
                () => {
                    assert.lengthOf(toaster.getToasts(), 2, "expected 2 toasts");
                    assert.deepEqual(toaster.getToasts()[0].message, "two updated");
                },
                { timeout: 2 * OVERLAY_TOASTER_DELAY_MS },
            );
        });

        it("dismiss() removes just the toast in question", async () => {
            toaster.show({ message: "one" });
            const key = toaster.show({ message: "two" });
            toaster.show({ message: "six" });
            await waitFor(() => assert.lengthOf(toaster.getToasts(), 3));
            toaster.dismiss(key);
            await waitFor(
                () => {
                    assert.deepEqual(
                        toaster.getToasts().map(t => t.message),
                        ["six", "one"],
                    );
                },
                { timeout: 3 * OVERLAY_TOASTER_DELAY_MS },
            );
        });

        it("clear() removes all toasts", async () => {
            toaster.show({ message: "one" });
            toaster.show({ message: "two" });
            toaster.show({ message: "six" });
            await waitFor(() => {
                assert.lengthOf(toaster.getToasts(), 2, "expected 2 toasts");
            });
            toaster.clear();
            await waitFor(
                () => {
                    // Ensure the queue is cleared
                    assert.lengthOf(toaster.getToasts(), 0, "expected 0 toasts");
                },
                { timeout: 2 * OVERLAY_TOASTER_DELAY_MS },
            );
        });

        it("action onClick callback invoked when action clicked", async () => {
            const onClick = spy();
            toaster.show({
                action: { onClick, text: "action" },
                message: "message",
                timeout: 0,
            });
            await waitFor(() => {
                /* noop */
            });
            // action is first descendant button
            const action = document.querySelector<HTMLElement>(`.${Classes.TOAST} .${Classes.BUTTON}`);
            action?.click();
            assert.isTrue(onClick.calledOnce, "expected onClick to be called once");
        });

        it("onDismiss callback invoked when close button clicked", async () => {
            const handleDismiss = spy();
            toaster.show({
                message: "dismiss",
                onDismiss: handleDismiss,
                timeout: 0,
            });
            await waitFor(() => {
                /* noop */
            });
            // without action, dismiss is first descendant button
            const dismiss = document.querySelector<HTMLElement>(`.${Classes.TOAST} .${Classes.BUTTON}`);
            dismiss?.click();
            await waitFor(() => assert.isTrue(handleDismiss.calledOnce));
        });

        it("onDismiss callback invoked on toaster.dismiss()", async () => {
            const onDismiss = spy();
            const key = toaster.show({ message: "dismiss me", onDismiss });
            toaster.dismiss(key);
            await waitFor(() => assert.isTrue(onDismiss.calledOnce, "onDismiss not called"));
        });

        it("onDismiss callback invoked on toaster.clear()", async () => {
            const onDismiss = spy();
            toaster.show({ message: "dismiss me", onDismiss });
            await waitFor(() => {
                /* noop */
            });
            toaster.clear();
            await waitFor(() => assert.isTrue(onDismiss.calledOnce, "onDismiss not called"));
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
            containerElement = document.createElement("div");
            document.documentElement.appendChild(containerElement);
            toaster = await OverlayToaster.create({ maxToasts: 3 }, { container: containerElement, domRenderer });
        });

        after(() => {
            document.documentElement.removeChild(containerElement);
        });

        it("does not exceed the maximum toast limit set", async () => {
            toaster.show({ message: "one" });
            toaster.show({ message: "two" });
            toaster.show({ message: "three" });
            toaster.show({ message: "oh no" });
            await waitFor(
                () => {
                    assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
                },
                { timeout: 4 * OVERLAY_TOASTER_DELAY_MS },
            );
        });

        it("does not dismiss toasts when updating an existing toast at the limit", async () => {
            toaster.show({ message: "one" });
            toaster.show({ message: "two" });
            toaster.show({ message: "three" }, "3");
            toaster.show({ message: "three updated" }, "3");
            await waitFor(
                () => {
                    assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
                },
                { timeout: 4 * OVERLAY_TOASTER_DELAY_MS },
            );
        });
    });

    describe("with autoFocus set to true", () => {
        before(async () => {
            containerElement = document.createElement("div");
            document.documentElement.appendChild(containerElement);
            toaster = await OverlayToaster.create({ autoFocus: true }, { container: containerElement, domRenderer });
        });

        after(() => {
            document.documentElement.removeChild(containerElement);
        });

        it("focuses inside toast container", async () => {
            toaster.show({ message: "focus near me" });
            await waitFor(() => {
                const toastElement = containerElement.querySelector(`.${Classes.TOAST_CONTAINER}`);
                assert.isTrue(toastElement?.contains(document.activeElement));
            });
        });
    });

    describe("validation", () => {
        it("throws an error when max toast is set to a number less than 1", () => {
            expectPropValidationError(OverlayToaster, { maxToasts: 0 }, TOASTER_MAX_TOASTS_INVALID);
        });
    });
});
