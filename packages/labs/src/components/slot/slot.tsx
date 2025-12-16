/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { Children, cloneElement, forwardRef, isValidElement } from "react";

/**
 * Slot component.
 */
export const Slot = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
    function Slot({ children, ...props }, ref) {
        if (isValidElement(children)) {
            return cloneElement(children, {
                ...props,
                ...children.props,
                className: classNames(props.className, children.props.className),
                ref,
                style: {
                    ...props.style,
                    ...children.props.style,
                },
            });
        }
        if (Children.count(children) > 1) {
            throw new TypeError("Only single element child is allowed in Slot");
        }
        return null;
    },
);
