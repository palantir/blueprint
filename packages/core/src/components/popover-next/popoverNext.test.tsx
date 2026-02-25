/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterAll, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import * as Errors from "../../common/errors";
import { Button, PopupKind, Tooltip } from "../../components";
import type { PopoverInteractionKind } from "../popover/popoverProps";

import { PopoverNext } from "./popoverNext";

describe("<PopoverNext>", () => {
    describe("validation", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

        beforeEach(() => warnSpy.mockClear());
        afterAll(() => warnSpy.mockRestore());

        it("throws error if given no target", () => {
            render(<PopoverNext />);

            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_REQUIRES_TARGET);
        });

        it("warns if given > 1 target elements", () => {
            render(
                <PopoverNext>
                    <Button />
                    <article />
                </PopoverNext>,
            );

            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_TOO_MANY_CHILDREN);
        });

        it("warns if given children and renderTarget prop", () => {
            render(<PopoverNext renderTarget={() => <span>"boom"</span>}>pow</PopoverNext>);

            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_DOUBLE_TARGET);
        });

        it("warns if given targetProps and renderTarget", () => {
            render(<PopoverNext targetProps={{ role: "none" }} renderTarget={() => <span>"boom"</span>} />);
            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_TARGET_PROPS_WITH_RENDER_TARGET);
        });

        it("warns if attempting to open a popover with empty content", () => {
            render(
                <PopoverNext content={undefined} isOpen={true}>
                    {"target"}
                </PopoverNext>,
            );

            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_EMPTY_CONTENT);
        });

        it("warns if backdrop enabled when rendering inline", () => {
            render(
                <PopoverNext content={"content"} hasBackdrop={true} usePortal={false}>
                    {"target"}
                </PopoverNext>,
            );

            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE);
        });

        it("warns and disables if given undefined content", async () => {
            const { container } = render(
                <PopoverNext content={undefined} isOpen={true} usePortal={false}>
                    <Button />
                </PopoverNext>,
            );

            expect(container.querySelector(`.${Classes.OVERLAY}`)).not.toBeInTheDocument();
            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_EMPTY_CONTENT);
        });

        it("warns and disables if given empty string content", () => {
            const EMPTY_STRING = "    ";
            const { container } = render(
                <PopoverNext content={EMPTY_STRING} isOpen={true} usePortal={false}>
                    <Button />
                </PopoverNext>,
            );

            expect(container.querySelector(`.${Classes.OVERLAY}`)).not.toBeInTheDocument();
            expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_WARN_EMPTY_CONTENT);
        });

        describe("throws error if backdrop enabled with non-CLICK interactionKind", () => {
            runErrorTest("hover");
            runErrorTest("hover-target");
            runErrorTest("click-target");

            it("doesn't throw error for CLICK", () => {
                expect(() => <PopoverNext hasBackdrop={true} interactionKind="click" />).not.toThrow();
            });

            function runErrorTest(interactionKind: PopoverInteractionKind) {
                it(interactionKind, () => {
                    render(
                        <PopoverNext content={<div />} hasBackdrop={true} interactionKind={interactionKind}>
                            <Button />
                        </PopoverNext>,
                    );

                    expect(warnSpy).toHaveBeenCalledWith(Errors.POPOVER_HAS_BACKDROP_INTERACTION);
                });
            }
        });
    });

    describe("rendering", () => {
        it("applies className to the target wrapper element", () => {
            const { container } = render(
                <PopoverNext className="my-custom-class" content="content">
                    <Button text="target" />
                </PopoverNext>,
            );
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(popoverTarget).toHaveClass("my-custom-class");
        });

        it("adds POPOVER_OPEN class to target when the popover is open", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext content="content">
                    <Button text="target" />
                </PopoverNext>,
            );
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(popoverTarget).toBeInTheDocument();
            expect(popoverTarget).not.toHaveClass(Classes.POPOVER_OPEN);

            await user.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(popoverTarget).toHaveClass(Classes.POPOVER_OPEN));
        });

        it("renders Portal when usePortal=true", async () => {
            const user = userEvent.setup();
            const { baseElement } = render(
                <PopoverNext content="content" usePortal={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());
            expect(baseElement.querySelector(`.${Classes.PORTAL}`)).toBeInTheDocument();
        });

        it("renders to specified container correctly", async () => {
            // setup: create a container
            const container = document.createElement("div");
            document.body.appendChild(container);

            render(
                <PopoverNext content="content" isOpen={true} portalContainer={container}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());
            expect(container.querySelector(`.${Classes.POPOVER_CONTENT}`)).toBeInTheDocument();

            // cleanup
            document.body.removeChild(container);
        });

        it("does not render Portal when usePortal=false", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext content="content" isOpen={true} usePortal={false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());
            expect(container.querySelector(`.${Classes.PORTAL}`)).not.toBeInTheDocument();
        });

        it("hasBackdrop=true renders backdrop element", async () => {
            const { baseElement } = render(
                <PopoverNext content="content" hasBackdrop={true} isOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());
            expect(baseElement.querySelector(`.${Classes.POPOVER_BACKDROP}`)).toBeInTheDocument();
        });

        it("hasBackdrop=false does not render backdrop element", async () => {
            const { container } = render(
                <PopoverNext content="content" hasBackdrop={false} isOpen={true} usePortal={false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());
            expect(container.querySelector(`.${Classes.POPOVER_BACKDROP}`)).not.toBeInTheDocument();
        });

        it("targetTagName renders the right elements", () => {
            const { container } = render(
                <PopoverNext content="content" targetTagName="address">
                    <Button text="target" />
                </PopoverNext>,
            );
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(popoverTarget).toBeInTheDocument();
            expect(popoverTarget!.tagName).toBe("ADDRESS");
        });

        it("allows user to apply dark theme explicitly", () => {
            const { container } = render(
                <PopoverNext content="content" isOpen={true} popoverClassName={Classes.DARK} usePortal={false}>
                    <Button text="target" />
                </PopoverNext>,
            );
            const popoverElement = container.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).toBeInTheDocument();
            expect(popoverElement).toHaveClass(Classes.DARK);
        });

        it("renders with aria-haspopup attr", () => {
            const { container } = render(
                <PopoverNext content="content" isOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(container.querySelector("[aria-haspopup='menu']")).toBeInTheDocument();
        });

        it("sets aria-haspopup attr base on popupKind", () => {
            const { container } = render(
                <PopoverNext content="content" isOpen={true} popupKind={PopupKind.DIALOG}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(container.querySelector("[aria-haspopup='dialog']")).toBeInTheDocument();
        });

        it("renders without aria-haspopup attr for hover interaction", () => {
            const { container } = render(
                <PopoverNext content="content" interactionKind="hover-target" isOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(container.querySelector("[aria-haspopup]")).not.toBeInTheDocument();
        });
    });

    describe("basic functionality", () => {
        it("inherits dark theme from trigger ancestor", () => {
            const { baseElement } = render(
                <div className={Classes.DARK}>
                    <PopoverNext content="content" inheritDarkTheme={true} isOpen={true}>
                        <Button text="target" />
                    </PopoverNext>
                </div>,
            );

            const popoverElement = baseElement.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).toBeInTheDocument();
            expect(popoverElement).toHaveClass(Classes.DARK);
        });

        it("inheritDarkTheme=false disables inheriting dark theme from trigger ancestor", () => {
            const { baseElement } = render(
                <div className={Classes.DARK}>
                    <PopoverNext content="content" inheritDarkTheme={false} isOpen={true}>
                        <Button text="target" />
                    </PopoverNext>
                </div>,
            );

            const popoverElement = baseElement.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).toBeInTheDocument();
            expect(popoverElement).not.toHaveClass(Classes.DARK);
        });

        it("supports overlay lifecycle props", async () => {
            const user = userEvent.setup();
            const onOpening = vi.fn();
            render(
                <PopoverNext content="content" onOpening={onOpening}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            expect(onOpening).toHaveBeenCalledOnce();
        });

        it("escape key closes popover", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="content" canEscapeKeyClose={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => {
                expect(screen.getByText("content")).toBeInTheDocument();
            });

            await user.keyboard("{Escape}");

            await waitFor(() => {
                expect(screen.queryByText("content")).not.toBeInTheDocument();
            });
        });
    });

    describe("focus management", () => {
        it("returns focus to target element when closed with shouldReturnFocusOnClose={true} (default)", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    shouldReturnFocusOnClose={true}
                    usePortal={false}
                >
                    <Button text="target" />
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            await user.click(targetButton);

            const overlay = container.querySelector(`.${Classes.OVERLAY}`);

            await waitFor(() => {
                expect(overlay).toBeInTheDocument();
                expect(overlay).toHaveClass(Classes.OVERLAY_OPEN);
                expect(overlay).toContainElement(document.activeElement as HTMLElement);
            });

            const closeButton = screen.getByRole("button", { name: "close" });

            await user.click(closeButton);

            await waitFor(() => {
                expect(overlay).not.toHaveClass(Classes.OVERLAY_OPEN);
                expect(targetButton).toBe(document.activeElement);
            });
        });

        it("does not return focus to target element when closed with shouldReturnFocusOnClose={false}", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    shouldReturnFocusOnClose={false}
                    usePortal={false}
                >
                    <Button text="target" />
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            await user.click(targetButton);

            const overlay = container.querySelector(`.${Classes.OVERLAY}`);

            await waitFor(() => {
                expect(overlay).toBeInTheDocument();
                expect(overlay).toHaveClass(Classes.OVERLAY_OPEN);
                expect(overlay).toContainElement(document.activeElement as HTMLElement);
            });

            const closeButton = screen.getByRole("button", { name: "close" });

            await user.click(closeButton);

            await waitFor(() => {
                expect(overlay).not.toHaveClass(Classes.OVERLAY_OPEN);
                expect(targetButton).not.toBe(document.activeElement);
            });
        });
    });

    describe("openOnTargetFocus", () => {
        describe("if true (default)", () => {
            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER', () => {
                render(
                    <PopoverNext content="content" interactionKind="hover">
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).toHaveAttribute("tabindex", "0");
            });

            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER_TARGET_ONLY', () => {
                render(
                    <PopoverNext content="content" interactionKind="hover-target">
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).toHaveAttribute("tabindex", "0");
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                render(
                    <PopoverNext content="content" interactionKind="click">
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <PopoverNext content="content" interactionKind="click-target">
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("does not add tabindex to target's child node when disabled=true", () => {
                render(
                    <PopoverNext content="content" interactionKind="hover" disabled={true}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("opens popover on target focus when interactionKind is HOVER", async () => {
                render(
                    <PopoverNext content="content" interactionKind="hover" enforceFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                await waitFor(() => {
                    expect(screen.getByText("content")).toBeInTheDocument();
                    expect(targetButton).toBe(document.activeElement);
                });
            });

            it("opens popover on target focus when interactionKind is HOVER_TARGET_ONLY", async () => {
                render(
                    <PopoverNext content="content" interactionKind="hover-target" enforceFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                await waitFor(() => {
                    expect(screen.getByText("content")).toBeInTheDocument();
                    expect(targetButton).toBe(document.activeElement);
                });
            });

            it("does not open popover on target focus when interactionKind is CLICK", async () => {
                render(
                    <PopoverNext content="content" interactionKind="click">
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(targetButton).toBe(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <PopoverNext content="content" interactionKind="click-target">
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(targetButton).toBe(document.activeElement);
            });
        });

        describe("if false", () => {
            it("does not add tabindex to target's child node when interactionKind is HOVER", () => {
                render(
                    <PopoverNext content="content" interactionKind="hover" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("should not add `tabindex` to target's child node when interactionKind is `HOVER_TARGET_ONLY`", () => {
                render(
                    <PopoverNext content="content" interactionKind="hover-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                render(
                    <PopoverNext content="content" interactionKind="click" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <PopoverNext content="content" interactionKind="click-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.getByRole("button", { name: "target" })).not.toHaveAttribute("tabindex");
            });

            it("does not open popover on target focus when interactionKind is HOVER", () => {
                render(
                    <PopoverNext content="content" interactionKind="hover" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(targetButton).toBe(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is HOVER_TARGET_ONLY", () => {
                render(
                    <PopoverNext content="content" interactionKind="hover-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(targetButton).toBe(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is CLICK", () => {
                render(
                    <PopoverNext content="content" interactionKind="click" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(targetButton).toBe(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <PopoverNext content="content" interactionKind="click-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(targetButton).toBe(document.activeElement);
            });
        });
    });

    describe("in controlled mode", () => {
        it("state respects isOpen prop", () => {
            const { rerender } = render(
                <PopoverNext content="content" isOpen={false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(screen.queryByText("content")).not.toBeInTheDocument();

            rerender(
                <PopoverNext content="content" isOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(screen.getByText("content")).toBeInTheDocument();
        });

        it("state does not update on user (click) interaction", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="content" isOpen={false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("state does not update on user (key) interaction", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="content" canEscapeKeyClose={true} isOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(screen.getByText("content")).toBeInTheDocument();

            await user.keyboard("{Escape}");

            expect(screen.getByText("content")).toBeInTheDocument();
        });

        describe("disabled=true takes precedence over isOpen=true", () => {
            it("on mount", () => {
                render(
                    <PopoverNext content="content" disabled={true} isOpen={true}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.queryByText("content")).not.toBeInTheDocument();
            });

            it("onInteraction not called if changing from closed to open (b/c popover is still closed)", () => {
                const onInteraction = vi.fn();
                const { rerender } = render(
                    <PopoverNext content="content" disabled={true} isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(onInteraction).not.toHaveBeenCalled();

                rerender(
                    <PopoverNext content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(onInteraction).not.toHaveBeenCalled();
            });

            it("onInteraction not called if changing from open to closed (b/c popover was already closed)", () => {
                const onInteraction = vi.fn();
                const { rerender } = render(
                    <PopoverNext content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(onInteraction).not.toHaveBeenCalled();

                rerender(
                    <PopoverNext content="content" disabled={true} isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(screen.queryByText("content")).not.toBeInTheDocument();
                expect(onInteraction).not.toHaveBeenCalled();
            });

            it("onInteraction called if open and changing to disabled (b/c popover will close)", async () => {
                const onInteraction = vi.fn();
                const { rerender } = render(
                    <PopoverNext content="content" disabled={false} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

                expect(onInteraction).not.toHaveBeenCalled();

                rerender(
                    <PopoverNext content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());

                expect(onInteraction).toHaveBeenCalled();
            });

            it("onInteraction called if open and changing to not-disabled (b/c popover will open)", async () => {
                const onInteraction = vi.fn();
                const { rerender } = render(
                    <PopoverNext content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                expect(onInteraction).not.toHaveBeenCalled();

                rerender(
                    <PopoverNext content="content" disabled={false} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

                expect(onInteraction).toHaveBeenCalled();
            });
        });

        it("onClose is invoked with event when popover would close", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    isOpen={true}
                    onClose={onClose}
                >
                    <Button text="target" />
                </PopoverNext>,
            );
            const closeButton = screen.getByRole("button", { name: "close" });

            await waitFor(() => expect(closeButton).toBeInTheDocument());

            await user.click(screen.getByRole("button", { name: "close" }));

            expect(onClose).toHaveBeenCalledOnce();
            expect(onClose.mock.calls[0][0]).not.toBeNull();
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed popover target is clicked", async () => {
                const user = userEvent.setup();
                const onInteraction = vi.fn();
                render(
                    <PopoverNext content="content" isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                await user.click(screen.getByRole("button", { name: "target" }));

                expect(onInteraction).toHaveBeenCalledOnce();
                expect(onInteraction).toHaveBeenCalledWith(true, expect.anything());
            });

            it("is invoked with `false` when open popover target is clicked", async () => {
                const user = userEvent.setup();
                const onInteraction = vi.fn();
                const { container } = render(
                    <PopoverNext content="content" isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

                expect(target).not.toBeNull();

                await user.click(target!);

                expect(onInteraction).toHaveBeenCalledOnce();
                expect(onInteraction).toHaveBeenCalledWith(false, expect.anything());
            });

            it("is invoked with `false` when open modal popover backdrop is clicked", async () => {
                const user = userEvent.setup();
                const onInteraction = vi.fn();
                render(
                    <PopoverNext
                        // @ts-ignore
                        backdropProps={{ "data-testid": "test-backdrop" }}
                        content="content"
                        hasBackdrop={true}
                        isOpen={true}
                        onInteraction={onInteraction}
                    >
                        <Button text="target" />
                    </PopoverNext>,
                );
                const backdrop = screen.getByTestId("test-backdrop");

                await user.click(backdrop);

                expect(onInteraction).toHaveBeenCalledOnce();
                expect(onInteraction).toHaveBeenCalledWith(false, expect.anything());
            });

            it("is invoked with `false` when clicking POPOVER_DISMISS", async () => {
                const user = userEvent.setup();
                const onInteraction = vi.fn();
                render(
                    <PopoverNext
                        content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                        isOpen={true}
                        onInteraction={onInteraction}
                    >
                        <Button text="target" />
                    </PopoverNext>,
                );
                const closeButton = screen.getByRole("button", { name: "close" });

                await waitFor(() => expect(closeButton).toBeInTheDocument());

                await user.click(closeButton);

                expect(onInteraction).toHaveBeenCalledOnce();
                expect(onInteraction).toHaveBeenCalledWith(false, expect.anything());
            });

            it("is invoked with `false` when the document is mousedowned", async () => {
                const user = userEvent.setup();
                const onInteraction = vi.fn();
                render(
                    <PopoverNext content="content" isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </PopoverNext>,
                );

                await user.click(document.documentElement);

                expect(onInteraction).toHaveBeenCalledOnce();
                expect(onInteraction).toHaveBeenCalledWith(false, expect.anything());
            });
        });

        it("does not apply active class to target when open", () => {
            render(
                <PopoverNext content="content" isOpen={true} interactionKind="click">
                    <Button text="target" />
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            expect(targetButton).not.toHaveClass(Classes.ACTIVE);
        });
    });

    describe("in uncontrolled mode", () => {
        it("setting defaultIsOpen=true renders open popover", async () => {
            render(
                <PopoverNext content="content" defaultIsOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());
        });

        it("with defaultIsOpen=true, popover can still be closed", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content={<Button className={Classes.POPOVER_DISMISS}>close</Button>} defaultIsOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument());

            await user.click(screen.getByRole("button", { name: "close" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "close" })).not.toBeInTheDocument());
        });

        it("CLICK_TARGET_ONLY works properly", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext content="content" interactionKind="click-target">
                    <Button text="target" />
                </PopoverNext>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(target).not.toBeNull();

            await user.click(target!);

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

            await user.click(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());
        });

        it("HOVER_TARGET_ONLY works properly", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext content="content" interactionKind="hover-target">
                    <Button text="target" />
                </PopoverNext>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(target).not.toBeNull();

            await user.hover(target!);

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

            await user.unhover(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());
        });

        it("inline HOVER_TARGET_ONLY works properly when openOnTargetFocus={false}", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext content="content" interactionKind="hover-target" openOnTargetFocus={false}>
                    <Button text="target" />
                </PopoverNext>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(target).not.toBeNull();

            await user.hover(target!);

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

            await user.unhover(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());
        });

        it("inline HOVER works properly", async () => {
            const user = userEvent.setup();
            const { container } = render(
                <PopoverNext content="content" interactionKind="hover">
                    <Button text="target" />
                </PopoverNext>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);
            expect(target).not.toBeNull();

            await user.hover(target!);

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

            await user.unhover(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());
        });

        it("clicking POPOVER_DISMISS closes popover when usePortal=true", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    defaultIsOpen={true}
                    usePortal={true}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument());

            await user.click(screen.getByRole("button", { name: "close" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "close" })).not.toBeInTheDocument());
        });

        it("clicking POPOVER_DISMISS closes popover when usePortal=false", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    defaultIsOpen={true}
                    usePortal={false}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument());

            await user.click(screen.getByRole("button", { name: "close" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "close" })).not.toBeInTheDocument());
        });

        it("pressing Escape closes popover when canEscapeKeyClose=true and usePortal=false", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="content" canEscapeKeyClose={true} usePortal={false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

            await user.keyboard("{Escape}");

            await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());
        });

        it("setting disabled=true prevents opening popover", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="content" disabled={true} interactionKind="click-target">
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("setting disabled=true hides open popover", async () => {
            const user = userEvent.setup();
            const { rerender } = render(
                <PopoverNext content="content" interactionKind="click-target">
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

            rerender(
                <PopoverNext content="content" interactionKind="click-target" disabled={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.queryByText("content")).not.toBeInTheDocument());
        });

        it("console.warns if onInteraction is set", () => {
            const localWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(
                <PopoverNext content="content" onInteraction={() => false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(localWarnSpy.mock.calls[0][0]).toBe(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
            localWarnSpy.mockRestore();
        });

        it("does apply active class to target when open", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="content" interactionKind="click">
                    <Button text="target" />
                </PopoverNext>,
            );

            await user.click(screen.getByRole("button", { name: "target" }));

            expect(screen.getByRole("button", { name: "target" })).toHaveClass(Classes.ACTIVE);
        });
    });

    describe("when composed with <Tooltip>", () => {
        it("shows tooltip on hover", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="popover content">
                    <Tooltip content="tooltip content">
                        <Button text="target" />
                    </Tooltip>
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            await user.hover(targetButton);

            await waitFor(() => expect(screen.getByText("tooltip content")).toBeInTheDocument());
        });

        it("shows popover on click", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="popover content">
                    <Tooltip content="tooltip content">
                        <Button text="target" />
                    </Tooltip>
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            await user.click(targetButton);

            await waitFor(() => expect(screen.getByText("popover content")).toBeInTheDocument());

            expect(screen.queryByText("tooltip content")).not.toBeInTheDocument();
        });

        it("the target is focusable", () => {
            render(
                <PopoverNext content="popover content">
                    <Tooltip content="tooltip content">
                        <Button text="target" />
                    </Tooltip>
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            expect(targetButton).toHaveAttribute("tabindex", "0");
        });

        describe("when disabled=true", () => {
            it("shows tooltip on hover", async () => {
                const user = userEvent.setup();
                render(
                    <PopoverNext content="popover content" disabled={true}>
                        <Tooltip content="tooltip content">
                            <Button text="target" />
                        </Tooltip>
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                await user.hover(targetButton);

                await waitFor(() => expect(screen.getByText("tooltip content")).toBeInTheDocument());
            });

            it("does not show popover on click", async () => {
                const user = userEvent.setup();
                render(
                    <PopoverNext content="popover content" disabled={true}>
                        <Tooltip content="tooltip content">
                            <Button text="target" />
                        </Tooltip>
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                await user.click(targetButton);

                expect(screen.queryByText("popover content")).not.toBeInTheDocument();
            });

            it("the target is focusable", () => {
                render(
                    <PopoverNext content="popover content" disabled={true}>
                        <Tooltip content="tooltip content">
                            <Button text="target" />
                        </Tooltip>
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                expect(targetButton).toHaveAttribute("tabindex", "0");
            });
        });
    });

    describe("when composed with a disabled <Tooltip>", () => {
        it("does not show tooltip on hover", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="popover content">
                    <Tooltip content="tooltip content" disabled={true}>
                        <Button text="target" />
                    </Tooltip>
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            await user.hover(targetButton);

            expect(screen.queryByText("tooltip content")).not.toBeInTheDocument();
        });

        it("shows popover on click", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext content="popover content">
                    <Tooltip content="tooltip content" disabled={true}>
                        <Button text="target" />
                    </Tooltip>
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            await user.click(targetButton);

            await waitFor(() => expect(screen.getByText("popover content")).toBeInTheDocument());
        });

        it("the target is not focusable", () => {
            render(
                <PopoverNext content="popover content">
                    <Tooltip content="tooltip content" disabled={true}>
                        <Button text="target" />
                    </Tooltip>
                </PopoverNext>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            expect(targetButton).not.toHaveAttribute("tabindex");
        });

        describe("when disabled=true", () => {
            it("does not show tooltip on hover", async () => {
                const user = userEvent.setup();
                render(
                    <PopoverNext content="popover content" disabled={true}>
                        <Tooltip content="tooltip content" disabled={true}>
                            <Button text="target" />
                        </Tooltip>
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                await user.hover(targetButton);

                expect(screen.queryByText("tooltip content")).not.toBeInTheDocument();
            });

            it("does not show popover on click", async () => {
                const user = userEvent.setup();
                render(
                    <PopoverNext content="popover content" disabled={true}>
                        <Tooltip content="tooltip content" disabled={true}>
                            <Button text="target" />
                        </Tooltip>
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                await user.click(targetButton);

                expect(screen.queryByText("popover content")).not.toBeInTheDocument();
            });

            it("the target is not focusable", () => {
                render(
                    <PopoverNext content="popover content" disabled={true}>
                        <Tooltip content="tooltip content" disabled={true}>
                            <Button text="target" />
                        </Tooltip>
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                expect(targetButton).not.toHaveAttribute("tabindex");
            });
        });
    });

    describe("Popper.js integration", () => {
        it("renders arrow element by default", async () => {
            const { baseElement } = render(
                <PopoverNext content="content" isOpen={true}>
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(baseElement.querySelector(`.${Classes.POPOVER_ARROW}`)).toBeInTheDocument());
        });

        it("arrow can be disabled by setting arrow={false}", () => {
            const { baseElement } = render(
                <PopoverNext content="content" isOpen={true} arrow={false}>
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(baseElement.querySelector(`.${Classes.POPOVER_ARROW}`)).not.toBeInTheDocument();
        });

        it("matches target width via custom modifier", async () => {
            const { container } = render(
                <PopoverNext
                    content="content"
                    isOpen={true}
                    matchTargetWidth={true}
                    placement="bottom"
                    usePortal={false}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            const targetElement = screen.getByRole("button", { name: "target" });
            const popoverElement = container.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).not.toBeNull();

            await waitFor(() => {
                const diff = Math.abs((popoverElement?.clientWidth ?? 0) - targetElement.clientWidth);
                expect(diff).toBeLessThanOrEqual(5);
            });
        });
    });

    describe("closing on click", () => {
        it("Classes.POPOVER_DISMISS closes on click", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS}>dismiss</Button>}
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument());

            await user.click(screen.getByRole("button", { name: "dismiss" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "dismiss" })).not.toBeInTheDocument());
        });

        it("Classes.POPOVER_DISMISS_OVERRIDE does not close", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    content={
                        <span className={Classes.POPOVER_DISMISS}>
                            <Button className={Classes.POPOVER_DISMISS_OVERRIDE}>dismiss</Button>
                        </span>
                    }
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();

            await user.click(screen.getByRole("button", { name: "dismiss" }));

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();
        });

        it(":disabled does not close", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    content={<Button className={Classes.POPOVER_DISMISS} disabled={true} text="dismiss" />}
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();

            await user.click(screen.getByRole("button", { name: "dismiss" }));

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();
        });

        it("Classes.DISABLED does not close", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    content={
                        // testing nested behavior too
                        <div className={Classes.DISABLED}>
                            <Button className={Classes.POPOVER_DISMISS}>dismiss</Button>
                        </div>
                    }
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </PopoverNext>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();

            await user.click(screen.getByRole("button", { name: "dismiss" }));

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();
        });

        it("captureDismiss={true} inner dismiss does not close outer popover", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    captureDismiss={true}
                    defaultIsOpen={true}
                    content={
                        <PopoverNext
                            captureDismiss={true}
                            defaultIsOpen={true}
                            usePortal={false}
                            content={<Button className={Classes.POPOVER_DISMISS} text="dismiss" />}
                        >
                            <Button text="inner target" />
                        </PopoverNext>
                    }
                >
                    <Button text="outer target" />
                </PopoverNext>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();

            await user.click(screen.getByRole("button", { name: "dismiss" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "dismiss" })).not.toBeInTheDocument());

            expect(screen.getByRole("button", { name: "inner target" })).toBeInTheDocument();
        });

        it("captureDismiss={false} inner dismiss closes outer popover", async () => {
            const user = userEvent.setup();
            render(
                <PopoverNext
                    captureDismiss={true}
                    defaultIsOpen={true}
                    content={
                        <PopoverNext
                            captureDismiss={false}
                            defaultIsOpen={true}
                            usePortal={false}
                            content={<Button className={Classes.POPOVER_DISMISS} text="dismiss" />}
                        >
                            <Button text="inner target" />
                        </PopoverNext>
                    }
                >
                    <Button text="outer target" />
                </PopoverNext>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).toBeInTheDocument();

            await user.click(screen.getByRole("button", { name: "dismiss" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "dismiss" })).not.toBeInTheDocument());
            await waitFor(() => expect(screen.queryByRole("button", { name: "inner target" })).not.toBeInTheDocument());
        });
    });

    describe("key interactions on Button target", () => {
        describe("Space key down opens click interaction popover", () => {
            it("when autoFocus={true}", async () => {
                const user = userEvent.setup();
                const { container } = render(
                    <PopoverNext content="content" autoFocus={true} usePortal={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();
                await user.keyboard(" ");

                await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

                const overlay = container.querySelector(`.${Classes.OVERLAY}`);
                expect(overlay).toContainElement(document.activeElement as HTMLElement);
            });

            it("when autoFocus={false}", async () => {
                const user = userEvent.setup();
                render(
                    <PopoverNext content="content" autoFocus={false}>
                        <Button text="target" />
                    </PopoverNext>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();
                await user.keyboard(" ");

                await waitFor(() => expect(screen.getByText("content")).toBeInTheDocument());

                expect(targetButton).toBe(document.activeElement);
            });
        });
    });

    describe("compatibility", () => {
        it("renderTarget type definition allows sending props to child components", () => {
            render(
                <PopoverNext
                    usePortal={false}
                    hoverCloseDelay={0}
                    hoverOpenDelay={0}
                    content="content"
                    popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                    renderTarget={({ isOpen, ref, ...props }) => (
                        <Button
                            data-testid="target-button"
                            ref={ref}
                            onClick={props.onClick}
                            text="Target"
                            {...props}
                        />
                    )}
                />,
            );
        });
    });
});
