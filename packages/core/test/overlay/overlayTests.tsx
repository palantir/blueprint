/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { dispatchMouseEvent } from "@blueprintjs/test-commons";
import * as Keys from "../../src/common/keys";
import { Classes, IOverlayProps, Overlay, Portal, Utils } from "../../src/index";
import { findInPortal } from "../utils";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

/*
IMPORTANT NOTE: It is critical that every <Overlay> wrapper be unmounted after the test, to avoid
polluting the DOM with leftover overlay elements. This was the cause of the Overlay test flakes of
late 2017/early 2018 and was resolved by ensuring that every wrapper is unmounted.

The `wrapper` variable below and the `mountWrapper` method should be used for full enzyme mounts.
For shallow mounts, be sure to call `shallowWrapper.unmount()` after the assertions.
*/
describe("<Overlay>", () => {
    let wrapper: ReactWrapper<IOverlayProps, any>;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    /**
     * Mount the `content` into `testsContainerElement` and assign to local `wrapper` variable.
     * Use this method in this suite instead of Enzyme's `mount` method.
     */
    function mountWrapper(content: JSX.Element) {
        wrapper = mount(content, { attachTo: testsContainerElement });
        return wrapper;
    }

    afterEach(() => {
        // clean up wrapper after each test, if it was used
        if (wrapper != null) {
            wrapper.unmount();
            wrapper.detach();
            wrapper = null;
        }
    });

    it("renders its content correctly", () => {
        const overlay = shallow(
            <Overlay isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("strong"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 1);
        overlay.unmount();
    });

    it("renders contents to specified container correctly", () => {
        const CLASS_TO_TEST = "bp-test-content";
        const container = document.createElement("div");
        document.body.appendChild(container);
        mountWrapper(
            <Overlay isOpen={true} portalContainer={container}>
                <p className={CLASS_TO_TEST}>test</p>
            </Overlay>,
        );
        assert.lengthOf(container.getElementsByClassName(CLASS_TO_TEST), 1);
        document.body.removeChild(container);
    });

    it("portalClassName appears on Portal", () => {
        const CLASS_TO_TEST = "bp-test-content";
        mountWrapper(
            <Overlay isOpen={true} portalClassName={CLASS_TO_TEST}>
                <p>test</p>
            </Overlay>,
        );
        // search document for portal container element.
        assert.isDefined(document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`));
    });

    it("renders Portal after first opened", () => {
        mountWrapper(<Overlay isOpen={false}>{createOverlayContents()}</Overlay>);
        assert.lengthOf(wrapper.find(Portal), 0, "unexpected Portal");
        wrapper.setProps({ isOpen: true });
        assert.lengthOf(wrapper.find(Portal), 1, "expected Portal");
    });

    it("supports non-element children", () => {
        assert.doesNotThrow(() =>
            shallow(
                <Overlay isOpen={true} usePortal={false}>
                    {null} {undefined}
                </Overlay>,
            ).unmount(),
        );
    });

    it("hasBackdrop=false does not render backdrop", () => {
        const overlay = shallow(
            <Overlay hasBackdrop={false} isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("strong"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 0);
        overlay.unmount();
    });

    it("renders portal attached to body when not inline after first opened", () => {
        mountWrapper(<Overlay isOpen={false}>{createOverlayContents()}</Overlay>);
        assert.lengthOf(wrapper.find(Portal), 0, "unexpected Portal");
        wrapper.setProps({ isOpen: true });
        assert.lengthOf(wrapper.find(Portal), 1, "expected Portal");
    });

    describe("onClose", () => {
        it("invoked on backdrop mousedown when canOutsideClickClose=true", () => {
            const onClose = spy();
            const overlay = shallow(
                <Overlay canOutsideClickClose={true} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            overlay.find(BACKDROP_SELECTOR).simulate("mousedown");
            assert.isTrue(onClose.calledOnce);
            overlay.unmount();
        });

        it("not invoked on backdrop mousedown when canOutsideClickClose=false", () => {
            const onClose = spy();
            const overlay = shallow(
                <Overlay canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            overlay.find(BACKDROP_SELECTOR).simulate("mousedown");
            assert.isTrue(onClose.notCalled);
            overlay.unmount();
        });

        it("invoked on document mousedown when hasBackdrop=false", () => {
            const onClose = spy();
            // mounting cuz we need document events + lifecycle
            mountWrapper(
                <Overlay hasBackdrop={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay
                    canOutsideClickClose={false}
                    hasBackdrop={false}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                >
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("not invoked on click of a nested overlay", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay isOpen={true} onClose={onClose}>
                    <div id="outer-element">
                        {createOverlayContents()}
                        <Overlay isOpen={true}>
                            <div id="inner-element">{createOverlayContents()}</div>
                        </Overlay>
                    </div>
                </Overlay>,
            );
            // this hackery is necessary for React 15 support, where Portals break trees.
            findInPortal(findInPortal(wrapper, "#outer-element"), "#inner-element").simulate("mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on escape key", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            wrapper.simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = spy();
            const overlay = shallow(
                <Overlay canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            overlay.simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.notCalled);
            overlay.unmount();
        });

        it("renders portal attached to body when not inline", () => {
            const overlay = shallow(
                <Overlay isOpen={true} usePortal={true}>
                    {createOverlayContents()}
                </Overlay>,
            );
            const portal = overlay.find(Portal);
            assert.isTrue(portal.exists(), "missing Portal");
            assert.lengthOf(portal.find("strong"), 1, "missing h1");
            overlay.unmount();
        });
    });

    describe("Focus management", () => {
        it("brings focus to overlay if autoFocus=true", done => {
            mountWrapper(
                <Overlay autoFocus={true} isOpen={true} usePortal={true}>
                    <input type="text" />
                </Overlay>,
            );
            assertFocus(() => {
                const backdrops = Array.from(document.querySelectorAll("." + Classes.OVERLAY_BACKDROP));
                assert.include(backdrops, document.activeElement);
            }, done);
        });

        it("does not bring focus to overlay if autoFocus=false", done => {
            mountWrapper(
                <div>
                    <button>something outside overlay for browser to focus on</button>
                    <Overlay autoFocus={false} isOpen={true} usePortal={true}>
                        <input type="text" />
                    </Overlay>
                </div>,
            );
            assertFocus("body", done);
        });

        // React implements autoFocus itself so our `[autofocus]` logic never fires.
        // Still, worth testing we can control where the focus goes.
        it("autoFocus element inside overlay gets the focus", done => {
            mountWrapper(
                <Overlay isOpen={true} usePortal={true}>
                    <input autoFocus={true} type="text" />
                </Overlay>,
            );
            assertFocus("input", done);
        });

        it("returns focus to overlay if enforceFocus=true", done => {
            let buttonRef: HTMLElement;
            let inputRef: HTMLElement;
            mountWrapper(
                <div>
                    <button ref={ref => (buttonRef = ref)} />
                    <Overlay enforceFocus={true} isOpen={true} usePortal={true}>
                        <input autoFocus={true} ref={ref => (inputRef = ref)} />
                    </Overlay>
                </div>,
            );
            assert.strictEqual(document.activeElement, inputRef);
            buttonRef.focus();
            assertFocus(() => {
                assert.notStrictEqual(document.activeElement, buttonRef);
                assert.isTrue(document.activeElement.classList.contains(Classes.OVERLAY_BACKDROP), "focus on backdrop");
            }, done);
        });

        it("returns focus to overlay after clicking the backdrop if enforceFocus=true", done => {
            mountWrapper(
                <Overlay enforceFocus={true} canOutsideClickClose={false} isOpen={true} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            wrapper.find(BACKDROP_SELECTOR).simulate("mousedown");
            assertFocus(`strong.${Classes.OVERLAY_CONTENT}`, done);
        });

        it("does not result in maximum call stack if two overlays open with enforceFocus=true", () => {
            const anotherContainer = document.createElement("div");
            document.documentElement.appendChild(anotherContainer);
            const temporaryWrapper = mount(
                <Overlay enforceFocus={true} isOpen={true} usePortal={false}>
                    <input type="text" />
                </Overlay>,
                { attachTo: anotherContainer },
            );

            mountWrapper(
                <Overlay enforceFocus={true} isOpen={false} usePortal={false}>
                    <input id="inputId" type="text" />
                </Overlay>,
            );
            // ES6 class property vs prototype, see: https://github.com/airbnb/enzyme/issues/365
            const bringFocusSpy = spy(wrapper.instance() as Overlay, "bringFocusInsideOverlay");
            wrapper.setProps({ isOpen: true });

            // triggers the infinite recursion
            wrapper.find("#inputId").simulate("click");
            assert.isTrue(bringFocusSpy.calledOnce);

            // don't need spy.restore() since the wrapper will be destroyed after test anyways
            temporaryWrapper.unmount();
            document.documentElement.removeChild(anotherContainer);
        });

        it("does not return focus to overlay if enforceFocus=false", done => {
            let buttonRef: HTMLElement;
            const focusBtnAndAssert = () => {
                buttonRef.focus();
                assert.strictEqual(buttonRef, document.activeElement);
                done();
            };

            mountWrapper(
                <div>
                    <button ref={ref => (buttonRef = ref)} />
                    <Overlay enforceFocus={false} isOpen={true} usePortal={true}>
                        <input ref={ref => ref && setTimeout(focusBtnAndAssert)} />
                    </Overlay>
                </div>,
            );
        });

        it("doesn't focus overlay if focus is already inside overlay", done => {
            let textarea: HTMLTextAreaElement;
            mountWrapper(
                <Overlay isOpen={true} usePortal={true}>
                    <textarea ref={ref => (textarea = ref)} />
                </Overlay>,
            );
            textarea.focus();
            assertFocus("textarea", done);
        });

        it("does not focus overlay when closed", done => {
            mountWrapper(
                <div>
                    <button ref={ref => ref && ref.focus()} />
                    <Overlay isOpen={false} usePortal={true} />
                </div>,
            );
            assertFocus("button", done);
        });

        function assertFocus(selector: string | (() => void), done: MochaDone) {
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
    });

    describe("Background scrolling", () => {
        beforeEach(() => {
            // force-reset Overlay stack state between tests
            (Overlay as any).openStack = [];
            document.body.classList.remove(Classes.OVERLAY_OPEN);
        });

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

        it("keeps scrolling disabled if hasBackdrop=true overlay exists following unmount", done => {
            const backdropOverlay = mount(renderBackdropOverlay(true));
            wrapper = mountWrapper(renderBackdropOverlay(true));
            backdropOverlay.unmount();

            assertBodyScrollingDisabled(true, done);
        });

        it("doesn't keep scrolling disabled if no hasBackdrop=true overlay exists following unmount", done => {
            const backdropOverlay = mount(renderBackdropOverlay(true));
            wrapper = mountWrapper(renderBackdropOverlay(false));
            backdropOverlay.unmount();

            assertBodyScrollingDisabled(false, done);
        });

        function renderBackdropOverlay(hasBackdrop?: boolean, usePortal?: boolean) {
            return (
                <Overlay hasBackdrop={hasBackdrop} isOpen={true} usePortal={usePortal}>
                    <div>Some overlay content</div>
                </Overlay>
            );
        }

        function assertBodyScrollingDisabled(disabled: boolean, done: MochaDone) {
            // wait for the DOM to settle before checking body classes
            setTimeout(() => {
                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                assert.equal(hasClass, disabled);
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
            <Overlay
                {...{ onClosed, onClosing, onOpened, onOpening }}
                isOpen={true}
                usePortal={false}
                // transition duration shorter than timeout below to ensure it's done
                transitionDuration={8}
            >
                {createOverlayContents()}
            </Overlay>,
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
        return <strong id={`overlay-${index++}`}>Overlay content!</strong>;
    }
});
