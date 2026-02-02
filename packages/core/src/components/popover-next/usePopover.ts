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
import { useCallback, useEffect, useMemo, useState } from "react";

import { PopoverInteractionKind } from "../popover/popoverProps";

import type { PopoverNextPositioningStrategy } from "./middlewareTypes";

interface PopoverOptions {
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

    const data = useFloating({
        middleware,
        onOpenChange: handleOpenChange,
        open: isOpenState,
        placement,
        strategy: positioningStrategy,
        whileElementsMounted: autoUpdate,
    });

    const { context } = data;

    const click = useClick(context, {
        enabled: !disabled,
    });
    const dismiss = useDismiss(context, {
        escapeKey: canEscapeKeyClose,
        // Disable outside press when hasBackdrop=true since Overlay2 handles backdrop clicks
        outsidePress: interactionKind !== PopoverInteractionKind.CLICK_TARGET_ONLY && !hasBackdrop,
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
