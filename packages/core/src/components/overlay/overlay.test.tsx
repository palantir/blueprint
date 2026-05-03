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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to Overlay2 instead.
 */

/* eslint-disable @typescript-eslint/no-deprecated */

import { fireEvent, render, type RenderResult, waitFor } from "@testing-library/react";
import { cloneElement, createRef } from "react";

import { afterAll, afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";
import { dispatchMouseEvent } from "@blueprintjs/test-commons/vitest-utils";

import { Classes, Utils } from "../../common";
import { sleep } from "../../common/test-utils";

import { Overlay } from "./overlay";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

/*
IMPORTANT NOTE: It is critical that every <Overlay> wrapper be unmounted after the test, to avoid
polluting the DOM with leftover overlay elements. This was the cause of the Overlay test flakes of
late 2017/early 2018 and was resolved by ensuring that every wrapper is unmounted.
*/
describe("<Overlay>", () => {
    const containerElement = document.createElement("div");
    document.documentElement.appendChild(containerElement);

    let result: RenderResult | undefined;
    let overlayInstance: Overlay | null = null;

    function renderOverlay(content: React.ReactElement) {
        const ref = createRef<Overlay>();
        const cloned = content.type === Overlay ? cloneElement(content, { ref } as any) : content;
        result = render(cloned, { container: containerElement });
        overlayInstance = ref.current;
        return result;
    }

    afterEach(() => {
        result?.unmount();
        result = undefined;
        overlayInstance = null;
        // Clean up any portals leaked between tests
        document.querySelectorAll(`.${Classes.PORTAL}`).forEach(el => el.remove());
        document.body.classList.remove(Classes.OVERLAY_OPEN);
    });

    afterAll(() => {
        document.documentElement.removeChild(containerElement);
    });

    function findInDocument(selector: string): HTMLElement | null {
        return document.querySelector<HTMLElement>(selector);
    }

    function findAllInDocument(selector: string): HTMLElement[] {
        return Array.from(document.querySelectorAll<HTMLElement>(selector));
    }

    it("renders its content correctly", () => {
        renderOverlay(
            <Overlay isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(findAllInDocument("strong"), 1);
        assert.lengthOf(findAllInDocument(BACKDROP_SELECTOR), 1);
    });

    it("renders contents to specified container correctly", () => {
        const CLASS_TO_TEST = "bp-test-content";
        const portalContainer = document.createElement("div");
        document.body.appendChild(portalContainer);
        renderOverlay(
            <Overlay isOpen={true} portalContainer={portalContainer}>
                <p className={CLASS_TO_TEST}>test</p>
            </Overlay>,
        );
        assert.lengthOf(portalContainer.getElementsByClassName(CLASS_TO_TEST), 1);
        document.body.removeChild(portalContainer);
    });

    it("sets aria-live", () => {
        renderOverlay(<Overlay className="aria-test" isOpen={true} usePortal={false} />);
        const overlayElement = document.querySelector(".aria-test");
        assert.exists(overlayElement);
        assert.equal(overlayElement?.getAttribute("aria-live"), "polite");
    });

    it("portalClassName appears on Portal", () => {
        const CLASS_TO_TEST = "bp-test-content";
        renderOverlay(
            <Overlay isOpen={true} portalClassName={CLASS_TO_TEST}>
                <p>test</p>
            </Overlay>,
        );
        assert.isDefined(document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`));
    });

    it("renders Portal after first opened", () => {
        const ref = createRef<Overlay>();
        const { rerender } = render(
            <Overlay ref={ref} isOpen={false}>
                {createOverlayContents()}
            </Overlay>,
            { container: containerElement },
        );
        result = { container: containerElement, rerender, unmount: () => undefined } as unknown as RenderResult;
        assert.isNull(document.querySelector(`.${Classes.PORTAL}`), "unexpected Portal");
        rerender(
            <Overlay ref={ref} isOpen={true}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.isNotNull(document.querySelector(`.${Classes.PORTAL}`), "expected Portal");
    });

    it("supports non-element children", () => {
        assert.doesNotThrow(() => {
            const local = render(
                <Overlay isOpen={true} usePortal={false}>
                    {null} {undefined}
                </Overlay>,
            );
            local.unmount();
        });
    });

    it("hasBackdrop=false does not render backdrop", () => {
        renderOverlay(
            <Overlay hasBackdrop={false} isOpen={true} usePortal={false}>
                {createOverlayContents()}
            </Overlay>,
        );
        assert.lengthOf(findAllInDocument("strong"), 1);
        assert.lengthOf(findAllInDocument(BACKDROP_SELECTOR), 0);
    });

    describe("onClose", () => {
        it("invoked on backdrop mousedown when canOutsideClickClose=true", () => {
            const onClose = vi.fn();
            renderOverlay(
                <Overlay canOutsideClickClose={true} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            fireEvent.mouseDown(findInDocument(BACKDROP_SELECTOR)!);
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("not invoked on backdrop mousedown when canOutsideClickClose=false", () => {
            const onClose = vi.fn();
            renderOverlay(
                <Overlay canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            fireEvent.mouseDown(findInDocument(BACKDROP_SELECTOR)!);
            expect(onClose).not.toHaveBeenCalled();
        });

        it("invoked on document mousedown when hasBackdrop=false", () => {
            const onClose = vi.fn();
            renderOverlay(
                <Overlay hasBackdrop={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );

            dispatchMouseEvent(document.documentElement, "mousedown");
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = vi.fn();
            renderOverlay(
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
            expect(onClose).not.toHaveBeenCalled();
        });

        it("not invoked on click of a nested overlay", () => {
            const onClose = vi.fn();
            renderOverlay(
                <Overlay isOpen={true} onClose={onClose}>
                    <div id="outer-element">
                        {createOverlayContents()}
                        <Overlay isOpen={true}>
                            <div id="inner-element">{createOverlayContents()}</div>
                        </Overlay>
                    </div>
                </Overlay>,
            );
            fireEvent.mouseDown(findInDocument("#inner-element")!);
            expect(onClose).not.toHaveBeenCalled();
        });

        it("invoked on escape key", () => {
            const onClose = vi.fn();
            renderOverlay(
                <Overlay isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            const overlayEl = findInDocument(`.${Classes.OVERLAY}`)!;
            fireEvent.keyDown(overlayEl, { key: "Escape" });
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = vi.fn();
            renderOverlay(
                <Overlay canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                    {createOverlayContents()}
                </Overlay>,
            );
            const overlayEl = findInDocument(`.${Classes.OVERLAY}`)!;
            fireEvent.keyDown(overlayEl, { key: "Escape" });
            expect(onClose).not.toHaveBeenCalled();
        });

        it("renders portal attached to body when not inline", () => {
            renderOverlay(
                <Overlay isOpen={true} usePortal={true}>
                    {createOverlayContents()}
                </Overlay>,
            );
            const portal = findInDocument(`.${Classes.PORTAL}`);
            assert.isNotNull(portal, "missing Portal");
            assert.lengthOf(portal!.querySelectorAll("strong"), 1, "missing h1");
        });
    });

    describe("Focus management", () => {
        const overlayClassName = "test-overlay";

        it("brings focus to overlay if autoFocus=true", async () => {
            renderOverlay(
                <Overlay className={overlayClassName} autoFocus={true} isOpen={true} usePortal={true}>
                    <input type="text" />
                </Overlay>,
            );
            await assertFocusIsInOverlay();
        });

        it("does not bring focus to overlay if autoFocus=false and enforceFocus=false", async () => {
            renderOverlay(
                (
                    <div>
                        <button>something outside overlay for browser to focus on</button>
                        <Overlay
                            className={overlayClassName}
                            autoFocus={false}
                            enforceFocus={false}
                            isOpen={true}
                            usePortal={true}
                        >
                            <input type="text" />
                        </Overlay>
                    </div>
                ) as unknown as React.ReactElement,
            );
            await assertFocus("body");
        });

        it("autoFocus element inside overlay gets the focus", async () => {
            renderOverlay(
                <Overlay className={overlayClassName} isOpen={true} usePortal={true}>
                    <input autoFocus={true} type="text" />
                </Overlay>,
            );
            await assertFocus("input");
        });

        it("returns focus to overlay if enforceFocus=true", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            const inputRef = createRef<HTMLInputElement>();
            renderOverlay(
                (
                    <div>
                        <button ref={buttonRef} />
                        <Overlay className={overlayClassName} enforceFocus={true} isOpen={true} usePortal={true}>
                            <input autoFocus={true} ref={inputRef} />
                        </Overlay>
                    </div>
                ) as unknown as React.ReactElement,
            );
            assert.strictEqual(document.activeElement, inputRef.current);
            buttonRef.current?.focus();
            await assertFocusIsInOverlay();
        });

        it("returns focus to overlay after clicking the backdrop if enforceFocus=true", async () => {
            renderOverlay(
                <Overlay
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                >
                    {createOverlayContents()}
                </Overlay>,
            );
            fireEvent.mouseDown(findInDocument(BACKDROP_SELECTOR)!);
            await assertFocusIsInOverlay();
        });

        it("returns focus to overlay after clicking an outside element if enforceFocus=true", async () => {
            renderOverlay(
                (
                    <div>
                        <Overlay
                            enforceFocus={true}
                            canOutsideClickClose={false}
                            className={overlayClassName}
                            isOpen={true}
                            usePortal={false}
                            hasBackdrop={false}
                        >
                            {createOverlayContents()}
                        </Overlay>
                        <button id="buttonId" />
                    </div>
                ) as unknown as React.ReactElement,
            );
            fireEvent.click(findInDocument("#buttonId")!);
            await assertFocusIsInOverlay();
        });

        it("does not result in maximum call stack if two overlays open with enforceFocus=true", () => {
            const anotherContainer = document.createElement("div");
            document.documentElement.appendChild(anotherContainer);
            const temporary = render(
                <Overlay className={overlayClassName} enforceFocus={true} isOpen={true} usePortal={false}>
                    <input type="text" />
                </Overlay>,
                { container: anotherContainer },
            );

            const ref = createRef<Overlay>();
            const { rerender } = render(
                <Overlay ref={ref} className={overlayClassName} enforceFocus={true} isOpen={false} usePortal={false}>
                    <input id="inputId" type="text" />
                </Overlay>,
                { container: containerElement },
            );
            const bringFocusSpy = vi.spyOn(ref.current as Overlay, "bringFocusInsideOverlay");
            rerender(
                <Overlay ref={ref} className={overlayClassName} enforceFocus={true} isOpen={true} usePortal={false}>
                    <input id="inputId" type="text" />
                </Overlay>,
            );

            fireEvent.click(findInDocument("#inputId")!);
            expect(bringFocusSpy).toHaveBeenCalledOnce();

            temporary.unmount();
            document.documentElement.removeChild(anotherContainer);
            // Manually unmount the secondary render — afterEach won't track it.
            const cleanup = result;
            cleanup?.unmount();
            result = undefined;
        });

        it("does not return focus to overlay if enforceFocus=false", () => {
            let buttonRef: HTMLElement | null;
            const focusBtnAndAssert = async () => {
                buttonRef?.focus();
                await waitFor(() => assert.strictEqual(buttonRef, document.activeElement));
            };

            renderOverlay(
                (
                    <div>
                        <button ref={ref => (buttonRef = ref)} />
                        <Overlay className={overlayClassName} enforceFocus={false} isOpen={true} usePortal={true}>
                            <input ref={ref => ref && focusBtnAndAssert()} />
                        </Overlay>
                    </div>
                ) as unknown as React.ReactElement,
            );
        });

        it("doesn't focus overlay if focus is already inside overlay", async () => {
            let textarea: HTMLTextAreaElement | null;
            renderOverlay(
                <Overlay className={overlayClassName} isOpen={true} usePortal={true}>
                    <textarea ref={ref => (textarea = ref)} />
                </Overlay>,
            );
            textarea!.focus();
            await assertFocus("textarea");
        });

        it("does not focus overlay when closed", async () => {
            renderOverlay(
                (
                    <div>
                        <button ref={ref => ref && ref.focus()} />
                        <Overlay className={overlayClassName} isOpen={false} usePortal={true} />
                    </div>
                ) as unknown as React.ReactElement,
            );
            await assertFocus("button");
        });

        // SKIP: @testing-library/user-event v14 installs a global focus listener that
        // crashes when event.target is not a DOM element. This test dispatches a focus
        // event with window as the target to simulate clicking browser chrome.
        // The underlying Blueprint behavior is still valid.
        it.skip("does not crash while trying to return focus to overlay if user clicks outside the document", () => {
            renderOverlay(
                <Overlay
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                >
                    {createOverlayContents()}
                </Overlay>,
            );

            const event = new FocusEvent("focus");
            Object.defineProperty(event, "target", { value: window });

            try {
                document.dispatchEvent(event);
            } catch (e) {
                assert.fail("threw uncaught error");
            }
        });

        async function assertFocus(selector: string | (() => void)) {
            await waitFor(() => {
                if (Utils.isFunction(selector)) {
                    selector();
                } else {
                    assert.strictEqual(document.querySelector(selector), document.activeElement);
                }
            });
        }

        async function assertFocusIsInOverlay() {
            await assertFocus(() => {
                const overlayElement = document.querySelector(`.${overlayClassName}`);
                assert.isTrue(overlayElement?.contains(document.activeElement));
            });
        }
    });

    describe("Background scrolling", () => {
        beforeEach(() => {
            // force-reset Overlay stack state between tests
            (Overlay as any).openStack = [];
            document.body.classList.remove(Classes.OVERLAY_OPEN);
        });

        it("disables document scrolling by default", async () => {
            renderOverlay(renderBackdropOverlay());
            await assertBodyScrollingDisabled(true);
        });

        it("disables document scrolling if hasBackdrop=true and usePortal=true", async () => {
            renderOverlay(renderBackdropOverlay(true, true));
            await assertBodyScrollingDisabled(true);
        });

        it("does not disable document scrolling if hasBackdrop=true and usePortal=false", async () => {
            renderOverlay(renderBackdropOverlay(true, false));
            await assertBodyScrollingDisabled(false);
        });

        it("does not disable document scrolling if hasBackdrop=false and usePortal=true", async () => {
            renderOverlay(renderBackdropOverlay(false, true));
            await assertBodyScrollingDisabled(false);
        });

        it("does not disable document scrolling if hasBackdrop=false and usePortal=false", async () => {
            renderOverlay(renderBackdropOverlay(false, false));
            await assertBodyScrollingDisabled(false);
        });

        it("keeps scrolling disabled if hasBackdrop=true overlay exists following unmount", async () => {
            const backdropOverlay = render(renderBackdropOverlay(true));
            renderOverlay(renderBackdropOverlay(true));
            backdropOverlay.unmount();

            await assertBodyScrollingDisabled(true);
        });

        it("doesn't keep scrolling disabled if no hasBackdrop=true overlay exists following unmount", async () => {
            const backdropOverlay = render(renderBackdropOverlay(true));
            renderOverlay(renderBackdropOverlay(false));
            backdropOverlay.unmount();

            await assertBodyScrollingDisabled(false);
        });

        function renderBackdropOverlay(hasBackdrop?: boolean, usePortal?: boolean) {
            return (
                <Overlay hasBackdrop={hasBackdrop} isOpen={true} usePortal={usePortal}>
                    <div>Some overlay content</div>
                </Overlay>
            );
        }

        async function assertBodyScrollingDisabled(disabled: boolean) {
            await waitFor(() => {
                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                assert.equal(hasClass, disabled);
            });
        }
    });

    it.skip("lifecycle methods called as expected", async () => {
        // these lifecycles are passed directly to CSSTransition from react-transition-group
        // so we do not need to test these extensively. one integration test should do.
        const onClosed = vi.fn();
        const onClosing = vi.fn();
        const onOpened = vi.fn();
        const onOpening = vi.fn();
        const ref = createRef<Overlay>();
        const { rerender } = render(
            <Overlay
                ref={ref}
                {...{ onClosed, onClosing, onOpened, onOpening }}
                isOpen={true}
                usePortal={false}
                transitionDuration={8}
            >
                {createOverlayContents()}
            </Overlay>,
            { container: containerElement },
        );
        result = {} as RenderResult;
        expect(onOpening).toHaveBeenCalledOnce();
        expect(onOpened).not.toHaveBeenCalled();

        await sleep(10);

        expect(onOpened).toHaveBeenCalledOnce();

        rerender(
            <Overlay
                ref={ref}
                {...{ onClosed, onClosing, onOpened, onOpening }}
                isOpen={false}
                usePortal={false}
                transitionDuration={8}
            >
                {createOverlayContents()}
            </Overlay>,
        );
        expect(onClosing).toHaveBeenCalledOnce();
        expect(onClosed).not.toHaveBeenCalled();

        await sleep(10);

        expect(onClosed).toHaveBeenCalledOnce();
    });

    let index = 0;
    function createOverlayContents() {
        return (
            <strong id={`overlay-${index++}`} tabIndex={0}>
                Overlay content!
            </strong>
        );
    }
});
