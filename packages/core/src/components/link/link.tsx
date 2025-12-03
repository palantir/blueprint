/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { forwardRef } from "react";

import { Classes, DISPLAYNAME_PREFIX, Intent, type Props } from "../../common";

export interface LinkProps
    extends Props,
        React.RefAttributes<HTMLAnchorElement>,
        React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * Child nodes to render inside the link.
     */
    children?: React.ReactNode;

    /**
     * Visual style variant for the link.
     *
     * @default "underline"
     */
    variant?: "underline" | "plain";

    /**
     * Color of the link text.
     *
     * - Intent colors: "primary", "success", "warning", "danger"
     * - "inherit": Inherits color from surrounding text
     *
     * @default Intent.PRIMARY
     */
    color?: Intent | "inherit";
}

/**
 * Link component.
 *
 * @see https://blueprintjs.com/docs/#core/components/link
 */
export const Link: React.FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ children, className, variant = "underline", color = Intent.PRIMARY, ...htmlProps }, ref) => {
        const classes = classNames(
            Classes.LINK,
            {
                [Classes.LINK_UNDERLINE]: variant === "underline",
                [Classes.LINK_PLAIN]: variant === "plain",
                [Classes.LINK_COLOR_INHERIT]: color === "inherit",
            },
            color !== "inherit" ? Classes.intentClass(color) : undefined,
            className,
        );

        return (
            <a {...htmlProps} className={classes} ref={ref}>
                {children}
            </a>
        );
    },
);

Link.displayName = `${DISPLAYNAME_PREFIX}.Link`;
