/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Classes } from "../../common";

import { Menu } from "./menu";
import { MenuItem, type MenuItemProps } from "./menuItem";

describe("MenuItem submenu pointer navigation", () => {
    beforeEach(() => vi.useFakeTimers());

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it.each([
        ["right-start", false],
        ["left-start", false],
        ["right-start", true],
        ["left-start", true],
    ] as const)("allows diagonal movement into a %s submenu (usePortal=%s)", async (placement, usePortal) => {
        const { target, floating } = await openSubmenu({ placement, usePortal });
        const opensRight = placement === "right-start";

        // Leave the bottom of the parent item, then cross the next row diagonally.
        fireEvent.mouseLeave(target, { clientX: opensRight ? 580 : 620, clientY: 130 });
        fireEvent.mouseMove(document.body, { clientX: opensRight ? 640 : 560, clientY: 160 });
        await advanceTimers(1000);
        expect(target).toHaveClass(Classes.POPOVER_OPEN);

        fireEvent.mouseEnter(floating, { clientX: opensRight ? 730 : 470, clientY: 200 });
        fireEvent.mouseMove(screen.getByText("Child"), { clientX: opensRight ? 730 : 470, clientY: 200 });
        await advanceTimers(1000);
        expect(target).toHaveClass(Classes.POPOVER_OPEN);

        fireEvent.mouseLeave(floating, { clientX: opensRight ? 920 : 280, clientY: 350 });
        fireEvent.mouseMove(document.body, { clientX: opensRight ? 930 : 270, clientY: 360 });
        await advanceTimers();
        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);
    });

    it("closes when the pointer moves away from the submenu", async () => {
        const { target } = await openSubmenu();

        fireEvent.mouseLeave(target, { clientX: 580, clientY: 130 });
        fireEvent.mouseMove(document.body, { clientX: 540, clientY: 180 });
        await advanceTimers();

        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);
    });

    it("allows opting out through popoverProps", async () => {
        const { target } = await openSubmenu({ hoverSafePolygon: false });

        fireEvent.mouseLeave(target, { clientX: 580, clientY: 130 });
        fireEvent.mouseMove(document.body, { clientX: 640, clientY: 160 });
        await advanceTimers();

        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);
    });

    it("preserves click interaction overrides", async () => {
        renderMenu({ interactionKind: "click" });
        const target = getTarget();

        fireEvent.mouseEnter(target);
        await advanceTimers(300);
        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);

        fireEvent.click(target);
        await advanceTimers();
        expect(target).toHaveClass(Classes.POPOVER_OPEN);
    });

    it("honors hoverCloseDelay after leaving the safe area", async () => {
        const { target } = await openSubmenu({ hoverCloseDelay: 300 });

        fireEvent.mouseLeave(target, { clientX: 580, clientY: 130 });
        fireEvent.mouseMove(document.body, { clientX: 540, clientY: 180 });
        await advanceTimers(299);
        expect(target).toHaveClass(Classes.POPOVER_OPEN);

        await advanceTimers(1);
        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);
    });

    it("cancels a pending close when the pointer returns to the parent item", async () => {
        const { target } = await openSubmenu({ hoverCloseDelay: 300 });

        fireEvent.mouseLeave(target, { clientX: 580, clientY: 130 });
        fireEvent.mouseMove(document.body, { clientX: 540, clientY: 180 });
        await advanceTimers(100);
        fireEvent.mouseEnter(target, { clientX: 580, clientY: 115 });
        await advanceTimers(300);

        expect(target).toHaveClass(Classes.POPOVER_OPEN);
    });

    it("cancels a pending open when the pointer leaves before hoverOpenDelay", async () => {
        renderMenu({ hoverOpenDelay: 150 });
        const target = getTarget();

        fireEvent.mouseEnter(target);
        await advanceTimers(100);
        fireEvent.mouseLeave(target);
        await advanceTimers(100);

        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);
    });

    it("preserves focus and blur behavior", async () => {
        renderMenu();
        const target = getTarget();

        fireEvent.focus(target);
        await advanceTimers();
        expect(target).toHaveClass(Classes.POPOVER_OPEN);
        // Keyboard opening must not prevent unrelated mouse interactions.
        expect(document.body.style.pointerEvents).not.toBe("none");

        fireEvent.blur(target, { relatedTarget: document.body });
        await advanceTimers();
        expect(target).not.toHaveClass(Classes.POPOVER_OPEN);
    });

    it.each([false, true])("keeps ancestors open inside a nested submenu (usePortal=%s)", async usePortal => {
        const { target, floating } = await openSubmenu(
            {},
            <MenuItem text="Child" popoverProps={{ hoverOpenDelay: 0, usePortal }}>
                <MenuItem text="Grandchild" />
            </MenuItem>,
        );
        fireEvent.mouseLeave(target, { clientX: 700, clientY: 115 });
        fireEvent.mouseEnter(floating, { clientX: 730, clientY: 115 });
        fireEvent.mouseMove(screen.getByText("Child"), { clientX: 780, clientY: 115 });

        const nestedTarget = screen.getByText("Child").closest<HTMLElement>(`.${Classes.POPOVER_TARGET}`)!;
        fireEvent.mouseEnter(nestedTarget, { clientX: 780, clientY: 115 });
        await advanceTimers();

        const nestedFloating = screen
            .getByText("Grandchild")
            .closest<HTMLElement>(`.${Classes.POPOVER_TRANSITION_CONTAINER}`)!;
        fireEvent.mouseEnter(nestedFloating, { clientX: 920, clientY: 150 });
        fireEvent.mouseMove(screen.getByText("Grandchild"), { clientX: 920, clientY: 150 });
        await advanceTimers();

        expect(target).toHaveClass(Classes.POPOVER_OPEN);
        expect(nestedTarget).toHaveClass(Classes.POPOVER_OPEN);
    });

    it("removes pointer tracking when unmounted during diagonal movement", async () => {
        const onClose = vi.fn();
        const { target, unmount } = await openSubmenu({ onClose });

        fireEvent.mouseLeave(target, { clientX: 580, clientY: 130 });
        fireEvent.mouseMove(document.body, { clientX: 640, clientY: 160 });
        unmount();
        fireEvent.mouseMove(document.body, { clientX: 540, clientY: 180 });
        await advanceTimers(1000);

        expect(onClose).not.toHaveBeenCalled();
        expect(document.body.style.pointerEvents).toBe("");
    });
});

function renderMenu(popoverProps: MenuItemProps["popoverProps"] = {}, children = <MenuItem text="Child" />) {
    return render(
        <Menu>
            <MenuItem
                text="Parent"
                popoverProps={{
                    hoverOpenDelay: 0,
                    // JSDOM has no layout. Fix placement while mocking element bounds below.
                    modifiers: { flip: { options: { altAxis: false, mainAxis: false } } },
                    transitionDuration: 0,
                    ...popoverProps,
                }}
            >
                {children}
            </MenuItem>
            <MenuItem text="Sibling" />
        </Menu>,
    );
}

async function openSubmenu(popoverProps: MenuItemProps["popoverProps"] = {}, children?: React.JSX.Element) {
    const result = renderMenu(popoverProps, children);
    const target = getTarget();
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(new DOMRect(500, 100, 200, 30));
    fireEvent.mouseEnter(target, { clientX: 580, clientY: 115 });
    await advanceTimers();

    const floating = screen.getByText("Child").closest<HTMLElement>(`.${Classes.POPOVER_TRANSITION_CONTAINER}`)!;
    const left = popoverProps.placement === "left-start" ? 310 : 710;
    vi.spyOn(floating, "getBoundingClientRect").mockReturnValue(new DOMRect(left, 95, 180, 200));
    expect(target).toHaveClass(Classes.POPOVER_OPEN);
    return { ...result, floating, target };
}

function getTarget() {
    return screen.getByText("Parent").closest<HTMLElement>(`.${Classes.POPOVER_TARGET}`)!;
}

async function advanceTimers(time = 0) {
    await act(() => vi.advanceTimersByTimeAsync(time));
}
