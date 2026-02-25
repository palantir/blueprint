/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { positionToPlacement } from "../popover/popoverPlacementUtils";
import { type PopoverPosition } from "../popover/popoverPosition";
import type { PopperModifierOverrides } from "../popover/popoverSharedProps";

import type { MiddlewareConfig, PopoverNextPlacement } from "./middlewareTypes";

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
    switch (position) {
        case "auto":
        case "auto-start":
        case "auto-end":
            // PopoverNext uses autoPlacement middleware by default when placement is undefined.
            return undefined;
        default:
            // positionToPlacement handles all remaining PopoverPosition values.
            // The string literal values it returns are identical to PopoverNextPlacement.
            return positionToPlacement(position) as PopoverNextPlacement;
    }
}

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
            ...(options?.boundary != null ? { boundary: options.boundary as Element } : {}),
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
            ...(options?.boundary != null ? { boundary: options.boundary as Element } : {}),
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
