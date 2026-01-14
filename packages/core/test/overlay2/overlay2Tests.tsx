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

import { fireEvent, render, type RenderOptions, type RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { spy } from "sinon";
import { describe, expect, test as it } from "vitest";

import { Classes, Overlay2, type Overlay2Props, type OverlayInstance, OverlaysProvider } from "../../src";

import "./overlay2-test-debugging.scss";

const BACKDROP_SELECTOR = `.${Classes.OVERLAY_BACKDROP}`;

/**
 * Custom render function for overlay tests
 *
 * @see https://testing-library.com/docs/example-react-context/
 */
function renderWithOverlaysProvider(ui: React.ReactElement, renderOptions: RenderOptions = {}): RenderResult {
    return render(ui, {
        wrapper: OverlaysProvider,
        ...renderOptions,
    });
}

describe("<Overlay2>", () => {
    it("should render its contents", () => {
        const { container } = renderWithOverlaysProvider(
            <Overlay2 transitionDuration={0} isOpen={true} usePortal={false}>
                <span>test content</span>
            </Overlay2>,
        );
        const backdropElement = container.querySelector(BACKDROP_SELECTOR);

        expect(screen.getByText("test content")).toBeDefined();
        expect(backdropElement).toBeDefined();
    });

    it("should render contents to a specified container", () => {
        const portalContainer = document.createElement("div");
        document.body.appendChild(portalContainer);

        renderWithOverlaysProvider(
            <Overlay2 transitionDuration={0} isOpen={true} portalContainer={portalContainer}>
                <span>test content</span>
            </Overlay2>,
        );

        expect(screen.getByText("test content")).toBeDefined();

        document.body.removeChild(portalContainer);
    });

    it("should set aria-live attribute", () => {
        // Using an open Overlay2 because an initially closed Overlay2 will not render anything to the DOM
        const { container } = renderWithOverlaysProvider(
            <Overlay2 transitionDuration={0} className="aria-test" isOpen={true} usePortal={false} />,
        );
        const overlayElement = container.querySelector(".aria-test");

        expect(overlayElement).toBeDefined();
        // Element#ariaLive not supported in Firefox or IE
        expect(overlayElement?.getAttribute("aria-live")).toBe("polite");
    });

    it("should apply portalClassName to Portal", () => {
        const portalClassName = "test-portal-class";
        renderWithOverlaysProvider(<Overlay2 transitionDuration={0} isOpen={true} portalClassName={portalClassName} />);
        const portalElement = document.querySelector(`.${Classes.PORTAL}.${portalClassName}`);

        expect(portalElement).toBeDefined();
    });

    it("should not render Portal when closed", () => {
        const portalClassName = "test-portal-closed";
        renderWithOverlaysProvider(
            <Overlay2 transitionDuration={0} isOpen={false} portalClassName={portalClassName} />,
        );

        const portalElement = document.querySelector(`.${Classes.PORTAL}.${portalClassName}`);
        expect(portalElement).toBeNull();
    });

    it("should render Portal when opened", () => {
        const portalClassName = "test-portal-opened";
        renderWithOverlaysProvider(<Overlay2 transitionDuration={0} isOpen={true} portalClassName={portalClassName} />);

        const portalElement = document.querySelector(`.${Classes.PORTAL}.${portalClassName}`);
        expect(portalElement).toBeDefined();
    });

    it("should support non-element children", () => {
        // If this doesn't throw, the test passes
        expect(() => {
            renderWithOverlaysProvider(
                <Overlay2 transitionDuration={0} isOpen={true} usePortal={false}>
                    {null} {undefined}
                </Overlay2>,
            );
        }).not.toThrow();
    });

    it("should not render backdrop when hasBackdrop is false", () => {
        const { container } = renderWithOverlaysProvider(
            <Overlay2 transitionDuration={0} hasBackdrop={false} isOpen={true} usePortal={false}>
                <span>test content</span>
            </Overlay2>,
        );

        expect(screen.getByText("test content")).toBeDefined();
        expect(container.querySelector(BACKDROP_SELECTOR)).toBeNull();
    });

    describe("onClose", () => {
        it("should invoke on backdrop mousedown when canOutsideClickClose=true", () => {
            const onClose = spy();
            const { container } = renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    canOutsideClickClose={true}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                />,
            );
            const backdropElement = container.querySelector(BACKDROP_SELECTOR);

            expect(backdropElement).toBeDefined();

            userEvent.click(backdropElement!);

            expect(onClose.calledOnce).toBe(true);
        });

        it("should not invoke on backdrop mousedown when canOutsideClickClose=false", () => {
            const onClose = spy();
            const { container } = renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    canOutsideClickClose={false}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                />,
            );
            const backdropElement = container.querySelector(BACKDROP_SELECTOR);

            expect(backdropElement).toBeDefined();

            userEvent.click(backdropElement!);

            expect(onClose.notCalled).toBe(true);
        });

        it("should invoke on document mousedown when hasBackdrop=false", () => {
            const onClose = spy();
            renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                    hasBackdrop={false}
                />,
            );

            userEvent.click(document.documentElement);

            expect(onClose.calledOnce).toBe(true);
        });

        it("should not invoke on document mousedown when hasBackdrop=false and canOutsideClickClose=false", () => {
            const onClose = spy();
            renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    canOutsideClickClose={false}
                    hasBackdrop={false}
                    isOpen={true}
                    onClose={onClose}
                    usePortal={false}
                />,
            );

            userEvent.click(document.documentElement);

            expect(onClose.notCalled).toBe(true);
        });

        it("should not invoke on click of a nested overlay", () => {
            const onClose = spy();
            renderWithOverlaysProvider(
                <Overlay2 transitionDuration={0} isOpen={true} onClose={onClose}>
                    <>
                        <span>outer content</span>
                        <Overlay2 transitionDuration={0} isOpen={true}>
                            <span>inner content</span>
                        </Overlay2>
                    </>
                </Overlay2>,
            );
            const innerElement = screen.getByText("inner content");

            userEvent.click(innerElement);

            expect(onClose.notCalled).toBe(true);
        });

        it("should invoke on escape key", async () => {
            const onClose = spy();

            function TestOverlay() {
                const [isOpen, setIsOpen] = useState(true);

                return (
                    <Overlay2
                        transitionDuration={0}
                        isOpen={isOpen}
                        onClose={e => {
                            onClose(e);
                            setIsOpen(false);
                        }}
                        usePortal={false}
                    >
                        <span>test content</span>
                    </Overlay2>
                );
            }

            const { container } = renderWithOverlaysProvider(<TestOverlay />);
            const overlayElement = container.querySelector(`.${Classes.OVERLAY}`);

            expect(overlayElement).toBeDefined();
            expect(screen.queryByText("test content")).toBeDefined();

            fireEvent.keyDown(overlayElement!, { key: "Escape" });

            expect(onClose.calledOnce).toBe(true);

            await waitFor(() => expect(screen.queryByText("test content")).toBeNull());
        });

        it("should not invoke on escape key when canEscapeKeyClose is false", () => {
            const onClose = spy();

            function TestOverlay() {
                const [isOpen, setIsOpen] = useState(true);

                return (
                    <Overlay2
                        transitionDuration={0}
                        canEscapeKeyClose={false}
                        isOpen={isOpen}
                        onClose={e => {
                            onClose(e);
                            setIsOpen(false);
                        }}
                        usePortal={false}
                    >
                        <span>test content</span>
                    </Overlay2>
                );
            }

            const { container } = renderWithOverlaysProvider(<TestOverlay />);
            const overlayElement = container.querySelector(`.${Classes.OVERLAY}`);

            expect(overlayElement).toBeDefined();
            expect(screen.queryByText("test content")).toBeDefined();

            fireEvent.keyDown(overlayElement!, { key: "Escape" });

            expect(onClose.notCalled).toBe(true);

            expect(screen.queryByText("test content")).toBeDefined();
        });

        it("should close second overlay with escape key and return focus to first overlay", async () => {
            const firstOnClose = spy();
            const secondOnClose = spy();

            function TestOverlays() {
                const [isFirstOpen, setIsFirstOpen] = useState(true);
                const [isSecondOpen, setIsSecondOpen] = useState(true);

                return (
                    <>
                        <Overlay2
                            transitionDuration={0}
                            isOpen={isFirstOpen}
                            onClose={e => {
                                firstOnClose(e);
                                setIsFirstOpen(false);
                            }}
                            usePortal={false}
                        >
                            <input type="text" data-testid="first-overlay-input" />
                        </Overlay2>
                        <Overlay2
                            transitionDuration={0}
                            isOpen={isSecondOpen}
                            onClose={e => {
                                secondOnClose(e);
                                setIsSecondOpen(false);
                            }}
                            usePortal={false}
                        >
                            <input type="text" data-testid="second-overlay-input" />
                        </Overlay2>
                    </>
                );
            }

            renderWithOverlaysProvider(<TestOverlays />);

            const firstInput = screen.getByTestId("first-overlay-input");
            const secondInput = screen.getByTestId("second-overlay-input");

            // Verify both overlays are open
            expect(firstInput).toBeDefined();
            expect(secondInput).toBeDefined();

            // Find the second overlay container element
            const secondOverlayContainer = secondInput.closest(`.${Classes.OVERLAY}`);
            expect(secondOverlayContainer).toBeDefined();

            // Press Escape on the second overlay
            fireEvent.keyDown(secondOverlayContainer!, { key: "Escape" });

            // Verify only the second overlay's onClose was called
            expect(firstOnClose.notCalled).toBe(true);
            expect(secondOnClose.calledOnce).toBe(true);

            // Wait for the second overlay to close
            await waitFor(() => expect(screen.queryByTestId("second-overlay-input")).toBeNull());

            // Verify the first overlay is still open
            expect(screen.queryByTestId("first-overlay-input")).toBeDefined();

            // Verify focus returns to the first overlay
            await waitFor(() => {
                const firstOverlayContainer = firstInput.closest(`.${Classes.OVERLAY}`);
                expect(firstOverlayContainer?.contains(document.activeElement)).toBe(true);
            });
        });
    });

    describe("Focus management", () => {
        const overlayClassName = "test-overlay";

        it("should bring focus to overlay if autoFocus is true", async () => {
            renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    className={overlayClassName}
                    autoFocus={true}
                    isOpen={true}
                    usePortal={true}
                >
                    <input type="text" />
                </Overlay2>,
            );

            await waitFor(
                () =>
                    expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("should not bring focus to overlay if autoFocus=false and enforceFocus=false", async () => {
            renderWithOverlaysProvider(
                <div>
                    <button>something outside overlay for browser to focus on</button>
                    <Overlay2
                        transitionDuration={0}
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

            await waitFor(() => expect(document.activeElement).toBe(document.body));
        });

        // React implements autoFocus itself so our `[autofocus]` logic never fires.
        // Still, worth testing we can control where the focus goes.
        it("should focus autoFocus element inside overlay", async () => {
            renderWithOverlaysProvider(
                <Overlay2 transitionDuration={0} className={overlayClassName} isOpen={true} usePortal={true}>
                    <input autoFocus={true} type="text" />
                </Overlay2>,
            );

            await waitFor(() => expect(document.activeElement).toBe(document.querySelector("input")));
        });

        it("should return focus to overlay if enforceFocus=true", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            const inputRef = createRef<HTMLInputElement>();
            renderWithOverlaysProvider(
                <div>
                    <button ref={buttonRef} />
                    <Overlay2
                        transitionDuration={0}
                        className={overlayClassName}
                        enforceFocus={true}
                        isOpen={true}
                        usePortal={true}
                    >
                        <div>
                            <input autoFocus={true} ref={inputRef} />
                        </div>
                    </Overlay2>
                </div>,
            );

            expect(document.activeElement).toBe(inputRef.current);
            buttonRef.current?.focus();

            await waitFor(
                () =>
                    expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("should return focus to overlay after clicking the backdrop if enforceFocus=true", async () => {
            const { container } = renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                />,
            );
            const backdropElement = container.querySelector(BACKDROP_SELECTOR);

            expect(backdropElement).toBeDefined();

            userEvent.click(backdropElement!);

            await waitFor(
                () =>
                    expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("should return focus to overlay after clicking an outside element if enforceFocus=true", async () => {
            renderWithOverlaysProvider(
                <div>
                    <Overlay2
                        transitionDuration={0}
                        enforceFocus={true}
                        canOutsideClickClose={false}
                        className={overlayClassName}
                        isOpen={true}
                        usePortal={false}
                        hasBackdrop={false}
                    >
                        <strong tabIndex={0}>Overlay2 content!</strong>
                    </Overlay2>
                    <button>Button outside overlay</button>
                </div>,
            );
            const buttonElement = screen.getByRole("button", { name: /button outside overlay/i });

            userEvent.click(buttonElement);

            await waitFor(
                () =>
                    expect(document.querySelector(`.${overlayClassName}`)?.contains(document.activeElement)).toBe(true),
            );
        });

        it("should not result in maximum call stack if two overlays open with enforceFocus=true", () => {
            const firstOverlayInstance = createRef<OverlayInstance>();
            const secondOverlayInputID = "inputId";

            const firstOverlay: Overlay2Props = {
                children: <input type="text" />,
                className: overlayClassName,
                enforceFocus: true,
                isOpen: true,
                ref: firstOverlayInstance,
                usePortal: false,
            };
            const secondOverlay: Overlay2Props = {
                children: <input type="text" data-testid={secondOverlayInputID} />,
                className: overlayClassName,
                enforceFocus: true,
                isOpen: false,
                usePortal: false,
            };

            const { rerender } = renderWithOverlaysProvider(
                <>
                    <Overlay2 transitionDuration={0} {...firstOverlay} />
                    <Overlay2 transitionDuration={0} {...secondOverlay} />
                </>,
            );

            expect(firstOverlayInstance.current).toBeDefined();

            // open the second overlay
            rerender(
                <>
                    <Overlay2 transitionDuration={0} {...firstOverlay} />
                    <Overlay2 transitionDuration={0} {...secondOverlay} isOpen={true} />
                </>,
            );

            const secondOverlayInputElement = screen.getByTestId(secondOverlayInputID);

            // this click potentially triggers infinite recursion if both overlays try to bring focus back to themselves
            userEvent.click(secondOverlayInputElement!);
            // previous test suites for Overlay spied on bringFocusInsideOverlay and asserted it was called once here,
            // but that is more difficult to test with function components and breaches the abstraction of Overlay2.
        });

        it("should not return focus to overlay if enforceFocus=false", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            renderWithOverlaysProvider(
                <div>
                    <button ref={buttonRef} />
                    <Overlay2
                        transitionDuration={0}
                        className={overlayClassName}
                        enforceFocus={false}
                        isOpen={true}
                        usePortal={true}
                    >
                        <div>
                            <input type="text" />
                        </div>
                    </Overlay2>
                </div>,
            );

            expect(buttonRef.current).toBeDefined();

            buttonRef.current!.focus();

            await waitFor(() => expect(document.activeElement).toBe(buttonRef.current));
        });

        it("should not focus overlay if focus is already inside overlay", async () => {
            const textareaRef = createRef<HTMLTextAreaElement>();
            renderWithOverlaysProvider(
                <Overlay2 transitionDuration={0} className={overlayClassName} isOpen={true} usePortal={true}>
                    <div>
                        <textarea ref={textareaRef} />
                    </div>
                </Overlay2>,
            );

            expect(textareaRef.current).toBeDefined();

            textareaRef.current!.focus();

            await waitFor(() => expect(document.activeElement).toBe(textareaRef.current));
        });

        it("should not focus overlay when closed", async () => {
            const buttonRef = createRef<HTMLButtonElement>();
            renderWithOverlaysProvider(
                <div>
                    <button ref={buttonRef} />
                    <Overlay2 transitionDuration={0} className={overlayClassName} isOpen={false} usePortal={true} />
                </div>,
            );

            expect(buttonRef.current).toBeDefined();

            buttonRef.current!.focus();

            await waitFor(() => expect(document.activeElement).toBe(buttonRef.current));
        });

        it("should not crash while trying to return focus to overlay if user clicks outside the document", () => {
            renderWithOverlaysProvider(
                <Overlay2
                    transitionDuration={0}
                    className={overlayClassName}
                    enforceFocus={true}
                    canOutsideClickClose={false}
                    isOpen={true}
                    usePortal={false}
                >
                    <strong tabIndex={0}>Overlay2 content!</strong>
                </Overlay2>,
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
        describe("upon mount", () => {
            it("should disable document scrolling by default", () => {
                renderWithOverlaysProvider(<Overlay2 transitionDuration={0} isOpen={true} />);

                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                expect(hasClass).toBe(true);
            });

            it("should disable document scrolling if hasBackdrop=true and usePortal=true", () => {
                renderWithOverlaysProvider(
                    <Overlay2 transitionDuration={0} hasBackdrop={true} isOpen={true} usePortal={true} />,
                );

                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                expect(hasClass).toBe(true);
            });

            it("should not disable document scrolling if hasBackdrop=true and usePortal=false", () => {
                renderWithOverlaysProvider(
                    <Overlay2 transitionDuration={0} hasBackdrop={true} isOpen={true} usePortal={false} />,
                );

                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                expect(hasClass).toBe(false);
            });

            it("should not disable document scrolling if hasBackdrop=false and usePortal=true", () => {
                renderWithOverlaysProvider(
                    <Overlay2 transitionDuration={0} hasBackdrop={false} isOpen={true} usePortal={true} />,
                );

                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                expect(hasClass).toBe(false);
            });

            it("should not disable document scrolling if hasBackdrop=false and usePortal=false", () => {
                renderWithOverlaysProvider(
                    <Overlay2 transitionDuration={0} hasBackdrop={false} isOpen={true} usePortal={false} />,
                );

                const hasClass = document.body.classList.contains(Classes.OVERLAY_OPEN);
                expect(hasClass).toBe(false);
            });
        });

        describe("after closing (no overlays remaining)", () => {
            // N.B. this tests some of the behavior of useOverlaysProvider(), which we might want to extract
            // to a separate test suite
            it("should restore body scrolling", () => {
                const { rerender } = renderWithOverlaysProvider(
                    <Overlay2 transitionDuration={0} isOpen={true} usePortal={true} />,
                );

                // Verify scrolling is disabled when open
                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true);

                // Close the overlay
                rerender(<Overlay2 transitionDuration={0} isOpen={false} usePortal={true} />);

                // Verify scrolling is restored when closed
                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false);
            });
        });

        describe("after closing (but some overlays remain open)", () => {
            it("should keep scrolling disabled if some overlay with hasBackdrop=true exists", () => {
                const firstOverlay = {
                    hasBackdrop: true,
                    isOpen: true,
                    usePortal: true,
                };
                const secondOverlay = {
                    hasBackdrop: true,
                    isOpen: true,
                    usePortal: true,
                };

                const { rerender } = renderWithOverlaysProvider(
                    <>
                        <Overlay2 transitionDuration={0} {...firstOverlay} />
                        <Overlay2 transitionDuration={0} {...secondOverlay} />
                    </>,
                );

                // Verify scrolling is disabled when both overlays are open
                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true);

                // Close the first overlay which has a backdrop
                rerender(
                    <>
                        <Overlay2 transitionDuration={0} {...firstOverlay} isOpen={false} />
                        <Overlay2 transitionDuration={0} {...secondOverlay} />
                    </>,
                );

                // The second overlay with a backdrop should still be open, so scrolling should still be disabled
                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true);
            });

            it("should not keep scrolling disabled if no overlay exists with hasBackdrop=true", () => {
                const firstOverlay = {
                    hasBackdrop: true,
                    isOpen: true,
                    usePortal: true,
                };
                const secondOverlay = {
                    hasBackdrop: false,
                    isOpen: true,
                    usePortal: true,
                };

                const { rerender } = renderWithOverlaysProvider(
                    <>
                        <Overlay2 transitionDuration={0} {...firstOverlay} />
                        <Overlay2 transitionDuration={0} {...secondOverlay} />
                    </>,
                );

                // Verify scrolling is disabled when both overlays are open (first has backdrop)
                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true);

                // Close the first overlay which has a backdrop
                rerender(
                    <>
                        <Overlay2 transitionDuration={0} {...firstOverlay} isOpen={false} />
                        <Overlay2 transitionDuration={0} {...secondOverlay} />
                    </>,
                );

                // The second overlay should still be open, but it has no backdrop, so scrolling should be enabled
                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false);
            });
        });

        describe("after closing by navigating out of the view", () => {
            it("should not keep scrolling disabled if user navigated from the component where Overlay was opened", () => {
                function WrapperWithNavigation(props: { renderOverlayView: boolean; isOverlayOpen: boolean }) {
                    return (
                        <div>
                            {/* Emulating the router behavior */}
                            {props.renderOverlayView ? (
                                <Overlay2 transitionDuration={0} isOpen={props.isOverlayOpen} />
                            ) : (
                                <div>Another View</div>
                            )}
                        </div>
                    );
                }

                // Rendering the component with closed overlay (how it will happen in most of the real apps)
                const { rerender } = renderWithOverlaysProvider(
                    <WrapperWithNavigation renderOverlayView={true} isOverlayOpen={false} />,
                );

                // Opening the overlay manually to emulate the real app behavior
                rerender(<WrapperWithNavigation renderOverlayView={true} isOverlayOpen={true} />);

                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(true);

                // Emulating the user navigation to another view
                rerender(<WrapperWithNavigation renderOverlayView={false} isOverlayOpen={true} />);

                expect(document.body.classList.contains(Classes.OVERLAY_OPEN)).toBe(false);
            });
        });

        it("should call lifecycle methods as expected", async () => {
            // these lifecycles are passed directly to CSSTransition from react-transition-group
            // so we do not need to test these extensively. one integration test should do.
            const onClosed = spy();
            const onClosing = spy();
            const onOpened = spy();
            const onOpening = spy();

            const { rerender } = renderWithOverlaysProvider(
                <Overlay2
                    isOpen={true}
                    usePortal={false}
                    // transition duration shorter than timeout below to ensure it's done
                    transitionDuration={8}
                    onClosed={onClosed}
                    onClosing={onClosing}
                    onOpened={onOpened}
                    onOpening={onOpening}
                >
                    <strong tabIndex={0}>Overlay2 content!</strong>
                </Overlay2>,
            );

            // Wait for onOpening to be called
            await waitFor(() => expect(onOpening.calledOnce, "onOpening").toBe(true));
            expect(onOpened.calledOnce, "onOpened not called yet").toBe(false);

            // Wait for transition to complete and onOpened to be called
            await waitFor(() => expect(onOpened.calledOnce, "onOpened").toBe(true), { timeout: 100 });

            // on*ed called after transition completes
            expect(onOpened.calledOnce, "onOpened").toBe(true);

            rerender(
                <Overlay2
                    isOpen={false}
                    usePortal={false}
                    transitionDuration={8}
                    onClosed={onClosed}
                    onClosing={onClosing}
                    onOpened={onOpened}
                    onOpening={onOpening}
                >
                    <strong tabIndex={0}>Overlay2 content!</strong>
                </Overlay2>,
            );

            // Wait for onClosing to be called when prop changes
            await waitFor(() => expect(onClosing.calledOnce, "onClosing").toBe(true), { timeout: 200 });

            // Wait for transition to complete and onClosed to be called
            await waitFor(() => expect(onClosed.calledOnce, "onClosed").toBe(true), { timeout: 200 });
        });
    });
});
