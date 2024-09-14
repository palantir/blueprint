/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { forwardRef, useMemo } from "react";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Slot } from "../slot/slot";

import type { As, BoxComponent, BoxProps } from "./boxProps";
import { buildStyles } from "./buildStyles";

/**
 * Box component.
 *
 * @see https://blueprintjs.com/docs/#core/components/box
 */
export const Box = forwardRef(function Box<T extends React.ElementType = "div">(
    { as, asChild, className, ...props }: BoxProps<T> & { as?: T },
    ref: React.ForwardedRef<unknown>,
) {
    const Component: As = asChild ? Slot : as ?? "div";
    const { generatedClassNames, passThroughProps } = useMemo(() => buildStyles(props), [props]);

    return (
        <Component
            {...passThroughProps}
            className={classNames(className, Classes.BOX, generatedClassNames)}
            ref={ref}
        />
    );
}) as unknown as BoxComponent;

Box.displayName = `${DISPLAYNAME_PREFIX}.Box`;
