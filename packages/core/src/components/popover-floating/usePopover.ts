/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import {
    arrow,
    autoUpdate,
    offset,
    type Placement,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import React from "react";

import { POPOVER_ARROW_SVG_SIZE } from "../popover/popoverArrow";

interface PopoverOptions {
    placement?: Placement;
}

export function usePopover({ placement = "top" }: PopoverOptions = {}) {
    const arrowRef = React.useRef(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const data = useFloating({
        middleware: [
            offset(POPOVER_ARROW_SVG_SIZE / 2),
            arrow({
                element: arrowRef,
            }),
        ],
        onOpenChange: setIsOpen,
        open: isOpen,
        placement,
        whileElementsMounted: autoUpdate,
    });

    const { context } = data;

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return React.useMemo(
        () => ({
            arrowRef,
            isOpen,
            setIsOpen,
            ...interactions,
            ...data,
        }),
        [data, interactions, isOpen],
    );
}
