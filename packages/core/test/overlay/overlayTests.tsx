/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { dispatchMouseEvent } from "@blueprintjs/test-commons";

import * as Keys from "../../src/common/keys";
import { Classes, IOverlayProps, Overlay, Portal, Utils } from "../../src/index";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

describe("<Overlay>", () => {
    /**
     * Assign mounted wrappers to this variable to automatically clean them up after the test.
     *
     * **Always assign the result of `mount(<Overlay>)` to avoid leaving dangling Overlays,** which
     * can interfere with other tests through the Overlay stack.
     *
     * Shallow renders do not need to be cleaned up in the same way.
     */
    let wrapper: ReactWrapper<IOverlayProps, any>;

    afterEach(() => {
        if (wrapper != null) {
            wrapper.unmount();
            wrapper = null;
        }
    });

    it("renders its content correctly", () => {
        const overlay = shallow(
            <Overlay isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("h1"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 1);
    });

    it("renders Portal after first opened", () => {
        wrapper = mount(<Overlay isOpen={false}>{createOverlayContents()}</Overlay>);
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
            ),
        );
    });

    it("hasBackdrop=false does not render backdrop", () => {
        const overlay = shallow(
            <Overlay hasBackdrop={false} isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("h1"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 0);
    });

    it("invokes didOpen when Overlay is opened", () => {
        const didOpen = spy();
        wrapper = mount(
            <Overlay didOpen={didOpen} isOpen={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.isTrue(didOpen.notCalled, "didOpen invoked when overlay closed");

        wrapper.setProps({ isOpen: true });
        assert.isTrue(didOpen.calledOnce, "didOpen not invoked when overlay open");
    });

    it("invokes didOpen when inline Overlay is opened", () => {
        const didOpen = spy();
        wrapper = mount(
            <Overlay didOpen={didOpen} isOpen={false} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.isTrue(didOpen.notCalled, "didOpen invoked when overlay closed");

        wrapper.setProps({ isOpen: true });
        assert.isTrue(didOpen.calledOnce, "didOpen not invoked when overlay open");
    });

    describe("onClose", () => {
        it("invoked on backdrop mousedown when canOutsideClickClose=true", () => {
            const onClose = spy();
            shallow(
                <Overlay canOutsideClickClose={true} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            )
                .find(BACKDROP_SELECTOR)
                .simulate("mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on backdrop mousedown when canOutsideClickClose=false", () => {
            const onClose = spy();
            shallow(
                <Overlay canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            )
                .find(BACKDROP_SELECTOR)
                .simulate("mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on document mousedown when hasBackdrop=false", () => {
            const onClose = spy();
            // mounting cuz we need document events + lifecycle
            wrapper = mount(
                <Overlay hasBackdrop={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = spy();
            wrapper = mount(
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
            wrapper = mount(
                <Overlay isOpen={true} onClose={onClose}>
                    <div>
                        {createOverlayContents()}
                        <Overlay isOpen={true}>
                            <div id="inner-element">{createOverlayContents()}</div>
                        </Overlay>
                    </div>
                </Overlay>,
            );
            wrapper.find("#inner-element").simulate("mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on escape key", () => {
            const onClose = spy();
            wrapper = mount(
                <Overlay isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            wrapper.simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = spy();
            shallow(
                <Overlay canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            ).simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.notCalled);
        });

        it("renders Portal attached to body when usePortal=true", () => {
            const portal = shallow(
                <Overlay isOpen={true} usePortal={true}>
                    {createOverlayContents()}
                </Overlay>,
            ).find(Portal);
            assert.lengthOf(portal, 1, "missing Portal");
            assert.lengthOf(portal.find("h1"), 1, "missing h1");
        });
    });

    describe("Focus management", () => {
        const testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);

        it("brings focus to overlay if autoFocus=true", done => {
            wrapper = mount(
                <Overlay autoFocus={true} isOpen={true} usePortal={true}>
                    <input type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            assertFocus(".pt-overlay-backdrop", done);
        });

        it("does not bring focus to overlay if autoFocus=false", done => {
            wrapper = mount(
                <div>
                    <button>something outside overlay for browser to focus on</button>
                    <Overlay autoFocus={false} isOpen={true} usePortal={true}>
                        <input type="text" />
                    </Overlay>
                </div>,
                { attachTo: testsContainerElement },
            );
            assertFocus("body", done);
        });

        // React implements autoFocus itself so our `[autofocus]` logic never fires.
        // Still, worth testing we can control where the focus goes.
        it("autoFocus element inside overlay gets the focus", done => {
            wrapper = mount(
                <Overlay isOpen={true} usePortal={true}>
                    <input autoFocus={true} type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            assertFocus("input", done);
        });

        it("returns focus to overlay if enforceFocus=true", done => {
            let buttonRef: HTMLElement;
            let inputRef: HTMLElement;
            wrapper = mount(
                <div>
                    <button ref={ref => (buttonRef = ref)} />
                    <Overlay enforceFocus={true} isOpen={true} usePortal={true}>
                        <input autoFocus={true} ref={ref => (inputRef = ref)} />
                    </Overlay>
                </div>,
                { attachTo: testsContainerElement },
            );
            assert.strictEqual(document.activeElement, inputRef);
            buttonRef.focus();
            assertFocus(() => {
                assert.notStrictEqual(document.activeElement, buttonRef);
                assert.isTrue(document.activeElement.classList.contains(Classes.OVERLAY_BACKDROP), "focus on backdrop");
            }, done);
        });

        it("returns focus to overlay after clicking the backdrop if enforceFocus=true", done => {
            wrapper = mount(
                <Overlay enforceFocus={true} canOutsideClickClose={false} isOpen={true} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            wrapper.find(BACKDROP_SELECTOR).simulate("mousedown");
            assertFocus(`.${Classes.OVERLAY_CONTENT}`, done);
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

            wrapper = mount(
                <Overlay enforceFocus={true} isOpen={false} usePortal={false}>
                    <input id="inputId" type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
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

            wrapper = mount(
                <div>
                    <button ref={ref => (buttonRef = ref)} />
                    <Overlay enforceFocus={false} isOpen={true} usePortal={true}>
                        <input ref={ref => ref && setTimeout(focusBtnAndAssert)} />
                    </Overlay>
                </div>,
                { attachTo: testsContainerElement },
            );
        });

        it("doesn't focus overlay if focus is already inside overlay", done => {
            let textarea: HTMLTextAreaElement;
            wrapper = mount(
                <Overlay isOpen={true} usePortal={true}>
                    <textarea ref={ref => (textarea = ref)} />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            textarea.focus();
            assertFocus("textarea", done);
        });

        it("does not focus overlay when closed", done => {
            wrapper = mount(
                <div>
                    <button ref={ref => ref && ref.focus()} />
                    <Overlay isOpen={false} usePortal={true} />
                </div>,
                { attachTo: testsContainerElement },
            );
            assertFocus("button", done);
        });

        function assertFocus(selector: string | (() => void), done: MochaDone) {
            // the behavior being tested relies on requestAnimationFrame.
            // to avoid flakiness, use nested setTimeouts to delay execution until the *next* frame.
            setTimeout(() => {
                setTimeout(() => {
                    wrapper.update();
                    if (Utils.isFunction(selector)) {
                        selector();
                    } else {
                        assert.strictEqual(document.querySelector(selector), document.activeElement);
                    }
                    done();
                }, 1);
            }, 1);
        }
    });

    describe("Background scrolling", () => {
        beforeEach(() => {
            // force-reset Overlay stack state between tests
            (Overlay as any).openStack = [];
            document.body.classList.remove(Classes.OVERLAY_OPEN);
        });

        it("disables document scrolling by default", done => {
            wrapper = mountOverlay(undefined, undefined);
            assertBodyScrollingDisabled(true, done);
        });

        it("disables document scrolling if usePortal=true and hasBackdrop=true", done => {
            wrapper = mountOverlay(true, true);
            assertBodyScrollingDisabled(true, done);
        });

        it("does not disable document scrolling if usePortal=true and hasBackdrop=false", done => {
            wrapper = mountOverlay(true, false);
            assertBodyScrollingDisabled(false, done);
        });

        it("does not disable document scrolling if usePortal=false and hasBackdrop=true", done => {
            wrapper = mountOverlay(false, true);
            assertBodyScrollingDisabled(false, done);
        });

        it("does not disable document scrolling if usePortal=false and hasBackdrop=false", done => {
            wrapper = mountOverlay(false, false);
            assertBodyScrollingDisabled(false, done);
        });

        it("keeps scrolling disabled if hasBackdrop=true overlay exists following unmount", done => {
            const backdropOverlay = mountOverlay(true, true);
            wrapper = mountOverlay(true, true);
            backdropOverlay.unmount();

            assertBodyScrollingDisabled(true, done);
        });

        it("doesn't keep scrolling disabled if no hasBackdrop=true overlay exists following unmount", done => {
            const backdropOverlay = mountOverlay(true, true);
            wrapper = mountOverlay(true, false);
            backdropOverlay.unmount();

            assertBodyScrollingDisabled(false, done);
        });

        function mountOverlay(usePortal: boolean, hasBackdrop: boolean) {
            return mount(
                <Overlay hasBackdrop={hasBackdrop} isOpen={true} usePortal={usePortal}>
                    <div>Some overlay content</div>
                </Overlay>,
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

    let index = 0;
    function createOverlayContents() {
        return <h1 id={`overlay-${index++}`}>Overlay content!</h1>;
    }
});
