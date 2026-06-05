/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { type CSSProperties, forwardRef } from "react";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Slot } from "../slot/slot";

import type { LayerProps, SurfaceProps } from "./surfaceProps";

/**
 * Surface component.
 *
 * The base of a BP7 surface — an `opaque` or `glass` background that may
 * lift off the page via `shadow`. Tonal washes stack inside it via {@link Layer}.
 *
 * @see https://blueprintjs.com/docs/#labs/components/surface
 */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
    { asChild, className, kind = "opaque", intent, shadow, elevation = 0, bordered = false, style, children, ...props },
    ref,
) {
    const Component = asChild ? Slot : "div";

    return (
        <Component
            {...props}
            className={classNames(Classes.SURFACE, className)}
            data-kind={kind}
            data-intent={intent}
            data-shadow={shadow}
            data-bordered={bordered}
            style={{ ...style, "--bp-surface-elevation": elevation } as CSSProperties}
            ref={ref}
        >
            {children}
        </Component>
    );
});

Surface.displayName = `${DISPLAYNAME_PREFIX}.Surface`;

/**
 * Layer component.
 *
 * A tonal wash that stacks inside a {@link Surface}. Each `<Layer>` paints one
 * wash; nesting them composites the washes for arbitrary depth. The `index` is
 * exposed as `data-layer-index` for tooling/debugging.
 *
 * @see https://blueprintjs.com/docs/#labs/components/surface
 */

export const Layer = forwardRef<HTMLDivElement, LayerProps>(function Layer(
    { asChild, className, intent, index = 0, ...props },
    ref,
) {
    const Component = asChild ? Slot : "div";

    return (
        <Component
            {...props}
            className={classNames(Classes.LAYER, className)}
            data-intent={intent ?? "none"}
            data-layer-index={index}
            ref={ref}
        />
    );
});

Layer.displayName = `${DISPLAYNAME_PREFIX}.Layer`;
