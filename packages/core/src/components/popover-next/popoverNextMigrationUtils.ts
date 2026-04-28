/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { isNodeEnv } from "../../common/utils";
import { positionToPlacement } from "../popover/popoverPlacementUtils";
import { type PopoverPosition } from "../popover/popoverPosition";
import type { PopoverProps } from "../popover/popoverProps";
import type { DefaultPopoverTargetHTMLProps, PopperModifierOverrides } from "../popover/popoverSharedProps";

import type { MiddlewareConfig, PopoverNextPlacement } from "./middlewareTypes";
import type { PopoverNextProps } from "./popoverNextProps";

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

/**
 * Converts a partial legacy `PopoverProps` bag into a partial `PopoverNextProps` bag suitable
 * for spreading onto `PopoverNext`. Preserves legacy default behavior where it differs from
 * `PopoverNext`'s defaults (`shouldReturnFocusOnClose`).
 *
 * Transformations:
 * - `position` → `placement` (via {@link popoverPositionToNextPlacement}). If both are supplied,
 *   `placement` wins, mirroring legacy `Popover`'s mutex behavior.
 * - `modifiers` → `middleware` (via {@link popperModifiersToNextMiddleware}). A consumer-supplied
 *   `middleware` bag takes precedence over the converted modifiers.
 * - `minimal: true` → `animation: "minimal"` and `arrow: false` (legacy `minimal` disables the arrow).
 * - `boundary: "clippingParents"` → `"clippingAncestors"` (the Floating UI equivalent).
 *
 * Dropped (with dev-only `console.warn`):
 * - `modifiersCustom` — no Floating UI equivalent; migrate manually to `middleware`.
 * - `popoverRef` — `PopoverNext`'s `forwardRef` exposes `{ reposition }`, not the popover DOM node.
 * - `portalStopPropagationEvents` — already deprecated and non-functional in React 17+.
 *
 * Intended for use inside Blueprint components that wrap `Popover` internally and pass
 * through a `popoverProps` prop, so they can swap to `PopoverNext` without changing their public API.
 */
export function popoverPropsToNextProps<T extends DefaultPopoverTargetHTMLProps>(
    props: Partial<PopoverProps<T>>,
): Partial<PopoverNextProps<T>> {
    const {
        boundary,
        minimal,
        modifiers,
        modifiersCustom,
        popoverRef,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        portalStopPropagationEvents,
        position,
        shouldReturnFocusOnClose,
        ...rest
    } = props;

    if (!isNodeEnv("production")) {
        if (modifiersCustom !== undefined) {
            console.warn(
                "[Blueprint] popoverPropsToNextProps: `modifiersCustom` has no equivalent in PopoverNext and will be dropped. " +
                    "Migrate to the `middleware` prop manually.",
            );
        }
        if (popoverRef !== undefined) {
            console.warn(
                "[Blueprint] popoverPropsToNextProps: `popoverRef` has no equivalent in PopoverNext and will be dropped. " +
                    "PopoverNext's forwarded ref exposes `{ reposition }`, not the popover DOM element.",
            );
        }
        if (portalStopPropagationEvents !== undefined) {
            console.warn(
                "[Blueprint] popoverPropsToNextProps: `portalStopPropagationEvents` has no equivalent in PopoverNext and will be dropped.",
            );
        }
    }

    // `rest` is the 1:1 pass-through. Cast through `unknown` because the legacy `boundary` type
    // (Popper.js's `Boundary`, which permits the string `"clippingParents"`) is structurally
    // incompatible with `PopoverNextBoundary`, even though we strip `boundary` out above.
    const nextProps: Partial<PopoverNextProps<T>> = { ...rest } as unknown as Partial<PopoverNextProps<T>>;

    if (boundary !== undefined) {
        // "clippingParents" (Popper.js) ≡ "clippingAncestors" (Floating UI).
        nextProps.boundary = boundary === "clippingParents" ? "clippingAncestors" : (boundary as Element | Element[]);
    }

    // position → placement. Legacy `placement` wins over `position` when both are supplied.
    if (position !== undefined && rest.placement === undefined) {
        const converted = popoverPositionToNextPlacement(position);
        if (converted !== undefined) {
            nextProps.placement = converted;
        }
    }

    if (modifiers !== undefined) {
        nextProps.middleware = popperModifiersToNextMiddleware(modifiers);
    }

    if (minimal === true) {
        nextProps.animation ??= "minimal";
        nextProps.arrow ??= false;
    }

    // Legacy default for `shouldReturnFocusOnClose` is `false`; PopoverNext's is `true`.
    nextProps.shouldReturnFocusOnClose = shouldReturnFocusOnClose ?? false;

    return nextProps;
}
