/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { arrow, autoPlacement, flip, hide, inline, type Middleware, offset, shift, size } from "@floating-ui/react";

import type { MiddlewareConfig } from "./middlewareTypes";

/**
 * Converts a middleware configuration object to a properly ordered array of Floating UI middleware.
 *
 * @param overrides - Configuration object containing middleware options
 * @returns Array of Floating UI middleware instances in the correct order
 *
 * @see https://floating-ui.com/docs/middleware#ordering
 */
export function convertMiddlewareConfigToArray(overrides: MiddlewareConfig): Middleware[] {
    const middlewares: Middleware[] = [];

    // offset() should always go at the beginning
    if (overrides.offset) {
        middlewares.push(offset(overrides.offset));
    }

    // inline() should be early, before flip
    if (overrides.inline) {
        middlewares.push(inline(overrides.inline));
    }

    // Positioning middleware (autoPlacement and flip are mutually exclusive)
    // autoPlacement uses "most space" strategy, flip uses "fallback when no space" strategy
    if (overrides.autoPlacement && overrides.flip) {
        console.warn("autoPlacement and flip are mutually exclusive. Using autoPlacement and ignoring flip.");
        middlewares.push(autoPlacement(overrides.autoPlacement));
    } else if (overrides.flip) {
        middlewares.push(flip(overrides.flip));
    } else {
        middlewares.push(autoPlacement(overrides.autoPlacement));
    }

    // shift() after positioning middleware
    if (overrides.shift) {
        middlewares.push(shift(overrides.shift));
    }

    // size() after positioning middleware
    if (overrides.size) {
        middlewares.push(size(overrides.size));
    }

    // arrow() should be near the end, after shift/autoPlacement
    if (overrides.arrow && overrides.arrow.element) {
        middlewares.push(
            arrow({
                element: overrides.arrow.element,
                padding: overrides.arrow.padding,
            }),
        );
    }

    // hide() should always go at the end
    if (overrides.hide) {
        middlewares.push(hide(overrides.hide));
    }

    return middlewares;
}
