/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import {
    arrow,
    autoPlacement,
    autoUpdate,
    flip,
    type Placement as FloatingPlacement,
    offset,
    shift,
    size,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import type { Boundary, RootBoundary } from "@popperjs/core";
import React from "react";
import type { Modifier } from "react-popper";

import { POPOVER_ARROW_SVG_SIZE } from "../popover/popoverArrow";
import { PopoverInteractionKind } from "../popover/popoverProps";
import type { Placement, PopperModifierOverrides } from "../popover/popoverSharedProps";

import {
    convertPopperArrowToFloatingArrow,
    convertPopperFlipToFloatingFlip,
    convertPopperOffsetToFloatingOffset,
    convertPopperPreventOverflowToFloatingShift,
} from "./popperMigrationUtils";

interface PopoverOptions {
    boundary?: Boundary;
    canEscapeKeyClose?: boolean;
    interactionKind?: PopoverInteractionKind;
    isOpen?: boolean;
    minimal?: boolean;
    modifiers?: PopperModifierOverrides;
    placement?: Placement;
    matchTargetWidth?: boolean;
    rootBoundary?: RootBoundary;
    onOpenChange?: (isOpen: boolean, event?: Event) => void;
}

function getIsFloatingPlacement(placement: Placement): placement is FloatingPlacement {
    return placement !== "auto" && placement !== "auto-start" && placement !== "auto-end";
}

export function usePopover({
    boundary,
    canEscapeKeyClose,
    interactionKind,
    isOpen = false,
    minimal,
    modifiers,
    placement = "auto",
    matchTargetWidth = false,
    rootBoundary,
    onOpenChange,
}: PopoverOptions = {}) {
    const arrowRef = React.useRef(null);
    const [isOpenState, setIsOpenState] = React.useState(isOpen);

    React.useEffect(() => {
        setIsOpenState(isOpen);
    }, [isOpen]);

    const handleOpenChange = React.useCallback(
        (nextOpen: boolean, event?: Event) => {
            // Always update internal state for proper synchronization
            setIsOpenState(nextOpen);

            // Also call the external callback if provided (for controlled components)
            if (onOpenChange) {
                onOpenChange(nextOpen, event);
            }
        },
        [onOpenChange],
    );

    const isArrowEnabled = !minimal && modifiers?.arrow?.enabled !== false;
    const isFloatingPlacement = getIsFloatingPlacement(placement);
    const isAutoPlacement = placement === "auto" || placement === "auto-start" || placement === "auto-end";

    const offsetModifier: Modifier<"offset"> = {
        enabled: isArrowEnabled,
        name: "offset",
        ...modifiers?.offset,
        options: {
            offset: [0, POPOVER_ARROW_SVG_SIZE / 2],
            ...modifiers?.offset?.options,
        },
    };

    const flipModifier: Modifier<"flip"> = {
        name: "flip",
        ...modifiers?.flip,
        options: {
            boundary,
            rootBoundary,
            ...modifiers?.flip?.options,
        },
    };

    const preventOverflowModifier: Modifier<"preventOverflow"> = {
        name: "preventOverflow",
        ...modifiers?.preventOverflow,
        options: {
            boundary,
            rootBoundary,
            ...modifiers?.preventOverflow?.options,
        },
    };

    const arrowModifier: Modifier<"arrow"> = {
        enabled: isArrowEnabled,
        name: "arrow",
        ...modifiers?.arrow,
    };

    const data = useFloating({
        middleware: [
            isArrowEnabled ? offset(convertPopperOffsetToFloatingOffset(offsetModifier)) : undefined,
            isAutoPlacement ? autoPlacement() : flip(convertPopperFlipToFloatingFlip(flipModifier)),
            shift(convertPopperPreventOverflowToFloatingShift(preventOverflowModifier)),
            isArrowEnabled ? arrow(convertPopperArrowToFloatingArrow(arrowModifier, arrowRef)) : undefined,
            matchTargetWidth
                ? size({
                      apply({ rects, elements }) {
                          Object.assign(elements.floating.style, {
                              width: `${rects.reference.width}px`,
                          });
                      },
                  })
                : undefined,
        ],
        onOpenChange: handleOpenChange,
        open: isOpenState,
        placement: isFloatingPlacement ? placement : undefined,
        whileElementsMounted: autoUpdate,
    });

    const { context } = data;

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        escapeKey: canEscapeKeyClose,
        outsidePress: interactionKind !== PopoverInteractionKind.CLICK_TARGET_ONLY,
    });
    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return React.useMemo(
        () => ({
            arrowRef,
            isOpen: isOpenState,
            setIsOpen: setIsOpenState,
            ...interactions,
            ...data,
        }),
        [data, interactions, isOpenState],
    );
}
