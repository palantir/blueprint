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
     * Underline behavior for the link.
     *
     * - "always": Always shows underline (default)
     * - "hover": Shows underline only on hover
     * - "none": Never shows underline
     *
     * @default "always"
     */
    underline?: "always" | "hover" | "none";

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
    ({ children, className, underline = "always", color = Intent.PRIMARY, ...htmlProps }, ref) => {
        const classes = classNames(
            Classes.LINK,
            {
                [Classes.LINK_UNDERLINE_ALWAYS]: underline === "always",
                [Classes.LINK_UNDERLINE_HOVER]: underline === "hover",
                [Classes.LINK_UNDERLINE_NONE]: underline === "none",
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
