/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { dispatchMouseEvent } from "@blueprintjs/test-commons";

import { Classes, Overlay2, type OverlayInstance, type OverlayProps, Portal, Utils } from "../../src";
import { resetOpenStack } from "../../src/components/overlay2/overlay2";
import { findInPortal } from "../utils";

import "./overlay2-test-debugging.scss";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

/*
 * IMPORTANT NOTE: It is critical that every <Overlay2> wrapper be unmounted after the test, to avoid
 * polluting the DOM with leftover overlay elements. This was the cause of the Overlay test flakes of
 * late 2017/early 2018 and was resolved by ensuring that every wrapper is unmounted.
 *
 * The `wrapper` variable below and the `mountWrapper` method should be used for full enzyme mounts.
 * For shallow mounts, be sure to call `shallowWrapper.unmount()` after the assertions.
 */
describe("<Overlay2>", () => {
    let wrapper: ReactWrapper<OverlayProps, any>;
    let isMounted = false;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    /**
     * Mount the `content` into `testsContainerElement` and assign to local `wrapper` variable.
     * Use this method in this suite instead of Enzyme's `mount` method.
     */
    function mountWrapper(content: React.JSX.Element) {
        wrapper = mount(content, { attachTo: testsContainerElement });
        isMounted = true;
        return wrapper;
    }

    afterEach(() => {
        if (isMounted) {
            // clean up wrapper after each test, if it was used
            wrapper?.unmount();
            wrapper?.detach();
            isMounted = false;
        }
    });

    after(() => {
        document.documentElement.removeChild(testsContainerElement);
    });

    it("renders its content correctly", () => {
        const overlay = mountWrapper(
            <Overlay2 isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay2>,
        );
        assert.lengthOf(overlay.find("strong"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 1);
    });

    it("renders contents to specified container correctly", () => {
        const CLASS_TO_TEST = "bp-test-content";
        const container = document.createElement("div");
        document.body.appendChild(container);
        mountWrapper(
            <Overlay2 isOpen={true} portalContainer={container}>
                <p className={CLASS_TO_TEST}>test</p>
            </Overlay2>,
        );
        assert.lengthOf(container.getElementsByClassName(CLASS_TO_TEST), 1);
        document.body.removeChild(container);
    });

    it("sets aria-live", () => {
        // Using an open Overlay2 because an initially closed Overlay2 will not render anything to the
        // DOM
        mountWrapper(<Overlay2 className="aria-test" isOpen={true} usePortal={false} />);
        const overlayElement = document.querySelector(".aria-test");
        assert.exists(overlayElement);
        // Element#ariaLive not supported in Firefox or IE
        assert.equal(overlayElement?.getAttribute("aria-live"), "polite");
    });

    it("portalClassName appears on Portal", () => {
        const CLASS_TO_TEST = "bp-test-content";
        mountWrapper(
            <Overlay2 isOpen={true} portalClassName={CLASS_TO_TEST}>
                <p>test</p>
            </Overlay2>,
        );
        // search document for portal container element.
        assert.isDefined(document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`));
    });

    it("renders Portal after first opened", () => {
        mountWrapper(<Overlay2 isOpen={false}>{createOverlayContents()}</Overlay2>);
        assert.lengthOf(wrapper.find(Portal), 0, "unexpected Portal");
        wrapper.setProps({ isOpen: true }).update();
        assert.lengthOf(wrapper.find(Portal), 1, "expected Portal");
    });

    it("supports non-element children", () => {
        assert.doesNotThrow(() => {
            mountWrapper(
                <Overlay2 isOpen={true} usePortal={false}>
                    {null} {undefined}
                </Overlay2>,
            );
        });
    });

    it("hasBackdrop=false does not render backdrop", () => {
        const overlay = mountWrapper(
            <Overlay2 hasBackdrop={false} isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay2>,
        );
        assert.lengthOf(overlay.find("strong"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 0);
    });

    it("renders portal attached to body when not inline after first opened", () => {
        mountWrapper(<Overlay2 isOpen={false}>{createOverlayContents()}</Overlay2>);
        assert.lengthOf(wrapper.find(Portal), 0, "unexpected Portal");
        wrapper.setProps({ isOpen: true }).update();
        assert.lengthOf(wrapper.find(Portal), 1, "expected Portal");
    });

    describe("onClose", () => {
        it("invoked on backdrop mousedown when canOutsideClickClose=true", () => {
            const onClose = spy();
            const overlay = mountWrapper(
                <Overlay2 canOutsideClickClose={true} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay2>,
            );
            overlay.find(BACKDROP_SELECTOR).simulate("mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on backdrop mousedown when canOutsideClickClose=false", () => {
            const onClose = spy();
            const overlay = mountWrapper(
                <Overlay2 canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay2>,
            );
            overlay.find(BACKDROP_SELECTOR).simulate("mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on document mousedown when hasBackdrop=false", () => {
            const onClose = spy();
            // mounting cuz we need document events + lifecycle
            mountWrapper(
                <Overlay2 hasBackdrop={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay2>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay2
                    canOutsideClickClose={false}
                    hasBackdrop={false}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                >
                    {createOverlayContents()}
                </Overlay2>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("not invoked on click of a nested overlay", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay2 isOpen={true} onClose={onClose}>
                    <div id="outer-element">
                        {createOverlayContents()}
                        <Overlay2 isOpen={true}>
                            <div id="inner-element">{createOverlayContents()}</div>
                        </Overlay2>
                    </div>
                </Overlay2>,
            );
            // this hackery is necessary for React 15 support, where Portals break trees.
            findInPortal(findInPortal(wrapper, "#outer-element"), "#inner-element").simulate("mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on escape key", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay2 isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay2>,
            );
            wrapper.simulate("keydown", { key: "Escape" });
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = spy();
            const overlay = mountWrapper(
                <Overlay2 canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay2>,
            );
            overlay.simulate("keydown", { key: "Escape" });
            assert.isTrue(onClose.notCalled);
        });

        it("renders portal attached to body when not inline", () => {
            const overlay = mountWrapper(
                <Overlay2 isOpen={true} usePortal={true}>
                    {createOverlayContents()}
                </Overlay2>,
            );
            const portal = overlay.find(Portal);
            assert.isTrue(portal.exists(), "missing Portal");
            assert.lengthOf(portal.find("strong"), 1, "missing h1");
        });
    });

    describe("Focus management", () => {
        const overlayClassName = "test-overlay";

        it("brings focus to overlay if autoFocus=true", done => {
            mountWrapper(
                <Overlay2 className={overlayClassName} autoFocus={true} isOpen={true} usePortal={true}>
                    <input type="text" />
                </Overlay2>,
            );
            assertFocusIsInOverlayWithTimeout(done);
        });

        it("does not bring focus to overlay if autoFocus=false and enforceFocus=false", done => {
            mountWrapper(
                <div>
                    <button>something outside overlay for browser to focus on</button>
                    <Overlay2
                        className={overlayClassName}
                        autoFocus={false}
                        enforceFocus={false}
                        isOpen={true}
                        usePortal={true}
                    >
                        <input type="text" />
                    </Overlay2>
                </div>,
            );
            assertFocusWithTimeout("body", done);
        });

        // React implements autoFocus itself so our `[autofocus]` logic never fires.
        // Still, worth testing we can control where the focus goes.
        it("autoFocus element inside overlay gets the focus", done => {
            mountWrapper(
                <Overlay2 className={overlayClassName} isOpen={true} usePortal={true}>
                    <input autoFocus={true} type="text" />
                </Overlay2>,
            );
            assertFocusWithTimeout("input", done);
        });

        it("returns focus to overlay if enforceFocus=true", done => {
            const buttonRef = React.createRef<HTMLButtonElement>();
            const inputRef = React.createRef<HTMLInputElement>();
            mountWrapper(
                <div>
                    <button ref={buttonRef} />
                    <Overlay2 className={overlayClassName} enforceFocus={true} isOpen={true} usePortal={true}>
                        <div>
                            <input autoFocus={true} ref={inputRef} />
                        </div>
                    </Overlay2>
                </div>,
            );
            assert.strictEqual(document.activeElement, inputRef.current);
            buttonRef.current?.focus();
            assertFocusIsInOverlayWithTimeout(done);
        });

        it("returns focus to overlay after clicking the backdrop if enforceFocus=true", done => {
            mountWrapper(
                <Overlay2
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                >
                    {createOverlayContents()}
                </Overlay2>,
            );
            wrapper.find(BACKDROP_SELECTOR).simulate("mousedown");
            assertFocusIsInOverlayWithTimeout(done);
        });

        it("returns focus to overlay after clicking an outside element if enforceFocus=true", done => {
            mountWrapper(
                <div>
                    <Overlay2
                        enforceFocus={true}
                        canOutsideClickClose={false}
                        className={overlayClassName}
                        isOpen={true}
                        usePortal={false}
                        hasBackdrop={false}
                    >
                        {createOverlayContents()}
                    </Overlay2>
                    <button id="buttonId" />
                </div>,
            );
            wrapper.find("#buttonId").simulate("click");
            assertFocusIsInOverlayWithTimeout(done);
        });

        it("does not result in maximum call stack if two overlays open with enforceFocus=true", () => {
            const instanceRef = React.createRef<OverlayInstance>();
            const anotherContainer = document.createElement("div");
            document.documentElement.appendChild(anotherContainer);
            const temporaryWrapper = mount(
                <Overlay2
                    className={overlayClassName}
                    enforceFocus={true}
                    isOpen={true}
                    usePortal={false}
                    ref={instanceRef}
                >
                    <input type="text" />
                </Overlay2>,
                { attachTo: anotherContainer },
            );

            mountWrapper(
                <Overlay2 className={overlayClassName} enforceFocus={true} isOpen={false} usePortal={false}>
                    <input id="inputId" type="text" />
                </Overlay2>,
            );

            assert.isNotNull(instanceRef.current, "ref should be set");

            wrapper.setProps({ isOpen: true }).update();
            // potentially triggers infinite recursion if both overlays try to bring focus back to themselves
            wrapper.find("#inputId").simulate("click").update();
            // previous test suites for Overlay spied on bringFocusInsideOverlay and asserted it was called once here,
            // but that is more difficult to test with function components and breaches the abstraction of Overlay2.

            temporaryWrapper.unmount();
            document.documentElement.removeChild(anotherContainer);
        });

        it("does not return focus to overlay if enforceFocus=false", done => {
            let buttonRef: HTMLElement | null;
            const focusBtnAndAssert = () => {
                buttonRef?.focus();
                assert.strictEqual(buttonRef, document.activeElement);
                done();
            };

            mountWrapper(
                <div>
                    <button ref={ref => (buttonRef = ref)} />
                    <Overlay2 className={overlayClassName} enforceFocus={false} isOpen={true} usePortal={true}>
                        <div>
                            <input ref={ref => ref && setTimeout(focusBtnAndAssert)} />
                        </div>
                    </Overlay2>
                </div>,
            );
        });

        it("doesn't focus overlay if focus is already inside overlay", done => {
            let textarea: HTMLTextAreaElement | null;
            mountWrapper(
                <Overlay2 className={overlayClassName} isOpen={true} usePortal={true}>
                    <div>
                        <textarea ref={ref => (textarea = ref)} />
                    </div>
                </Overlay2>,
            );
            textarea!.focus();
            assertFocusWithTimeout("textarea", done);
        });

        it("does not focus overlay when closed", done => {
            mountWrapper(
                <div>
                    <button ref={ref => ref && ref.focus()} />
                    <Overlay2 className={overlayClassName} isOpen={false} usePortal={true} />
                </div>,
            );
            assertFocusWithTimeout("button", done);
        });

        it("does not crash while trying to return focus to overlay if user clicks outside the document", () => {
            mountWrapper(
                <Overlay2
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                >
                    {createOverlayContents()}
                </Overlay2>,
            );

            // this is a fairly custom / nonstandard event dispatch, trying to simulate what happens in some browsers when a user clicks
            // on the browser toolbar (outside the document), but a focus event is still dispatched to document
            // see https://github.com/palantir/blueprint/issues/3928
            const event = new FocusEvent("focus");
            Object.defineProperty(event, "target", { value: window });

            try {
                document.dispatchEvent(event);
            } catch (e) {
                assert.fail("threw uncaught error");
            }
        });

        function assertFocusWithTimeout(selector: string | (() => void), done: Mocha.Done) {
            // the behavior being tested relies on requestAnimationFrame.
            // setTimeout for a few frames later to let things settle (to reduce flakes).
            setTimeout(() => {
                wrapper.update();
                if (Utils.isFunction(selector)) {
                    selector();
                } else {
                    assert.strictEqual(document.querySelector(selector), document.activeElement);
                }
                done();
            }, 40);
        }

        function assertFocusIsInOverlayWithTimeout(done: Mocha.Done) {
            assertFocusWithTimeout(() => {
                const overlayElement = document.querySelector(`.${overlayClassName}`);
                assert.isTrue(overlayElement?.contains(document.activeElement));
            }, done);
        }
    });

    describe("Background scrolling", () => {
        beforeEach(() => {
            // force-reset Overlay2 stack state between tests
            resetOpenStack();
            document.body.classList.remove(Classes.OVERLAY_OPEN);
        });

        describe("upon mount", () => {
            it("disables document scrolling by default", done => {
                wrapper = mountWrapper(renderBackdropOverlay());
                assertBodyScrollingDisabled(true, done);
            });

            it("disables document scrolling if hasBackdrop=true and usePortal=true", done => {
                wrapper = mountWrapper(renderBackdropOverlay(true, true));
                assertBodyScrollingDisabled(true, done);
            });

            it("does not disable document scrolling if hasBackdrop=true and usePortal=false", done => {
                wrapper = mountWrapper(renderBackdropOverlay(true, false));
                assertBodyScrollingDisabled(false, done);
            });

            it("does not disable document scrolling if hasBackdrop=false and usePortal=true", done => {
                wrapper = mountWrapper(renderBackdropOverlay(false, true));
                assertBodyScrollingDisabled(false, done);
            });

            it("does not disable document scrolling if hasBackdrop=false and usePortal=false", done => {
                wrapper = mountWrapper(renderBackdropOverlay(false, false));
                assertBodyScrollingDisabled(false, done);
            });
        });

        describe("after closing", () => {
            it("restores body scrolling", done => {
                const handleClosed = () => {
                    assert.isFalse(
                        wrapper.getDOMNode().classList.contains(Classes.OVERLAY_OPEN),
                        `expected overlay element to not have ${Classes.OVERLAY_OPEN} class`,
                    );
                    assertBodyScrollingDisabled(false, done);
                };

                wrapper = mountWrapper(
                    <Overlay2 isOpen={true} usePortal={true} onClosed={handleClosed} transitionDuration={0}>
                        {createOverlayContents()}
                    </Overlay2>,
                );
                wrapper.setProps({ isOpen: false });
            });
        });

        describe("after unmount", () => {
            it("keeps scrolling disabled if some overlay with hasBackdrop=true exists", done => {
                const otherOverlayWithBackdrop = mount(renderBackdropOverlay(true));
                wrapper = mountWrapper(renderBackdropOverlay(true));
                otherOverlayWithBackdrop.unmount();

                assertBodyScrollingDisabled(true, done);
            });

            it("doesn't keep scrolling disabled if no overlay exists with hasBackdrop=true", done => {
                const otherOverlayWithBackdrop = mount(renderBackdropOverlay(true));
                wrapper = mountWrapper(renderBackdropOverlay(false));
                otherOverlayWithBackdrop.unmount();

                assertBodyScrollingDisabled(false, done);
            });
        });

        function renderBackdropOverlay(hasBackdrop?: boolean, usePortal?: boolean) {
            return (
                <Overlay2 hasBackdrop={hasBackdrop} isOpen={true} usePortal={usePortal}>
                    <div>Some overlay content</div>
                </Overlay2>
            );
        }

        function assertBodyScrollingDisabled(disabled: boolean, done: Mocha.Done) {
            // wait for the DOM to settle before checking body classes
            setTimeout(() => {
                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                assert.equal(
                    hasClass,
                    disabled,
                    `expected <body> element to ${disabled ? "have" : "not have"} ${Classes.OVERLAY_OPEN} class`,
                );
                done();
            });
        }
    });

    it("lifecycle methods called as expected", done => {
        // these lifecycles are passed directly to CSSTransition from react-transition-group
        // so we do not need to test these extensively. one integration test should do.
        const onClosed = spy();
        const onClosing = spy();
        const onOpened = spy();
        const onOpening = spy();
        wrapper = mountWrapper(
            <Overlay2
                {...{ onClosed, onClosing, onOpened, onOpening }}
                isOpen={true}
                usePortal={false}
                // transition duration shorter than timeout below to ensure it's done
                transitionDuration={8}
            >
                {createOverlayContents()}
            </Overlay2>,
        );
        assert.isTrue(onOpening.calledOnce, "onOpening");
        assert.isFalse(onOpened.calledOnce, "onOpened not called yet");

        setTimeout(() => {
            // on*ed called after transition completes
            assert.isTrue(onOpened.calledOnce, "onOpened");

            wrapper.setProps({ isOpen: false });
            // on*ing called immediately when prop changes
            assert.isTrue(onClosing.calledOnce, "onClosing");
            assert.isFalse(onClosed.calledOnce, "onClosed not called yet");

            setTimeout(() => {
                assert.isTrue(onClosed.calledOnce, "onOpened");
                done();
            }, 10);
        }, 10);
    });

    let index = 0;
    function createOverlayContents() {
        return (
            <strong id={`overlay-${index++}`} tabIndex={0}>
                Overlay2 content!
            </strong>
        );
    }
});
