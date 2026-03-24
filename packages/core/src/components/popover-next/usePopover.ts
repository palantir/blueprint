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

import { PopoverInteractionKind } from "../popover/popoverProps";

import type { PopoverNextPositioningStrategy } from "./middlewareTypes";
import type { PopoverNextAutoUpdateOptions } from "./popoverNextProps";

interface PopoverOptions {
    autoUpdateOptions?: PopoverNextAutoUpdateOptions;
    canEscapeKeyClose?: boolean;
    disabled?: boolean;
    hasBackdrop?: boolean;
    interactionKind?: PopoverInteractionKind;
    isControlled?: boolean;
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
    canEscapeKeyClose,
    disabled = false,
    hasBackdrop = false,
    interactionKind,
    isControlled = false,
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
        enabled: !disabled,
    });
    const dismiss = useDismiss(context, {
        escapeKey: canEscapeKeyClose,
        // For CLICK interactions, delegate outside-click detection to Overlay2's stack-aware
        // handler (getThisOverlayAndDescendants) so that clicks inside child overlays like
        // Dialog don't incorrectly close the popover. Floating UI's useDismiss is not aware
        // of Blueprint's overlay stack and treats clicks in portaled child overlays as
        // "outside" clicks.
        outsidePress:
            interactionKind !== PopoverInteractionKind.CLICK_TARGET_ONLY &&
            interactionKind !== PopoverInteractionKind.CLICK &&
            !hasBackdrop,
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
