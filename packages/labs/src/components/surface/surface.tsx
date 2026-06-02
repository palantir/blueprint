/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { forwardRef } from "react";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Slot } from "../slot/slot";

import type { SurfaceProps } from "./surfaceProps";

const NS = Classes.getClassNamespace();

/**
 * Surface component.
 *
 * The base of a BP7 surface — an `opaque` or `glass` background that may
 * lift off the page via `shadow`. Tonal washes stack inside it via {@link Layer}.
 *
 * @see https://blueprintjs.com/docs/#labs/components/surface
 */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
    { asChild, className, kind = "opaque", intent, shadow, ...props },
    ref,
) {
    const Component = asChild ? Slot : "div";

    return (
        <Component
            {...props}
            className={classNames(
                Classes.SURFACE,
                `${NS}-surface-${kind}`,
                {
                    [`${NS}-surface-intent-${intent}`]: intent != null,
                    [`${NS}-surface-shadow-${shadow}`]: shadow != null,
                },
                className,
            )}
            ref={ref}
        />
    );
});

Surface.displayName = `${DISPLAYNAME_PREFIX}.Surface`;
