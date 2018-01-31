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
            <Overlay inline={true} isOpen={true}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("h1"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 1);
        overlay.unmount();
    });

    it("supports non-element children", () => {
        assert.doesNotThrow(() =>
            shallow(
                <Overlay inline={true} isOpen={true}>
                    {null} {undefined}
                </Overlay>,
            ).unmount(),
        );
    });

    it("hasBackdrop=false does not render backdrop", () => {
        const overlay = shallow(
            <Overlay hasBackdrop={false} inline={true} isOpen={true}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("h1"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 0);
        overlay.unmount();
    });

    it("invokes didOpen when Overlay is opened", () => {
        const didOpen = spy();
        mountWrapper(
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
        mountWrapper(
            <Overlay didOpen={didOpen} inline={true} isOpen={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.isTrue(didOpen.notCalled, "didOpen invoked when overlay closed");

        wrapper.setProps({ isOpen: true });
        assert.isTrue(didOpen.calledOnce, "didOpen not invoked when overlay open");
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
                <Overlay canOutsideClickClose={true} inline={true} isOpen={true} onClose={onClose}>
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
                <Overlay canOutsideClickClose={false} inline={true} isOpen={true} onClose={onClose}>
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
                <Overlay hasBackdrop={false} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = spy();
            mountWrapper(
                <Overlay canOutsideClickClose={false} hasBackdrop={false} inline={true} isOpen={true} onClose={onClose}>
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
            mountWrapper(
                <Overlay inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            );
            wrapper.simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = spy();
            const overlay = shallow(
                <Overlay canEscapeKeyClose={false} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            );
            overlay.simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.notCalled);
            overlay.unmount();
        });

        it("renders portal attached to body when not inline", () => {
            const overlay = shallow(
                <Overlay inline={false} isOpen={true}>
                    {createOverlayContents()}
                </Overlay>,
            );
            const portal = overlay.find(Portal);
            assert.isTrue(portal.exists(), "missing Portal");
            assert.lengthOf(portal.find("h1"), 1, "missing h1");
            overlay.unmount();
        });
    });

    describe("Focus management", () => {
        it("brings focus to overlay if autoFocus=true", done => {
            mountWrapper(
                <Overlay autoFocus={true} inline={false} isOpen={true}>
                    <input type="text" />
                </Overlay>,
            );
            assertFocus(() => {
                const backdrops = Array.from(document.querySelectorAll(".pt-overlay-backdrop"));
                assert.include(backdrops, document.activeElement);
            }, done);
        });

        it("does not bring focus to overlay if autoFocus=false", done => {
            mountWrapper(
                <div>
                    <button>something outside overlay for browser to focus on</button>
                    <Overlay autoFocus={false} inline={false} isOpen={true}>
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
                <Overlay inline={false} isOpen={true}>
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
                    <Overlay enforceFocus={true} inline={false} isOpen={true}>
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
                <Overlay enforceFocus={true} canOutsideClickClose={false} inline={true} isOpen={true}>
                    {createOverlayContents()}
                </Overlay>,
            );
            wrapper.find(BACKDROP_SELECTOR).simulate("mousedown");
            assertFocus(`h1.${Classes.OVERLAY_CONTENT}`, done);
        });

        it("does not result in maximum call stack if two overlays open with enforceFocus=true", () => {
            const anotherContainer = document.createElement("div");
            document.documentElement.appendChild(anotherContainer);
            const temporaryWrapper = mount(
                <Overlay enforceFocus={true} inline={true} isOpen={true}>
                    <input type="text" />
                </Overlay>,
                { attachTo: anotherContainer },
            );

            mountWrapper(
                <Overlay enforceFocus={true} inline={true} isOpen={false}>
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
                    <Overlay enforceFocus={false} inline={false} isOpen={true}>
                        <input ref={ref => ref && setTimeout(focusBtnAndAssert)} />
                    </Overlay>
                </div>,
            );
        });

        it("doesn't focus overlay if focus is already inside overlay", done => {
            let textarea: HTMLTextAreaElement;
            mountWrapper(
                <Overlay inline={false} isOpen={true}>
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
                    <Overlay inline={false} isOpen={false} />
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
            wrapper = mountWrapper(renderSimpleOverlay(undefined, undefined));
            assertBodyScrollingDisabled(true, done);
        });

        it("disables document scrolling if inline=false and hasBackdrop=true", done => {
            wrapper = mountWrapper(renderSimpleOverlay(false, true));
            assertBodyScrollingDisabled(true, done);
        });

        it("does not disable document scrolling if inline=false and hasBackdrop=false", done => {
            wrapper = mountWrapper(renderSimpleOverlay(false, false));
            assertBodyScrollingDisabled(false, done);
        });

        it("does not disable document scrolling if inline=true and hasBackdrop=true", done => {
            wrapper = mountWrapper(renderSimpleOverlay(true, true));
            assertBodyScrollingDisabled(false, done);
        });

        it("does not disable document scrolling if inline=true and hasBackdrop=false", done => {
            wrapper = mountWrapper(renderSimpleOverlay(true, false));
            assertBodyScrollingDisabled(false, done);
        });

        it("keeps scrolling disabled if hasBackdrop=true overlay exists following unmount", done => {
            const backdropOverlay = mount(renderSimpleOverlay(false, true));
            wrapper = mountWrapper(renderSimpleOverlay(false, true));
            backdropOverlay.unmount();

            assertBodyScrollingDisabled(true, done);
        });

        it("doesn't keep scrolling disabled if no hasBackdrop=true overlay exists following unmount", done => {
            const backdropOverlay = mount(renderSimpleOverlay(false, true));
            wrapper = mountWrapper(renderSimpleOverlay(false, false));
            backdropOverlay.unmount();

            assertBodyScrollingDisabled(false, done);
        });

        function renderSimpleOverlay(inline: boolean, hasBackdrop: boolean) {
            return (
                <Overlay hasBackdrop={hasBackdrop} inline={inline} isOpen={true}>
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

    let index = 0;
    function createOverlayContents() {
        return <h1 id={`overlay-${index++}`}>Overlay content!</h1>;
    }
});
