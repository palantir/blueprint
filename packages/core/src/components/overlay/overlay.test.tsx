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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Overlay } from "./overlay";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

describe("<Overlay>", () => {
    beforeEach(() => {
        // force-reset Overlay stack state between tests
        (Overlay as any).openStack = [];
        document.body.classList.remove(Classes.OVERLAY_OPEN);
    });

    afterEach(() => {
        // clean up any leftover overlay classes on body
        document.body.classList.remove(Classes.OVERLAY_OPEN);
    });

    it("renders its content correctly", () => {
        const { container } = render(
            <Overlay isOpen={true} usePortal={false} transitionDuration={0}>
                <strong>Overlay content!</strong>
            </Overlay>,
        );

        expect(screen.getByText("Overlay content!")).toBeInTheDocument();
        expect(container.querySelector(BACKDROP_SELECTOR)).toBeInTheDocument();
    });

    it("renders contents to specified container correctly", () => {
        const portalContainer = document.createElement("div");
        document.body.appendChild(portalContainer);

        render(
            <Overlay isOpen={true} portalContainer={portalContainer} transitionDuration={0}>
                <p className="bp-test-content">test</p>
            </Overlay>,
        );

        expect(portalContainer.getElementsByClassName("bp-test-content")).toHaveLength(1);

        document.body.removeChild(portalContainer);
    });

    it("sets aria-live", () => {
        const { container } = render(
            <Overlay className="aria-test" isOpen={true} usePortal={false} transitionDuration={0} />,
        );
        const overlayElement = container.querySelector(".aria-test");

        expect(overlayElement).toBeInTheDocument();
        expect(overlayElement?.getAttribute("aria-live")).toBe("polite");
    });

    it("portalClassName appears on Portal", () => {
        const CLASS_TO_TEST = "bp-test-content";
        render(
            <Overlay isOpen={true} portalClassName={CLASS_TO_TEST} transitionDuration={0}>
                <p>test</p>
            </Overlay>,
        );

        expect(document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`)).toBeInTheDocument();
    });

    it("renders Portal after first opened", () => {
        const portalClassName = "test-portal-lazy";
        const { rerender } = render(
            <Overlay isOpen={false} portalClassName={portalClassName} transitionDuration={0}>
                <strong>Overlay content!</strong>
            </Overlay>,
        );

        expect(document.querySelector(`.${Classes.PORTAL}.${portalClassName}`)).not.toBeInTheDocument();

        rerender(
            <Overlay isOpen={true} portalClassName={portalClassName} transitionDuration={0}>
                <strong>Overlay content!</strong>
            </Overlay>,
        );

        expect(document.querySelector(`.${Classes.PORTAL}.${portalClassName}`)).toBeInTheDocument();
    });

    it("supports non-element children", () => {
        expect(() =>
            render(
                <Overlay isOpen={true} usePortal={false} transitionDuration={0}>
                    {null} {undefined}
                </Overlay>,
            ),
        ).not.toThrow();
    });

    it("hasBackdrop=false does not render backdrop", () => {
        const { container } = render(
            <Overlay hasBackdrop={false} isOpen={true} usePortal={false} transitionDuration={0}>
                <strong>Overlay content!</strong>
            </Overlay>,
        );

        expect(screen.getByText("Overlay content!")).toBeInTheDocument();
        expect(container.querySelector(BACKDROP_SELECTOR)).not.toBeInTheDocument();
    });

    it("renders portal attached to body when not inline after first opened", () => {
        const portalClassName = "test-portal-body";
        const { rerender } = render(
            <Overlay isOpen={false} portalClassName={portalClassName} transitionDuration={0}>
                <strong>Overlay content!</strong>
            </Overlay>,
        );

        expect(document.querySelector(`.${Classes.PORTAL}.${portalClassName}`)).not.toBeInTheDocument();

        rerender(
            <Overlay isOpen={true} portalClassName={portalClassName} transitionDuration={0}>
                <strong>Overlay content!</strong>
            </Overlay>,
        );

        expect(document.querySelector(`.${Classes.PORTAL}.${portalClassName}`)).toBeInTheDocument();
    });

    describe("onClose", () => {
        it("invoked on backdrop mousedown when canOutsideClickClose=true", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            const { container } = render(
                <Overlay
                    canOutsideClickClose={true}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                    transitionDuration={0}
                >
                    <strong>Overlay content!</strong>
                </Overlay>,
            );
            const backdropElement = container.querySelector(BACKDROP_SELECTOR);

            expect(backdropElement).toBeInTheDocument();

            await user.click(backdropElement!);

            expect(onClose).toHaveBeenCalledOnce();
        });

        it("not invoked on backdrop mousedown when canOutsideClickClose=false", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            const { container } = render(
                <Overlay
                    canOutsideClickClose={false}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                    transitionDuration={0}
                >
                    <strong>Overlay content!</strong>
                </Overlay>,
            );
            const backdropElement = container.querySelector(BACKDROP_SELECTOR);

            expect(backdropElement).toBeInTheDocument();

            await user.click(backdropElement!);

            expect(onClose).not.toHaveBeenCalled();
        });

        it("invoked on document mousedown when hasBackdrop=false", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            render(
                <Overlay hasBackdrop={false} isOpen={true} onClose={onClose} usePortal={false} transitionDuration={0}>
                    <strong>Overlay content!</strong>
                </Overlay>,
            );

            await user.click(document.documentElement);

            expect(onClose).toHaveBeenCalledOnce();
        });

        it("not invoked on document mousedown when hasBackdrop=false and canOutsideClickClose=false", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            render(
                <Overlay
                    canOutsideClickClose={false}
                    hasBackdrop={false}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                    transitionDuration={0}
                >
                    <strong>Overlay content!</strong>
                </Overlay>,
            );

            await user.click(document.documentElement);

            expect(onClose).not.toHaveBeenCalled();
        });

        it("not invoked on click of a nested overlay", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            render(
                <Overlay isOpen={true} onClose={onClose} transitionDuration={0}>
                    <>
                        <span>outer content</span>
                        <Overlay isOpen={true} transitionDuration={0}>
                            <span>inner content</span>
                        </Overlay>
                    </>
                </Overlay>,
            );
            const innerElement = screen.getByText("inner content");

            await user.click(innerElement);

            expect(onClose).not.toHaveBeenCalled();
        });

        it("invoked on escape key", () => {
            const onClose = vi.fn();

            function TestOverlay() {
                const [isOpen, setIsOpen] = useState(true);

                return (
                    <Overlay
                        isOpen={isOpen}
                        onClose={e => {
                            onClose(e);
                            setIsOpen(false);
                        }}
                        usePortal={false}
                        transitionDuration={0}
                    >
                        <span>test content</span>
                    </Overlay>
                );
            }

            const { container } = render(<TestOverlay />);
            const overlayElement = container.querySelector(`.${Classes.OVERLAY}`);

            expect(overlayElement).toBeInTheDocument();

            fireEvent.keyDown(overlayElement!, { key: "Escape" });

            expect(onClose).toHaveBeenCalledOnce();
        });

        it("not invoked on escape key when canEscapeKeyClose=false", () => {
            const onClose = vi.fn();

            function TestOverlay() {
                const [isOpen, setIsOpen] = useState(true);

                return (
                    <Overlay
                        canEscapeKeyClose={false}
                        isOpen={isOpen}
                        onClose={e => {
                            onClose(e);
                            setIsOpen(false);
                        }}
                        usePortal={false}
                        transitionDuration={0}
                    >
                        <span>test content</span>
                    </Overlay>
                );
            }

            const { container } = render(<TestOverlay />);
            const overlayElement = container.querySelector(`.${Classes.OVERLAY}`);

            expect(overlayElement).toBeInTheDocument();

            fireEvent.keyDown(overlayElement!, { key: "Escape" });

            expect(onClose).not.toHaveBeenCalled();
        });

        it("renders portal attached to body when not inline", () => {
            const portalClassName = "test-portal-inline";
            render(
                <Overlay isOpen={true} usePortal={true} portalClassName={portalClassName} transitionDuration={0}>
                    <strong>Overlay content!</strong>
                </Overlay>,
            );

            const portalElement = document.querySelector(`.${Classes.PORTAL}.${portalClassName}`);
            expect(portalElement).toBeInTheDocument();
            expect(screen.getByText("Overlay content!")).toBeInTheDocument();
        });
    });

    describe("Focus management", () => {
        const overlayClassName = "test-overlay";

        it("brings focus to overlay if autoFocus=true", async () => {
            render(
                <Overlay
                    className={overlayClassName}
                    autoFocus={true}
                    isOpen={true}
                    usePortal={true}
                    transitionDuration={0}
                >
                    <input type="text" />
                </Overlay>,
            );

            await waitFor(() =>
                expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("does not bring focus to overlay if autoFocus=false and enforceFocus=false", async () => {
            render(
                <div>
                    <button>something outside overlay for browser to focus on</button>
                    <Overlay
                        className={overlayClassName}
                        autoFocus={false}
                        enforceFocus={false}
                        isOpen={true}
                        usePortal={true}
                        transitionDuration={0}
                    >
                        <input type="text" />
                    </Overlay>
                </div>,
            );

            await waitFor(() => expect(document.activeElement).toBe(document.body));
        });

        // React implements autoFocus itself so our `[autofocus]` logic never fires.
        // Still, worth testing we can control where the focus goes.
        it("autoFocus element inside overlay gets the focus", async () => {
            render(
                <Overlay className={overlayClassName} isOpen={true} usePortal={true} transitionDuration={0}>
                    <input autoFocus={true} type="text" />
                </Overlay>,
            );

            await waitFor(() => expect(document.activeElement).toBe(document.querySelector("input")));
        });

        it("returns focus to overlay if enforceFocus=true", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            const inputRef = createRef<HTMLInputElement>();
            render(
                <div>
                    <button ref={buttonRef} />
                    <Overlay
                        className={overlayClassName}
                        enforceFocus={true}
                        isOpen={true}
                        usePortal={true}
                        transitionDuration={0}
                    >
                        <div>
                            <input autoFocus={true} ref={inputRef} />
                        </div>
                    </Overlay>
                </div>,
            );

            expect(document.activeElement).toBe(inputRef.current);
            buttonRef.current?.focus();

            await waitFor(() =>
                expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("returns focus to overlay after clicking the backdrop if enforceFocus=true", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <Overlay
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                    transitionDuration={0}
                >
                    <strong tabIndex={0}>Overlay content!</strong>
                </Overlay>,
            );
            const backdropElement = container.querySelector(BACKDROP_SELECTOR);

            expect(backdropElement).toBeInTheDocument();

            await user.click(backdropElement!);

            await waitFor(() =>
                expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        // SKIP: jsdom + requestAnimationFrame timing issue. The enforceFocus mechanism uses
        // requestAnimationFrame to delay focus manipulation (Overlay), and RAF
        // timing in jsdom is inconsistent with userEvent clicks.
        it.skip("returns focus to overlay after clicking an outside element if enforceFocus=true", async () => {
            const user = userEvent.setup();
            render(
                <div>
                    <Overlay
                        enforceFocus={true}
                        canOutsideClickClose={false}
                        className={overlayClassName}
                        isOpen={true}
                        usePortal={false}
                        hasBackdrop={false}
                        transitionDuration={0}
                    >
                        <strong tabIndex={0}>Overlay content!</strong>
                    </Overlay>
                    <button>Button outside overlay</button>
                </div>,
            );
            const buttonElement = screen.getByRole("button", { name: /button outside overlay/i });

            await user.click(buttonElement);

            await waitFor(() =>
                expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("does not result in maximum call stack if two overlays open with enforceFocus=true", async () => {
            const user = userEvent.setup();
            const secondOverlayInputID = "inputId";

            const { rerender } = render(
                <>
                    <Overlay
                        className={overlayClassName}
                        enforceFocus={true}
                        isOpen={true}
                        usePortal={false}
                        transitionDuration={0}
                    >
                        <input type="text" />
                    </Overlay>
                    <Overlay
                        className={overlayClassName}
                        enforceFocus={true}
                        isOpen={false}
                        usePortal={false}
                        transitionDuration={0}
                    >
                        <input type="text" data-testid={secondOverlayInputID} />
                    </Overlay>
                </>,
            );

            // open the second overlay
            rerender(
                <>
                    <Overlay
                        className={overlayClassName}
                        enforceFocus={true}
                        isOpen={true}
                        usePortal={false}
                        transitionDuration={0}
                    >
                        <input type="text" />
                    </Overlay>
                    <Overlay
                        className={overlayClassName}
                        enforceFocus={true}
                        isOpen={true}
                        usePortal={false}
                        transitionDuration={0}
                    >
                        <input type="text" data-testid={secondOverlayInputID} />
                    </Overlay>
                </>,
            );

            const secondOverlayInputElement = screen.getByTestId(secondOverlayInputID);

            // this click potentially triggers infinite recursion if both overlays try to bring focus back to themselves
            await user.click(secondOverlayInputElement);
        });

        it("does not return focus to overlay if enforceFocus=false", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            render(
                <div>
                    <button ref={buttonRef} />
                    <Overlay
                        className={overlayClassName}
                        enforceFocus={false}
                        isOpen={true}
                        usePortal={true}
                        transitionDuration={0}
                    >
                        <div>
                            <input type="text" />
                        </div>
                    </Overlay>
                </div>,
            );

            expect(buttonRef.current).not.toBeNull();

            buttonRef.current!.focus();

            await waitFor(() => expect(document.activeElement).toBe(buttonRef.current));
        });

        it("doesn't focus overlay if focus is already inside overlay", async () => {
            const textareaRef = createRef<HTMLTextAreaElement>();
            render(
                <Overlay className={overlayClassName} isOpen={true} usePortal={true} transitionDuration={0}>
                    <div>
                        <textarea ref={textareaRef} />
                    </div>
                </Overlay>,
            );

            expect(textareaRef.current).not.toBeNull();

            textareaRef.current!.focus();

            await waitFor(() => expect(document.activeElement).toBe(textareaRef.current));
        });

        it("does not focus overlay when closed", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            render(
                <div>
                    <button ref={buttonRef} />
                    <Overlay className={overlayClassName} isOpen={false} usePortal={true} transitionDuration={0} />
                </div>,
            );

            expect(buttonRef.current).not.toBeNull();

            buttonRef.current!.focus();

            await waitFor(() => expect(document.activeElement).toBe(buttonRef.current));
        });

        // SKIP: @testing-library/user-event v14 installs a global focus listener that
        // crashes when event.target is not a DOM element. This test dispatches a focus
        // event with window as the target to simulate clicking browser chrome.
        // The underlying Blueprint behavior is still valid.
        it.skip("does not crash while trying to return focus to overlay if user clicks outside the document", () => {
            render(
                <Overlay
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                    transitionDuration={0}
                >
                    <strong tabIndex={0}>Overlay content!</strong>
                </Overlay>,
            );

            // this is a fairly custom / nonstandard event dispatch, trying to simulate what happens in some browsers when a user clicks
            // on the browser toolbar (outside the document), but a focus event is still dispatched to document
            // see https://github.com/palantir/blueprint/issues/3928
            const event = new FocusEvent("focus");
            Object.defineProperty(event, "target", { value: window });

            expect(() => document.dispatchEvent(event)).not.toThrow();
        });
    });

    describe("Background scrolling", () => {
        beforeEach(() => {
            // force-reset Overlay stack state between tests
            (Overlay as any).openStack = [];
            document.body.classList.remove(Classes.OVERLAY_OPEN);
        });

        it("disables document scrolling by default", async () => {
            render(
                <Overlay isOpen={true} transitionDuration={0}>
                    <div>Some overlay content</div>
                </Overlay>,
            );

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true));
        });

        it("disables document scrolling if hasBackdrop=true and usePortal=true", async () => {
            render(
                <Overlay hasBackdrop={true} isOpen={true} usePortal={true} transitionDuration={0}>
                    <div>Some overlay content</div>
                </Overlay>,
            );

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true));
        });

        it("does not disable document scrolling if hasBackdrop=true and usePortal=false", async () => {
            render(
                <Overlay hasBackdrop={true} isOpen={true} usePortal={false} transitionDuration={0}>
                    <div>Some overlay content</div>
                </Overlay>,
            );

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false));
        });

        it("does not disable document scrolling if hasBackdrop=false and usePortal=true", async () => {
            render(
                <Overlay hasBackdrop={false} isOpen={true} usePortal={true} transitionDuration={0}>
                    <div>Some overlay content</div>
                </Overlay>,
            );

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false));
        });

        it("does not disable document scrolling if hasBackdrop=false and usePortal=false", async () => {
            render(
                <Overlay hasBackdrop={false} isOpen={true} usePortal={false} transitionDuration={0}>
                    <div>Some overlay content</div>
                </Overlay>,
            );

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false));
        });

        it("keeps scrolling disabled if hasBackdrop=true overlay exists following unmount", async () => {
            const { unmount } = render(
                <Overlay hasBackdrop={true} isOpen={true} transitionDuration={0}>
                    <div>First overlay</div>
                </Overlay>,
            );
            render(
                <Overlay hasBackdrop={true} isOpen={true} transitionDuration={0}>
                    <div>Second overlay</div>
                </Overlay>,
            );

            unmount();

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true));
        });

        it("doesn't keep scrolling disabled if no hasBackdrop=true overlay exists following unmount", async () => {
            const { unmount } = render(
                <Overlay hasBackdrop={true} isOpen={true} transitionDuration={0}>
                    <div>First overlay</div>
                </Overlay>,
            );
            render(
                <Overlay hasBackdrop={false} isOpen={true} transitionDuration={0}>
                    <div>Second overlay</div>
                </Overlay>,
            );

            unmount();

            await waitFor(() => expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false));
        });
    });

    it.skip("lifecycle methods called as expected", async () => {
        // these lifecycles are passed directly to CSSTransition from react-transition-group
        // so we do not need to test these extensively. one integration test should do.
        const onClosed = vi.fn();
        const onClosing = vi.fn();
        const onOpened = vi.fn();
        const onOpening = vi.fn();

        const { rerender } = render(
            <Overlay
                isOpen={true}
                usePortal={false}
                // transition duration shorter than timeout below to ensure it's done
                transitionDuration={8}
                onClosed={onClosed}
                onClosing={onClosing}
                onOpened={onOpened}
                onOpening={onOpening}
            >
                <strong tabIndex={0}>Overlay content!</strong>
            </Overlay>,
        );

        await waitFor(() => expect(onOpening).toHaveBeenCalledOnce());
        expect(onOpened).not.toHaveBeenCalled();

        await waitFor(() => expect(onOpened).toHaveBeenCalledOnce(), { timeout: 100 });

        rerender(
            <Overlay
                isOpen={false}
                usePortal={false}
                transitionDuration={8}
                onClosed={onClosed}
                onClosing={onClosing}
                onOpened={onOpened}
                onOpening={onOpening}
            >
                <strong tabIndex={0}>Overlay content!</strong>
            </Overlay>,
        );

        await waitFor(() => expect(onClosing).toHaveBeenCalledOnce(), { timeout: 200 });
        await waitFor(() => expect(onClosed).toHaveBeenCalledOnce(), { timeout: 200 });
    });
});
