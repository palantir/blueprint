/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";

import { PopoverNext } from "./popoverNext";
import type { PopoverNextProps } from "./popoverNextProps";

const POPOVER_PROPS: PopoverNextProps = {
    arrow: false,
    content: <button data-testid="content">Content</button>,
    hoverCloseDelay: 0,
    hoverOpenDelay: 0,
    interactionKind: "hover",
    middleware: { offset: { mainAxis: 30 } },
    placement: "right-start",
    renderTarget: ({ isOpen: _isOpen, ...targetProps }) => (
        <button {...targetProps} data-testid="target">
            Target
        </button>
    ),
    safePolygon: { requireIntent: false },
    transitionDuration: 0,
};

describe("<PopoverNext> safePolygon", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1000);
        vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(1000);
        vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(150);
        vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(200);
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            if (
                this.dataset.testid === "target" ||
                this.getAttribute("aria-label") === "Wrapped target" ||
                this.classList.contains("test-submenu-target")
            ) {
                return new DOMRect(100, 100, 100, 30);
            }
            if (this.dataset.testid === "child-target") {
                return new DOMRect(230, 150, 150, 30);
            }
            if (this.classList.contains(Classes.POPOVER_TRANSITION_CONTAINER)) {
                return this.querySelector('[data-testid="child-content"]') == null
                    ? new DOMRect(230, 100, 150, 200)
                    : new DOMRect(410, 150, 150, 200);
            }
            return new DOMRect(0, 0, 1000, 1000);
        });
    });

    afterEach(async () => {
        cleanup();
        await advanceTimers(0);
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it.each([false, true])("keeps a diagonal path open with usePortal=%s", async usePortal => {
        render(<PopoverNext {...POPOVER_PROPS} usePortal={usePortal} />);
        const target = screen.getByTestId("target");
        await openPopover(target);

        fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(document.body, { clientX: 215, clientY: 160 });
        await advanceTimers(100);
        expect(screen.getByTestId("content")).toBeInTheDocument();

        const content = screen.getByTestId("content");
        fireEvent.mouseMove(content, { clientX: 240, clientY: 190 });
        fireEvent.mouseEnter(content);
        await advanceTimers(100);
        expect(content).toBeInTheDocument();

        fireEvent.mouseLeave(content, { clientX: 381, clientY: 190 });
        fireEvent.mouseMove(document.body, { clientX: 450, clientY: 400 });
        await advanceTimers(0);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });

    it("supports the default polygon options with true", async () => {
        render(<PopoverNext {...POPOVER_PROPS} safePolygon={true} />);
        const target = screen.getByTestId("target");
        await openPopover(target);

        fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(document.body, { clientX: 215, clientY: 160 });
        expect(screen.getByTestId("content")).toBeInTheDocument();
        fireEvent.mouseMove(screen.getByTestId("content"), { clientX: 240, clientY: 190 });
        await advanceTimers(100);
        expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it.each([undefined, false])("preserves immediate hover closure when safePolygon=%s", async safePolygon => {
        render(<PopoverNext {...POPOVER_PROPS} safePolygon={safePolygon} />);
        const target = screen.getByTestId("target");
        await openPopover(target);

        fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(document.body, { clientX: 215, clientY: 160 });
        await advanceTimers(1);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });

    it("honors open and close delays and cancels opening when the pointer leaves early", async () => {
        render(<PopoverNext {...POPOVER_PROPS} hoverOpenDelay={100} hoverCloseDelay={100} />);
        const target = screen.getByTestId("target");
        fireEvent.mouseEnter(target);
        await advanceTimers(50);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
        fireEvent.mouseLeave(target);
        await advanceTimers(100);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();

        await openPopover(target, 100);
        fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(document.body, { clientX: 50, clientY: 400 });
        await advanceTimers(50);
        expect(screen.getByTestId("content")).toBeInTheDocument();
        await advanceTimers(50);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });

    it("retains controlled state and forwards hover events", async () => {
        const onInteraction = vi.fn();
        const onClose = vi.fn();
        const { rerender } = render(
            <PopoverNext {...POPOVER_PROPS} isOpen={false} onInteraction={onInteraction} onClose={onClose} />,
        );
        fireEvent.mouseEnter(screen.getByTestId("target"));
        await advanceTimers(0);
        expect(onInteraction).toHaveBeenCalledWith(true, expect.any(MouseEvent));
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();

        rerender(<PopoverNext {...POPOVER_PROPS} isOpen={true} onInteraction={onInteraction} onClose={onClose} />);
        await advanceTimers(0);
        fireEvent.mouseLeave(screen.getByTestId("target"), { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(document.body, { clientX: 50, clientY: 400 });
        await advanceTimers(0);
        expect(onInteraction).toHaveBeenLastCalledWith(false, expect.any(MouseEvent));
        expect(onClose).toHaveBeenCalledOnce();
        expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("preserves focus opening and blur closing", async () => {
        render(<PopoverNext {...POPOVER_PROPS} />);
        const target = screen.getByTestId("target");
        fireEvent.focus(target);
        await advanceTimers(0);
        expect(screen.getByTestId("content")).toBeInTheDocument();

        fireEvent.blur(target, { relatedTarget: document.body });
        await advanceTimers(1);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });

    it("does not reopen on pointer movement after Escape", async () => {
        render(<PopoverNext {...POPOVER_PROPS} />);
        const target = screen.getByTestId("target");
        await openPopover(target);
        fireEvent.keyDown(document, { code: "Escape", key: "Escape", keyCode: 27 });
        await advanceTimers(0);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
        fireEvent.mouseMove(target, { clientX: 150, clientY: 110 });
        await advanceTimers(0);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });

    it.each(["click", "hover-target"] satisfies Array<PopoverNextProps["interactionKind"]>)(
        "ignores safePolygon for %s interactions",
        async interactionKind => {
            render(<PopoverNext {...POPOVER_PROPS} interactionKind={interactionKind} />);
            const target = screen.getByTestId("target");
            fireEvent.mouseEnter(target);
            await advanceTimers(0);
            if (interactionKind === "click") {
                expect(screen.queryByTestId("content")).not.toBeInTheDocument();
                fireEvent.click(target);
                await advanceTimers(0);
            }
            expect(screen.getByTestId("content")).toBeInTheDocument();
            fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
            fireEvent.mouseMove(document.body, { clientX: 215, clientY: 160 });
            await advanceTimers(1);
            expect(screen.queryByTestId("content") != null).toBe(interactionKind === "click");
        },
    );

    it("cleans up pointer blocking when disabled or unmounted", async () => {
        const props = { ...POPOVER_PROPS, safePolygon: { blockPointerEvents: true } };
        const { rerender, unmount } = render(<PopoverNext {...props} />);
        await openPopover(screen.getByTestId("target"));
        expect(document.body.style.pointerEvents).toBe("none");

        rerender(<PopoverNext {...props} disabled={true} />);
        await advanceTimers(0);
        expect(document.body.style.pointerEvents).toBe("");
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
        fireEvent.mouseEnter(screen.getByTestId("target"));
        await advanceTimers(0);
        expect(screen.queryByTestId("content")).not.toBeInTheDocument();

        rerender(<PopoverNext {...props} />);
        await openPopover(screen.getByTestId("target"));
        unmount();
        expect(document.body.style.pointerEvents).toBe("");
        expect(document.body).not.toHaveAttribute("data-floating-ui-safe-polygon");
    });

    it("preserves consumer pointer and click handlers on wrapped targets", async () => {
        const onPointerEnter = vi.fn();
        const onClick = vi.fn();
        render(
            <PopoverNext
                {...POPOVER_PROPS}
                renderTarget={undefined}
                targetProps={{ "aria-label": "Wrapped target", onClick, onPointerEnter, role: "group" }}
            >
                <button>Target</button>
            </PopoverNext>,
        );
        const target = screen.getByRole("group", { name: "Wrapped target" });
        fireEvent.pointerEnter(target, { pointerType: "mouse" });
        await openPopover(target);
        fireEvent.click(target);
        expect(onPointerEnter).toHaveBeenCalledOnce();
        expect(onClick).toHaveBeenCalledOnce();
        expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("keeps ancestors open when moving into a portaled submenu", async () => {
        render(
            <PopoverNext
                {...POPOVER_PROPS}
                content={
                    <PopoverNext
                        {...POPOVER_PROPS}
                        content={<button data-testid="child-content">Nested content</button>}
                        renderTarget={({ isOpen: _isOpen, ...targetProps }) => (
                            <button {...targetProps} data-testid="child-target">
                                Nested target
                            </button>
                        )}
                    />
                }
            />,
        );
        const target = screen.getByTestId("target");
        await openPopover(target, 0, "child-target");
        const childTarget = screen.getByTestId("child-target");
        fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(childTarget, { clientX: 250, clientY: 160 });
        await openPopover(childTarget, 0, "child-content");
        fireEvent.mouseLeave(childTarget, { clientX: 379, clientY: 179 });
        fireEvent.mouseMove(screen.getByTestId("child-content"), { clientX: 420, clientY: 230 });
        await advanceTimers(100);
        expect(screen.getByTestId("child-target")).toBeInTheDocument();
        expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    it("accepts safePolygon through MenuItem.popoverProps", async () => {
        render(
            <Menu>
                <MenuItem
                    text="Submenu"
                    popoverProps={{
                        className: "test-submenu-target",
                        hoverOpenDelay: 0,
                        safePolygon: { requireIntent: false },
                        transitionDuration: 0,
                    }}
                >
                    <MenuItem text="Nested action" />
                </MenuItem>
            </Menu>,
        );
        const target = screen.getByRole("menuitem", { name: /Submenu/ });
        fireEvent.mouseEnter(target);
        await advanceTimers(0);
        expect(screen.getByText("Nested action")).toBeInTheDocument();
        fireEvent.mouseLeave(target, { clientX: 199, clientY: 129 });
        fireEvent.mouseMove(document.body, { clientX: 215, clientY: 160 });
        await advanceTimers(100);
        expect(screen.getByText("Nested action")).toBeInTheDocument();
    });
});

async function openPopover(target: HTMLElement, delay = 0, contentTestId = "content") {
    fireEvent.mouseEnter(target, { clientX: 150, clientY: 110 });
    await advanceTimers(delay);
    expect(screen.getByTestId(contentTestId)).toBeInTheDocument();
}

async function advanceTimers(milliseconds: number) {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(milliseconds);
    });
    await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
    });
}
