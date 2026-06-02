/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Prop-type definitions for the <Surface> and <Layer> components.
 *
 * BP7 models a "surface" along a few orthogonal axes (see the Surfaces RFC).
 * We split that model across two components rather than one discriminated
 * union, because two of the axes never combine:
 *
 *   • <Surface> is the *base* — what the surface itself is (`opaque` or
 *     `glass`). A base may lift off the page via `shadow`.
 *   • <Layer> is a tonal *wash* that stacks inside a base. It carries an
 *     `intent` tint and an `index` for its position in the stack; depth comes
 *     from nesting <Layer>s, not from a per-level token.
 *
 * Keeping them separate means neither component carries props that are invalid
 * for it (a base has no `index`; a layer has no `shadow`).
 */

import type * as React from "react";

/**
 * Semantic tint shared by surfaces and layers. Omitting `intent` puts a
 * <Layer> in the subtle "none" wash family.
 */
export type SurfaceIntent = "default" | "primary" | "success" | "warning" | "danger";

/**
 * What the base is. `opaque` is a solid background; `glass` is a
 * translucent, blurred background that de-emphasizes whatever sits behind it.
 */
export type SurfaceKind = "opaque" | "glass";

/**
 * Drop-shadow lift for a base, mapping to `--bp-surface-shadow-{0..4}`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow
 */
export type Shadow = 0 | 1 | 2 | 3 | 4;

/**
 * Props for the `<Surface>` component (the base).
 *
 * Extends standard HTML div props with the base axes.
 */
export interface SurfaceProps extends React.ComponentPropsWithoutRef<"div"> {
    /**
     * When true, `<Surface>` will **not** render an extra wrapper element.
     * Instead it clones & enhances its single child element, merging class
     * names and props (via {@link Slot}).
     */
    asChild?: boolean;

    /**
     * What kind of base this is.
     *
     * @default "opaque"
     */
    kind?: SurfaceKind;

    /** Optional semantic tint applied to the base background. */
    intent?: SurfaceIntent;

    /** Optional drop-shadow lift, `0`–`4`. Omitted = no shadow. */
    shadow?: Shadow;
}

/**
 * Props for the `<Layer>` component (a tonal wash that stacks inside a
 * base).
 */
export interface LayerProps extends React.ComponentPropsWithoutRef<"div"> {
    /**
     * When true, `<Layer>` will **not** render an extra wrapper element.
     * Instead it clones & enhances its single child element (via {@link Slot}).
     */
    asChild?: boolean;

    /**
     * Optional semantic tint for the wash. Omitted = the subtle "none" family.
     */
    intent?: SurfaceIntent;

    /**
     * Position in the tonal stack, `0..N`. Unbounded — the same family stacks
     * to arbitrary depth by nesting `<Layer>`s. This value is metadata
     * (exposed as the `data-layer-index` attribute); the visual depth comes
     * from compositing nested washes, not from this number.
     *
     * @default 0
     */
    index?: number;
}
