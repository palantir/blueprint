/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import {
    autoUpdate,
    type Middleware,
    type Placement,
    useClick,
    useDismiss,
    useFloating,
    type UseFloatingReturn,
    useInteractions,
    type UseInteractionsReturn,
} from "@floating-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PopoverNextPositioningStrategy } from "./middlewareTypes";
import type { PopoverNextAutoUpdateOptions } from "./popoverNextProps";

interface PopoverOptions {
    autoUpdateOptions?: PopoverNextAutoUpdateOptions;
    disabled?: boolean;
    isControlled?: boolean;
    isHoverInteractionKind?: boolean;
    isOpen?: boolean;
    middleware?: Middleware[];
    placement?: Placement;
    positioningStrategy?: PopoverNextPositioningStrategy;
    onOpenChange?: (isOpen: boolean, event?: Event) => void;
}

interface UsePopoverReturn extends UseFloatingReturn, UseInteractionsReturn {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function usePopover({
    autoUpdateOptions,
    disabled = false,
    isControlled = false,
    isHoverInteractionKind = false,
    isOpen = false,
    middleware,
    placement,
    positioningStrategy = "absolute",
    onOpenChange,
}: PopoverOptions = {}): UsePopoverReturn {
    const [isOpenState, setIsOpenState] = useState(isOpen);

    useEffect(() => {
        setIsOpenState(isOpen);
    }, [isOpen]);

    const handleOpenChange = useCallback(
        (nextOpen: boolean, event?: Event) => {
            // Only update internal state for uncontrolled components
            if (!isControlled) {
                setIsOpenState(nextOpen);
            }

            // Always call the external callback if provided
            if (onOpenChange) {
                onOpenChange(nextOpen, event);
            }
        },
        [onOpenChange, isControlled],
    );

    // Store options in a ref so the memoized callback always reads the latest
    // values without changing its identity on every render.
    const autoUpdateOptionsRef = useRef(autoUpdateOptions);
    autoUpdateOptionsRef.current = autoUpdateOptions;

    const whileElementsMounted = useMemo(
        () =>
            autoUpdateOptions != null
                ? (reference: Parameters<typeof autoUpdate>[0], floating: HTMLElement, update: () => void) =>
                      autoUpdate(reference, floating, update, autoUpdateOptionsRef.current)
                : autoUpdate,
        // Only change identity when toggling between with/without options;
        // actual option values are read from the ref at call time.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [autoUpdateOptions != null],
    );

    const data = useFloating({
        middleware,
        onOpenChange: handleOpenChange,
        open: isOpenState,
        placement,
        strategy: positioningStrategy,
        whileElementsMounted,
    });

    const { context } = data;

    const click = useClick(context, {
        enabled: !disabled && !isHoverInteractionKind,
        // Disable Floating UI's built-in Space/Enter keyboard handlers because they
        // call `preventDefault()` on the Space keydown event to prevent page scrolling.
        // This also prevents space characters from being typed in <input>/<textarea>
        // elements that are children of the target wrapper element.
        // See: https://github.com/palantir/blueprint/pull/7997
        //
        // PopoverTarget provides its own keyboard click handling that avoids this issue
        // by skipping typeable elements while still maintaining keyboard accessibility
        // for non-typeable targets.
        keyboardHandlers: false,
    });
    const dismiss = useDismiss(context, {
        // Escape handling lives on Overlay2 (`canEscapeKeyClose`), which is stack-aware via
        // OverlayContext so only the topmost overlay closes per keystroke. Floating UI's
        // `useDismiss` attaches a non-stack-aware document keydown listener — enabling both
        // means every stacked popover/tooltip closes on a single Escape.
        escapeKey: false,
        // Outside-press handling lives on Overlay2 (`canOutsideClickClose`), which is
        // stack-aware via OverlayContext so clicks inside portaled child overlays (e.g. a
        // Dialog rendered in popover content) don't incorrectly close the popover. Floating
        // UI's `useDismiss` treats those clicks as "outside" the popover because the child
        // overlay is rendered outside the popover's DOM subtree.
        outsidePress: false,
    });

    const interactions = useInteractions([click, dismiss]);

    return useMemo(
        () => ({
            isOpen: isOpenState,
            setIsOpen: setIsOpenState,
            ...interactions,
            ...data,
        }),
        [data, interactions, isOpenState],
    );
}
