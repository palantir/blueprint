/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { ArrowOptions, Boundary, FlipOptions, OffsetOptions, Placement, ShiftOptions } from "@floating-ui/react";
import type { Boundary as PopperBoundary, Placement as PopperPlacement } from "@popperjs/core";

import type { PopperModifierOverrides } from "../popover/popoverSharedProps";

export function isFloatingPlacement(placement: PopperPlacement | Placement): placement is Placement {
    return !placement.startsWith("auto");
}

export function convertPopperPlacementToFloatingPlacement(placement: PopperPlacement): Placement | undefined {
    if (isFloatingPlacement(placement)) {
        return placement;
    }
    return undefined;
}

/**
 * Converts a Popper boundary value to a Floating UI boundary value.
 *
 * @see https://popper.js.org/docs/v2/utils/detect-overflow/#boundary
 * @see https://floating-ui.com/docs/detectoverflow#boundary
 *
 * @param boundary - The Popper boundary value to convert.
 * @returns The Floating UI boundary value.
 */
export function convertPopperBoundaryToFloatingBoundary(boundary: PopperBoundary | undefined): Boundary | undefined {
    if (boundary === "clippingParents") {
        return "clippingAncestors";
    }
    return boundary;
}

export function convertFallbackPlacementsToFloatingFallbackPlacements(
    fallbackPlacements: PopperPlacement[] | undefined,
): Placement[] | undefined {
    if (fallbackPlacements === undefined) {
        return undefined;
    }
    return fallbackPlacements.filter(isFloatingPlacement);
}

/**
 * Converts a Popper offset modifier to a Floating UI offset option.
 *
 * @see https://popper.js.org/docs/v2/modifiers/offset
 * @see https://floating-ui.com/docs/offset
 *
 * @param offset - The Popper offset modifier to convert.
 * @returns The Floating UI offset option.
 */
export function convertPopperOffsetToFloatingOffset(offset: PopperModifierOverrides["offset"]): OffsetOptions {
    const offsetValue = offset?.options?.offset;

    // Handle array offset format: [skidding, distance]
    if (Array.isArray(offsetValue)) {
        const skidding = offsetValue[0] ?? 0;
        const distance = offsetValue[1] ?? 0;
        return {
            crossAxis: skidding,
            mainAxis: distance,
        };
    }

    // Handle function offset format - for migration purposes, use default values
    // since we can't execute the function without Popper state
    if (typeof offsetValue === "function") {
        console.warn("Function offset format is not supported in Floating UI. Using default values.");
        return {
            crossAxis: 0,
            mainAxis: 0,
        };
    }

    // Default case - no offset specified
    return {
        crossAxis: 0,
        mainAxis: 0,
    };
}

/**
 * Converts a Popper flip modifier to a Floating UI flip option.
 *
 * @see https://popper.js.org/docs/v2/modifiers/flip/
 * @see https://floating-ui.com/docs/flip
 *
 * @param flip - The Popper flip modifier to convert.
 * @returns The Floating UI flip option.
 */
export function convertPopperFlipToFloatingFlip(flip: PopperModifierOverrides["flip"]): FlipOptions {
    const options = flip?.options;

    // Convert fallbackPlacements, filtering out auto placements which Floating UI doesn't support
    const fallbackPlacements = convertFallbackPlacementsToFloatingFallbackPlacements(options?.fallbackPlacements);

    // Map Popper's flipVariations to Floating UI's flipAlignment
    const flipAlignment = options?.flipVariations ?? true;

    // Extract detectOverflow options that are compatible
    const padding = options?.padding;
    const boundary = convertPopperBoundaryToFloatingBoundary(options?.boundary);
    const rootBoundary = options?.rootBoundary;
    const altBoundary = options?.altBoundary;

    // Handle allowedAutoPlacements - log warning since this concept doesn't exist in Floating UI
    if (options?.allowedAutoPlacements) {
        console.warn("allowedAutoPlacements is not supported in Floating UI. Skipping.");
    }

    return {
        altBoundary,
        boundary,
        fallbackPlacements,
        flipAlignment,
        padding,
        rootBoundary,
    };
}

/**
 * Converts a Popper preventOverflow modifier to a Floating UI shift option.
 *
 * @see https://popper.js.org/docs/v2/modifiers/prevent-overflow/
 * @see https://floating-ui.com/docs/shift
 *
 * @param preventOverflow - The Popper preventOverflow modifier to convert.
 * @returns The Floating UI shift option.
 */
export function convertPopperPreventOverflowToFloatingShift(
    preventOverflow: PopperModifierOverrides["preventOverflow"],
): ShiftOptions {
    const options = preventOverflow?.options;
    return {
        altBoundary: options?.altBoundary,
        boundary: convertPopperBoundaryToFloatingBoundary(options?.boundary),
        padding: options?.padding,
        rootBoundary: options?.rootBoundary,
    };
}

/**
 * Converts a Popper arrow modifier to a Floating UI arrow option.
 *
 * @see https://popper.js.org/docs/v2/modifiers/arrow/
 * @see https://floating-ui.com/docs/arrow
 *
 * @param arrow - The Popper arrow modifier to convert.
 * @param element - The arrow element to use (required since Floating UI needs actual element).
 * @returns The Floating UI arrow option.
 */
export function convertPopperArrowToFloatingArrow(
    arrow: PopperModifierOverrides["arrow"],
    element: ArrowOptions["element"],
): ArrowOptions {
    const options = arrow?.options;

    // Handle element option differences
    if (typeof options?.element === "string") {
        console.warn(`Popper arrow element selector "${options.element}" cannot be auto-converted. Skipping.`);
    }

    // Handle padding function - Floating UI doesn't support padding functions
    if (typeof options?.padding === "function") {
        console.warn("Popper arrow padding function is not supported in Floating UI. Using default padding instead.");
        return { element, padding: 0 };
    }

    return { element, padding: options?.padding };
}
