/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { PopoverNextProps, PopoverNextRef } from "@blueprintjs/core";

/**
 * Reusable collection of props for components in this package which render a PopoverNext
 * and need to provide some degree of customization for that popover.
 */
export interface DatetimePopoverNextProps {
    /**
     * Props to spread to `PopoverNext`.
     */
    popoverNextProps?: Partial<
        Omit<
            PopoverNextProps,
            "autoFocus" | "content" | "defaultIsOpen" | "disabled" | "enforceFocus" | "fill" | "renderTarget"
        >
    >;

    /**
     * Optional ref for the PopoverNext component instance.
     * This is sometimes useful to reposition the popover.
     */
    popoverRef?: React.RefObject<PopoverNextRef>;
}
