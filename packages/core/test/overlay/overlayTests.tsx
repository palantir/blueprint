/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";

import * as Keys from "../../src/common/keys";
import { Classes, IOverlayProps, Overlay, Portal } from "../../src/index";
import { dispatchMouseEvent } from "../common/utils";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

describe("<Overlay>", () => {
    let wrapper: ReactWrapper<IOverlayProps, any>;

    afterEach(() => {
        if (wrapper != null) {
            wrapper.unmount();
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
    });

    it("hasBackdrop=false does not render backdrop", () => {
        const overlay = shallow(
            <Overlay hasBackdrop={false} inline={true} isOpen={true}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(overlay.find("h1"), 1);
        assert.lengthOf(overlay.find(BACKDROP_SELECTOR), 0);
    });

    it("invokes didOpen when Overlay is opened", () => {
        const didOpen = sinon.spy();
        wrapper = mount(
            <Overlay didOpen={didOpen} isOpen={false}>{createOverlayContents()}</Overlay>,
        );
        assert.isTrue(didOpen.notCalled, "didOpen invoked when overlay closed");

        wrapper.setProps({ isOpen: true });
        assert.isTrue(didOpen.calledOnce, "didOpen not invoked when overlay open");
    });

    it("invokes didOpen when inline Overlay is opened", () => {
        const didOpen = sinon.spy();
        wrapper = mount(
            <Overlay didOpen={didOpen} inline={true} isOpen={false}>{createOverlayContents()}</Overlay>,
        );
        assert.isTrue(didOpen.notCalled, "didOpen invoked when overlay closed");

        wrapper.setProps({ isOpen: true });
        assert.isTrue(didOpen.calledOnce, "didOpen not invoked when overlay open");
    });

    it("renders portal attached to body when not inline after first opened", () => {
        wrapper = mount(
            <Overlay isOpen={false}>{createOverlayContents()}</Overlay>,
        );
        assert.lengthOf(wrapper.find(Portal), 0, "unexpected Portal");
        wrapper.setProps({ isOpen: true });
        assert.lengthOf(wrapper.find(Portal), 1, "expected Portal");
    });

    describe("onClose", () => {
        it("invoked on backdrop mousedown when canOutsideClickClose=true", () => {
            const onClose = sinon.spy();
            shallow(
                <Overlay canOutsideClickClose={true} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            ).find(BACKDROP_SELECTOR).simulate("mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on backdrop mousedown when canOutsideClickClose=false", () => {
            const onClose = sinon.spy();
            shallow(
                <Overlay canOutsideClickClose={false} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            ).find(BACKDROP_SELECTOR).simulate("mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on document mousedown when hasBackdrop=false", () => {
            const onClose = sinon.spy();
            // mounting cuz we need document events + lifecycle
            mount(
                <Overlay hasBackdrop={false} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = sinon.spy();
            mount(
                <Overlay canOutsideClickClose={false} hasBackdrop={false} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            assert.isTrue(onClose.notCalled);
        });

        it("invoked on escape key", () => {
            const onClose = sinon.spy();
            mount(
                <Overlay inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            ).simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.calledOnce);
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = sinon.spy();
            shallow(
                <Overlay canEscapeKeyClose={false} inline={true} isOpen={true} onClose={onClose}>
                    {createOverlayContents()}
                </Overlay>,
            ).simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(onClose.notCalled);
        });

        it("renders portal attached to body when not inline", () => {
            const portal = shallow(
                <Overlay inline={false} isOpen={true}>
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

        it("brings focus to overlay if autoFocus=true", () => {
            wrapper = mount(
                <Overlay autoFocus={true} inline={false} isOpen={true}>
                    <input type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            assert.equal(document.body.querySelector(".pt-overlay-backdrop"), document.activeElement);
        });

        it("does not bring focus to overlay if autoFocus=false", () => {
            wrapper = mount(
                <Overlay autoFocus={false} inline={false} isOpen={true}>
                    <input type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            assert.equal(document.body, document.activeElement);
        });

        it("autoFocus element inside overlay gets the focus", () => {
            wrapper = mount(
                <Overlay inline={false} isOpen={true}>
                    <input autoFocus={true} type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            assert.equal(document.querySelector("input"), document.activeElement);
        });

        /* tslint:disable:jsx-no-lambda */
        it("returns focus to overlay if enforceFocus=true", (done) => {
            let buttonRef: HTMLElement;
            const focusBtnAndAssert = () => {
                buttonRef.focus();
                setTimeout(() => {
                    assert.notStrictEqual(buttonRef, document.activeElement);
                    done();
                });
            };

            wrapper = mount(
                <div>
                    <button ref={(ref) => buttonRef = ref}/>
                    <Overlay enforceFocus={true} inline={false} isOpen={true}>
                        <input ref={(ref) => ref && focusBtnAndAssert()}/>
                    </Overlay>
                </div>,
                { attachTo: testsContainerElement },
            );
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

            wrapper = mount(
                <Overlay enforceFocus={true} inline={true} isOpen={false}>
                    <input id="inputId" type="text" />
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            // ES6 class property vs prototype, see: https://github.com/airbnb/enzyme/issues/365
            const spy = sinon.spy(wrapper.instance(), "bringFocusInsideOverlay");
            wrapper.setProps({ isOpen: true });

            // triggers the infinite recursion
            wrapper.find("#inputId").simulate("click");
            assert.isTrue(spy.calledOnce);

            // don't need spy.restore() since the wrapper will be destroyed after test anyways
            temporaryWrapper.unmount();
            document.documentElement.removeChild(anotherContainer);
        });

        it("does not return focus to overlay if enforceFocus=false", (done) => {
            let buttonRef: HTMLElement;
            const focusBtnAndAssert = () => {
                buttonRef.focus();
                assert.strictEqual(buttonRef, document.activeElement);
                done();
            };

            wrapper = mount(
                <div>
                    <button ref={(ref) => buttonRef = ref}/>
                    <Overlay enforceFocus={false} inline={false} isOpen={true}>
                        <input ref={(ref) => ref && setTimeout(focusBtnAndAssert)}/>
                    </Overlay>
                </div>,
                { attachTo: testsContainerElement },
            );
        });

        it("doesn't focus overlay if focus is already inside overlay", () => {
            wrapper = mount(
                <Overlay inline={false} isOpen={true}>
                    <textarea ref={(ref) => ref && ref.focus()}/>
                </Overlay>,
                { attachTo: testsContainerElement },
            );
            assert.equal(document.querySelector("textarea"), document.activeElement);
        });

        it("does not focus overlay when closed", () => {
            wrapper = mount(
                <div>
                    <button ref={(ref) => ref && ref.focus()}/>
                    <Overlay inline={false} isOpen={false} />
                </div>,
                { attachTo: testsContainerElement },
            );
            assert.equal(document.querySelector("button"), document.activeElement);
        });
        /* tslint:enable:jsx-no-lambda */
    });

    describe("Background scrolling", () => {
        beforeEach(() => {
            // force-reset Overlay stack state between tests
            (Overlay as any).openStack = [];
            document.body.classList.remove(Classes.OVERLAY_OPEN);
        });

        it("disables document scrolling by default", (done) => {
            wrapper = mountOverlay(undefined, undefined);
            assertBodyScrollingDisabled(true, done);
        });

        it("disables document scrolling if inline=false and hasBackdrop=true", (done) => {
            wrapper = mountOverlay(false, true);
            assertBodyScrollingDisabled(true, done);
        });

        it("does not disable document scrolling if inline=false and hasBackdrop=false", (done) => {
            wrapper = mountOverlay(false, false);
            assertBodyScrollingDisabled(false, done);
        });

        it("does not disable document scrolling if inline=true and hasBackdrop=true", (done) => {
            wrapper = mountOverlay(true, true);
            assertBodyScrollingDisabled(false, done);
        });

        it("does not disable document scrolling if inline=true and hasBackdrop=false", (done) => {
            wrapper = mountOverlay(true, false);
            assertBodyScrollingDisabled(false, done);
        });

        function mountOverlay(inline: boolean, hasBackdrop: boolean) {
            return mount(
                <Overlay hasBackdrop={hasBackdrop} inline={inline} isOpen={true}>
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
