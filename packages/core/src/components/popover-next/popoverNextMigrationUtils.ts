/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Placement, Boundary as PopperBoundary } from "@popperjs/core";

import * as Errors from "../../common/errors";
import { isNodeEnv } from "../../common/utils";
import { POPOVER_ARROW_SVG_SIZE } from "../popover/popoverArrow";
import { positionToPlacement } from "../popover/popoverPlacementUtils";
import { type PopoverPosition } from "../popover/popoverPosition";
import type { PopoverProps } from "../popover/popoverProps";
import type { DefaultPopoverTargetHTMLProps, PopperModifierOverrides } from "../popover/popoverSharedProps";

import type { MiddlewareConfig, PopoverNextBoundary, PopoverNextPlacement } from "./middlewareTypes";
import type { PopoverNextProps } from "./popoverNextProps";

/**
 * Converts Popper.js v2 `modifiers` (used by `Popover`) to a Floating UI `MiddlewareConfig` (used by `PopoverNext`).
 *
 * The `modifiers` prop is not supported in `PopoverNext`; use the `middleware` prop instead.
 *
 * Modifier → middleware mappings:
 * - `flip` → `flip`
 * - `preventOverflow` → `shift` (Floating UI's equivalent "keep within boundary" concept)
 * - `offset` → `offset` (tuple `[skidding, distance]` is converted to `{ crossAxis, mainAxis }`)
 * - `arrow` → `arrow`
 * - `hide` → `hide`
 * - `computeStyles`, `eventListeners`, `popperOffsets` are not mapped (handled internally by Floating UI)
 *
 * **Note on offset:** If the Popper.js `offset` option is a function, it cannot be automatically
 * converted and will be omitted with a console warning. Migrate it manually to a
 * `{ mainAxis, crossAxis }` object in the `middleware` prop.
 *
 * @example
 * // Before (Popover)
 * <Popover modifiers={{ flip: { options: { padding: 8 } }, preventOverflow: { options: { padding: 4 } } }} />
 *
 * // After (PopoverNext)
 * <PopoverNext middleware={popperModifiersToNextMiddleware({ flip: { options: { padding: 8 } }, preventOverflow: { options: { padding: 4 } } })} />
 */
export function popperModifiersToNextMiddleware(modifiers: PopperModifierOverrides): MiddlewareConfig {
    const middleware: MiddlewareConfig = {};

    if (modifiers.flip && modifiers.flip.enabled !== false) {
        const { options } = modifiers.flip;
        middleware.flip = {
            ...(options?.boundary != null ? { boundary: popperBoundaryToNextBoundary(options.boundary) } : {}),
            ...(options?.rootBoundary != null ? { rootBoundary: options.rootBoundary } : {}),
            ...(options?.padding != null ? { padding: options.padding } : {}),
            ...(options?.fallbackPlacements != null
                ? { fallbackPlacements: options.fallbackPlacements as PopoverNextPlacement[] }
                : {}),
            ...(options?.flipVariations != null ? { flipAlignment: options.flipVariations } : {}),
            ...(options?.mainAxis != null ? { mainAxis: options.mainAxis } : {}),
            ...(options?.altAxis != null ? { crossAxis: options.altAxis } : {}),
        };
    }

    if (modifiers.preventOverflow && modifiers.preventOverflow.enabled !== false) {
        const { options } = modifiers.preventOverflow;
        middleware.shift = {
            ...(options?.boundary != null ? { boundary: popperBoundaryToNextBoundary(options.boundary) } : {}),
            ...(options?.rootBoundary != null ? { rootBoundary: options.rootBoundary } : {}),
            ...(options?.padding != null ? { padding: options.padding } : {}),
            ...(options?.mainAxis != null ? { mainAxis: options.mainAxis } : {}),
            ...(options?.altAxis != null ? { crossAxis: options.altAxis } : {}),
        };
    }

    if (modifiers.offset && modifiers.offset.enabled !== false) {
        const { options } = modifiers.offset;
        if (options?.offset != null) {
            if (typeof options.offset === "function") {
                console.warn(
                    "popperModifiersToNextMiddleware: The Popper.js `offset` function cannot be automatically " +
                        "converted to a Floating UI middleware config. Migrate it manually to a " +
                        "`{ mainAxis, crossAxis }` object in the `middleware` prop.",
                );
            } else {
                const [skidding, distance] = options.offset;
                middleware.offset = {
                    ...(skidding != null ? { crossAxis: skidding } : {}),
                    ...(distance != null ? { mainAxis: distance } : {}),
                };
            }
        } else {
            // Legacy `Popover` always populated `options.offset` with a default of
            // `[0, POPOVER_ARROW_SVG_SIZE / 2]`, so `{ offset: { enabled: true } }` (a common pattern
            // for forcing the offset on when the arrow is disabled) implicitly produced a 15px main-axis
            // gap. Preserve that behavior here so the visual gap is not silently dropped.
            middleware.offset = { mainAxis: POPOVER_ARROW_SVG_SIZE / 2 };
        }
    }

    if (modifiers.arrow && modifiers.arrow.enabled !== false) {
        const { options } = modifiers.arrow;
        // Popper.js arrow element can be HTMLElement | string | null; string selectors are not supported by Floating UI.
        if (options?.element != null && typeof options.element !== "string") {
            middleware.arrow = {
                element: options.element,
                ...(options.padding != null && typeof options.padding !== "function"
                    ? { padding: options.padding }
                    : {}),
            };
        }
    }

    if (modifiers.hide && modifiers.hide.enabled !== false) {
        middleware.hide = {};
    }

    return middleware;
}

/**
 * Converts a partial legacy `PopoverProps` bag into a partial `PopoverNextProps` bag suitable
 * for spreading onto `PopoverNext`. Preserves legacy default behavior where it differs from
 * `PopoverNext`'s defaults (`shouldReturnFocusOnClose`).
 *
 * Transformations:
 * - `placement` ?? `position` → `placement`, mirroring legacy `Popover`'s resolution
 *   (`placement ?? positionToPlacement(position)`). When `placement` is defined it always wins.
 * - `modifiers` → `middleware` (via {@link popperModifiersToNextMiddleware}).
 * - `minimal: true` → `animation: "minimal"` and `arrow: false` (legacy `minimal` disables the arrow).
 * - `boundary: "clippingParents"` → `"clippingAncestors"` (the Floating UI equivalent).
 *
 * Dropped (with dev-only `console.warn`):
 * - `modifiersCustom` — no Floating UI equivalent; migrate manually to `middleware`.
 * - `portalStopPropagationEvents` — already deprecated and non-functional in React 17+.
 *
 * Intended for use inside Blueprint components that wrap `Popover` internally and pass
 * through a `popoverProps` prop, so they can swap to `PopoverNext` without changing their public API.
 *
 * `props` may be omitted or `undefined`; in that case the function behaves as if called with `{}`,
 * which makes it convenient at sites where the consumer's `popoverProps` is itself optional.
 */
export function popoverPropsToNextProps<T extends DefaultPopoverTargetHTMLProps>(
    props?: Partial<PopoverProps<T>>,
): Partial<PopoverNextProps<T>> {
    // Pull out every prop whose legacy type is structurally incompatible with its
    // PopoverNext counterpart. After this destructure, `rest` contains only fields that
    // share an identical type between Popover and PopoverNext, so the spread below is
    // sound without any blanket cast.
    const {
        boundary,
        minimal,
        modifiers,
        modifiersCustom,
        onClose,
        placement,
        popoverRef,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        portalStopPropagationEvents,
        position,
        shouldReturnFocusOnClose,
        ...rest
    } = props ?? {};

    if (!isNodeEnv("production")) {
        if (modifiersCustom !== undefined) {
            console.warn(
                "[Blueprint] popoverPropsToNextProps: `modifiersCustom` has no equivalent in PopoverNext and will be dropped. " +
                    "Migrate to the `middleware` prop manually.",
            );
        }
        if (portalStopPropagationEvents !== undefined) {
            console.warn(
                "[Blueprint] popoverPropsToNextProps: `portalStopPropagationEvents` has no equivalent in PopoverNext and will be dropped.",
            );
        }
        if (placement !== undefined && position !== undefined) {
            console.warn(Errors.POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX);
        }
    }

    const nextProps: Partial<PopoverNextProps<T>> = { ...rest };

    if (boundary !== undefined) {
        nextProps.boundary = popperBoundaryToNextBoundary(boundary);
    }

    // Mirror legacy `Popover`'s `placement ?? positionToPlacement(position)` rule: an explicit
    // `placement` always wins, even `"auto*"` (which maps to `undefined` = autoPlacement default).
    if (placement !== undefined) {
        nextProps.placement = popoverPlacementToNextPlacement(placement);
    } else if (position !== undefined) {
        nextProps.placement = popoverPositionToNextPlacement(position);
    }

    if (modifiers !== undefined) {
        nextProps.middleware = popperModifiersToNextMiddleware(modifiers);
    }

    if (minimal === true) {
        nextProps.animation ??= "minimal";
        nextProps.arrow ??= false;
    }

    if (onClose !== undefined) {
        // Legacy `onClose` requires a non-undefined `event`; PopoverNext's signature allows
        // `event` to be undefined. Wrap to honor the legacy contract — invoke the legacy
        // handler only when an event is actually present.
        nextProps.onClose = event => {
            if (event !== undefined) {
                onClose(event);
            }
        };
    }

    if (popoverRef !== undefined) {
        // Legacy `popoverRef` is `React.Ref<HTMLElement>`; PopoverNext's is `React.Ref<HTMLDivElement>`.
        // `RefObject<T>` is invariant in `T` (`.current` is mutable, so `T` appears in both read
        // and write positions), so `RefObject<HTMLElement>` is not assignable to
        // `RefObject<HTMLDivElement>` even though `HTMLDivElement` is a subtype of `HTMLElement`.
        // In practice the underlying DOM node is a `<div>` (the `Classes.POPOVER` element), so a
        // ref slot typed for the wider `HTMLElement` safely receives it. Cast narrowly here so
        // the unsoundness stays scoped to this one prop instead of the whole bag.
        nextProps.popoverRef = popoverRef as React.Ref<HTMLDivElement>;
    }

    // Legacy default for `shouldReturnFocusOnClose` is `false`; PopoverNext's is `true`.
    nextProps.shouldReturnFocusOnClose = shouldReturnFocusOnClose ?? false;

    return nextProps;
}

/**
 * Converts a Popper.js `Boundary` value to a Floating UI `PopoverNextBoundary` value.
 *
 * The two systems use different names for the "all clipping ancestors" sentinel:
 * - Popper.js: `"clippingParents"`
 * - Floating UI: `"clippingAncestors"`
 *
 * Element / `Element[]` values pass through unchanged.
 */
export function popperBoundaryToNextBoundary(boundary: PopperBoundary): PopoverNextBoundary {
    return boundary === "clippingParents" ? "clippingAncestors" : boundary;
}

/**
 * Converts a Popper.js `Placement` value to a `PopoverNextPlacement` value for use with `PopoverNext`.
 *
 * `"auto"`, `"auto-start"`, and `"auto-end"` have no direct equivalent in Floating UI — they return
 * `undefined`, which causes `PopoverNext` to use its default automatic placement behavior.
 * All other values pass through unchanged (the residual literal union is identical to `PopoverNextPlacement`).
 *
 * @example
 * // Before (Popover)
 * <Popover placement="top-start" />
 *
 * // After (PopoverNext)
 * <PopoverNext placement={popoverPlacementToNextPlacement("top-start")} />
 */
export function popoverPlacementToNextPlacement(placement: Placement): PopoverNextPlacement | undefined {
    switch (placement) {
        case "auto":
        case "auto-start":
        case "auto-end":
            // PopoverNext uses autoPlacement middleware by default when placement is undefined.
            return undefined;
        default:
            return placement;
    }
}

/**
 * Converts a legacy `PopoverPosition` value to a `PopoverNextPlacement` value for use with `PopoverNext`.
 *
 * The `position` prop is not supported in `PopoverNext`; use the `placement` prop instead.
 * `"auto"`, `"auto-start"`, and `"auto-end"` have no direct equivalent — they return `undefined`,
 * which causes `PopoverNext` to use its default automatic placement behavior.
 *
 * @example
 * // Before (Popover)
 * <Popover position={PopoverPosition.TOP_LEFT} />
 *
 * // After (PopoverNext)
 * <PopoverNext placement={popoverPositionToNextPlacement(PopoverPosition.TOP_LEFT)} />
 */
export function popoverPositionToNextPlacement(position: PopoverPosition): PopoverNextPlacement | undefined {
    // `positionToPlacement` translates PopoverPosition's `"top-left"`/`"bottom-right"` forms to
    // Popper's `"top-start"`/`"bottom-end"` forms, and passes `"auto"`/`"auto-start"`/`"auto-end"`
    // through unchanged. `popoverPlacementToNextPlacement` then filters out the auto* values.
    return popoverPlacementToNextPlacement(positionToPlacement(position));
}
