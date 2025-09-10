/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type {
    ArrowOptions,
    AutoPlacementOptions,
    FlipOptions,
    Boundary as FloatingBoundary,
    Placement as FloatingPlacement,
    RootBoundary as FloatingRootBoundary,
    HideOptions,
    InlineOptions,
    OffsetOptions,
    ShiftOptions,
    SizeOptions,
} from "@floating-ui/react";

import type { PopoverProps } from "../popover/popoverProps";
import type { DefaultPopoverTargetHTMLProps } from "../popover/popoverSharedProps";

export type { FloatingBoundary, FloatingPlacement };

/**
 * Configuration object for customizing Floating UI middlewares in PopoverNext.
 * Similar to PopperModifierOverrides but for Floating UI middleware.
 *
 * @see https://floating-ui.com/docs/middleware
 */
export type MiddlewareConfig = Partial<{
    arrow: Partial<ArrowOptions>;
    autoPlacement: Partial<AutoPlacementOptions>;
    flip: Partial<FlipOptions>;
    hide: Partial<HideOptions>;
    inline: Partial<InlineOptions>;
    offset: Partial<OffsetOptions>;
    shift: Partial<ShiftOptions>;
    size: Partial<SizeOptions>;
}>;

/**
 * Props interface for PopoverNext component using Floating UI types.
 * This extends the original PopoverProps but replaces Popper-specific types with Floating UI equivalents.
 */
export interface PopoverNextProps<T extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps>
    extends Omit<PopoverProps<T>, "boundary" | "modifiers" | "placement" | "rootBoundary"> {
    boundary?: FloatingBoundary;

    /**
     * The placement (relative to the target) at which the popover should appear.
     *
     * @default undefined (uses autoPlacement middleware for automatic positioning)
     */
    placement?: FloatingPlacement;

    rootBoundary?: FloatingRootBoundary;

    /**
     * Config for Floating UI middlewares.
     * Each config is a partial options object, keyed by its middleware name.
     *
     * For example, the arrow middleware can be configured by providing
     * `{ arrow: { element: arrowRef.current, padding: 5 } }`.
     *
     * Some of PopoverNext's default middlewares may get disabled under certain circumstances,
     * but you can re-enable and customize them. For example, "offset" is disabled when `minimal={true}`,
     * but you can re-enable it with `{ offset: { mainAxis: 10 } }`.
     *
     * @see https://floating-ui.com/docs/middleware
     */
    middleware?: MiddlewareConfig;
}
