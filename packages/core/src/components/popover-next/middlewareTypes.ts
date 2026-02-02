/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Supported placement values for PopoverNext.
 * Based on Floating UI's placement system.
 *
 * @see https://floating-ui.com/docs/computePosition#placement
 */
export type PopoverNextPlacement =
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";

/**
 * Boundary element for overflow detection.
 * Specifies which element(s) constrain the popover positioning.
 *
 * @see https://floating-ui.com/docs/detectoverflow#boundary
 */
export type PopoverNextBoundary = "clippingAncestors" | Element | Element[];

/**
 * Root boundary for overflow detection.
 * Specifies the outermost boundary for the popover.
 *
 * @see https://floating-ui.com/docs/detectoverflow#rootboundary
 */
export type PopoverNextRootBoundary = "viewport" | "document";

/**
 * CSS position strategy for the floating element.
 *
 * @see https://floating-ui.com/docs/usefloating#strategy
 */
export type PopoverNextPositioningStrategy = "absolute" | "fixed";

/**
 * Padding configuration for overflow detection.
 * Can be a single number (applied to all sides) or an object with per-side values.
 *
 * @see https://floating-ui.com/docs/detectoverflow#padding
 */
export type PopoverNextPadding =
    | number
    | Partial<{
          top: number;
          right: number;
          bottom: number;
          left: number;
      }>;

/**
 * Options for the offset middleware.
 * Controls the distance between the reference and floating elements.
 *
 * @see https://floating-ui.com/docs/offset
 */
export interface PopoverNextOffsetOptions {
    /**
     * Distance from the reference element along the main axis (perpendicular to the placement).
     *
     * @default 0
     */
    mainAxis?: number;

    /**
     * Distance from the reference element along the cross axis (parallel to the placement).
     *
     * @default 0
     */
    crossAxis?: number;

    /**
     * Alignment offset. Only applies when using aligned placements (e.g., "top-start", "bottom-end").
     * A positive value moves toward the end, negative toward the start.
     *
     * @default null
     */
    alignmentAxis?: number | null;
}

/**
 * Options for the arrow middleware.
 * Controls how the arrow is positioned relative to the popover.
 *
 * @see https://floating-ui.com/docs/arrow
 */
export interface PopoverNextArrowOptions {
    /**
     * The arrow element reference.
     */
    element: Element | null | React.MutableRefObject<Element | null>;

    /**
     * Padding from the edges of the floating element.
     * Prevents the arrow from reaching the very edge.
     *
     * @default 0
     */
    padding?: PopoverNextPadding;
}

/**
 * Options for the flip middleware.
 * Controls how the popover flips to alternative placements when space is limited.
 *
 * @see https://floating-ui.com/docs/flip
 */
export interface PopoverNextFlipOptions {
    /**
     * Whether to flip along the main axis.
     *
     * @default true
     */
    mainAxis?: boolean;

    /**
     * Whether to flip along the cross axis.
     *
     * @default true
     */
    crossAxis?: boolean;

    /**
     * Specific placements to try as fallbacks, in order of priority.
     * If not provided, the opposite placement is used.
     */
    fallbackPlacements?: PopoverNextPlacement[];

    /**
     * Strategy when no placements fit.
     *
     * @default "bestFit"
     */
    fallbackStrategy?: "bestFit" | "initialPlacement";

    /**
     * Whether to flip alignment (e.g., "top-start" to "top-end") when flipping.
     *
     * @default true
     */
    flipAlignment?: boolean;

    /**
     * Boundary element(s) for overflow detection.
     */
    boundary?: PopoverNextBoundary;

    /**
     * Root boundary for overflow detection.
     */
    rootBoundary?: PopoverNextRootBoundary;

    /**
     * Padding from the boundary edges.
     *
     * @default 0
     */
    padding?: PopoverNextPadding;
}

/**
 * Options for the autoPlacement middleware.
 * Automatically chooses the best placement based on available space.
 *
 * Note: autoPlacement and flip are mutually exclusive.
 * autoPlacement chooses the placement with "most space",
 * while flip uses "fallback when no space" strategy.
 *
 * @see https://floating-ui.com/docs/autoplacement
 */
export interface PopoverNextAutoPlacementOptions {
    /**
     * Whether to consider cross-axis space when choosing placement.
     *
     * @default false
     */
    crossAxis?: boolean;

    /**
     * Preferred alignment when auto-selecting placement.
     */
    alignment?: "start" | "end" | null;

    /**
     * Whether to auto-align when preferred alignment doesn't fit.
     *
     * @default true
     */
    autoAlignment?: boolean;

    /**
     * Allowed placements to consider.
     * If not provided, all placements are considered.
     */
    allowedPlacements?: PopoverNextPlacement[];

    /**
     * Boundary element(s) for overflow detection.
     */
    boundary?: PopoverNextBoundary;

    /**
     * Root boundary for overflow detection.
     */
    rootBoundary?: PopoverNextRootBoundary;

    /**
     * Padding from the boundary edges.
     *
     * @default 0
     */
    padding?: PopoverNextPadding;
}

/**
 * Options for the shift middleware.
 * Controls how the popover shifts to stay within boundaries.
 *
 * @see https://floating-ui.com/docs/shift
 */
export interface PopoverNextShiftOptions {
    /**
     * Whether to shift along the main axis.
     *
     * @default true
     */
    mainAxis?: boolean;

    /**
     * Whether to shift along the cross axis.
     *
     * @default false
     */
    crossAxis?: boolean;

    /**
     * Boundary element(s) for overflow detection.
     */
    boundary?: PopoverNextBoundary;

    /**
     * Root boundary for overflow detection.
     */
    rootBoundary?: PopoverNextRootBoundary;

    /**
     * Padding from the boundary edges.
     *
     * @default 0
     */
    padding?: PopoverNextPadding;
}

/**
 * Options for the size middleware.
 * Controls how the popover size adapts to available space.
 *
 * @see https://floating-ui.com/docs/size
 */
export interface PopoverNextSizeOptions {
    /**
     * Function called to apply size changes to the floating element.
     * Use this to set max-width/max-height or other size constraints.
     */
    apply?: (args: {
        availableWidth: number;
        availableHeight: number;
        elements: { floating: HTMLElement };
        rects: {
            reference: { width: number; height: number };
            floating: { width: number; height: number };
        };
    }) => void;

    /**
     * Boundary element(s) for overflow detection.
     */
    boundary?: PopoverNextBoundary;

    /**
     * Root boundary for overflow detection.
     */
    rootBoundary?: PopoverNextRootBoundary;

    /**
     * Padding from the boundary edges.
     *
     * @default 0
     */
    padding?: PopoverNextPadding;
}

/**
 * Options for the hide middleware.
 * Controls when to hide the popover based on visibility.
 *
 * @see https://floating-ui.com/docs/hide
 */
export interface PopoverNextHideOptions {
    /**
     * Strategy for determining when to hide.
     *
     * @default "referenceHidden"
     */
    strategy?: "referenceHidden" | "escaped";

    /**
     * Boundary element(s) for overflow detection.
     */
    boundary?: PopoverNextBoundary;

    /**
     * Root boundary for overflow detection.
     */
    rootBoundary?: PopoverNextRootBoundary;

    /**
     * Padding from the boundary edges.
     *
     * @default 0
     */
    padding?: PopoverNextPadding;
}

/**
 * Options for the inline middleware.
 * Improves positioning for inline reference elements that span multiple lines.
 *
 * @see https://floating-ui.com/docs/inline
 */
export interface PopoverNextInlineOptions {
    /**
     * Viewport-relative x coordinate to choose a ClientRect.
     * Useful for positioning relative to cursor position.
     */
    x?: number;

    /**
     * Viewport-relative y coordinate to choose a ClientRect.
     * Useful for positioning relative to cursor position.
     */
    y?: number;

    /**
     * Padding around a disjoined rect.
     *
     * @default 2
     */
    padding?: PopoverNextPadding;
}

/**
 * Configuration object for customizing PopoverNext middlewares.
 * Each key corresponds to a middleware name, with partial options to override defaults.
 *
 * For example, the arrow middleware can be configured by providing:
 * ```ts
 * { arrow: { element: arrowRef.current, padding: 5 } }
 * ```
 *
 * @see https://floating-ui.com/docs/middleware
 */
export interface MiddlewareConfig {
    /**
     * Options for the arrow middleware.
     */
    arrow?: Partial<PopoverNextArrowOptions>;

    /**
     * Options for the autoPlacement middleware.
     * Note: autoPlacement and flip are mutually exclusive.
     */
    autoPlacement?: Partial<PopoverNextAutoPlacementOptions>;

    /**
     * Options for the flip middleware.
     * Note: autoPlacement and flip are mutually exclusive.
     */
    flip?: Partial<PopoverNextFlipOptions>;

    /**
     * Options for the hide middleware.
     */
    hide?: Partial<PopoverNextHideOptions>;

    /**
     * Options for the inline middleware.
     */
    inline?: Partial<PopoverNextInlineOptions>;

    /**
     * Options for the offset middleware.
     * Can be a number (shorthand for mainAxis) or an options object.
     */
    offset?: Partial<PopoverNextOffsetOptions> | number;

    /**
     * Options for the shift middleware.
     */
    shift?: Partial<PopoverNextShiftOptions>;

    /**
     * Options for the size middleware.
     */
    size?: Partial<PopoverNextSizeOptions>;
}
