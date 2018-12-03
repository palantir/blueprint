/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IActionProps, ILinkProps } from "../../common/props";

export interface IBreadcrumbProps extends IActionProps, ILinkProps {
    /** Whether this breadcrumb is the current breadcrumb. */
    current?: boolean;
}

export const Breadcrumb: React.SFC<IBreadcrumbProps> = breadcrumbProps => {
    const classes = classNames(
        Classes.BREADCRUMB,
        {
            [Classes.BREADCRUMB_CURRENT]: breadcrumbProps.current,
            [Classes.DISABLED]: breadcrumbProps.disabled,
        },
        breadcrumbProps.className,
    );
    if (breadcrumbProps.href == null && breadcrumbProps.onClick == null) {
        return (
            <span className={classes}>
                {breadcrumbProps.text}
                {breadcrumbProps.children}
            </span>
        );
    }
    return (
        <a
            className={classes}
            href={breadcrumbProps.href}
            onClick={breadcrumbProps.disabled ? null : breadcrumbProps.onClick}
            tabIndex={breadcrumbProps.disabled ? null : 0}
            target={breadcrumbProps.target}
        >
            {breadcrumbProps.text}
            {breadcrumbProps.children}
        </a>
    );
};
