/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { forwardRef } from "react";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Slot } from "../slot/slot";

import type { LayerProps } from "./surfaceProps";

const NS = Classes.getClassNamespace();

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
            className={classNames(Classes.LAYER, `${NS}-layer-${intent ?? "none"}`, className)}
            data-layer-index={index}
            ref={ref}
        />
    );
});

Layer.displayName = `${DISPLAYNAME_PREFIX}.Layer`;
