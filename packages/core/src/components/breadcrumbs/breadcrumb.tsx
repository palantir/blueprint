/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IActionProps, ILinkProps } from "../../common/props";

export interface IBreadcrumbProps extends IActionProps, ILinkProps {}

export const Breadcrumb: React.SFC<IBreadcrumbProps> = (breadcrumbProps) => {
    const classes = classNames(Classes.BREADCRUMB, {
        [Classes.DISABLED]: breadcrumbProps.disabled,
    }, breadcrumbProps.className);
    return (
        <a
            className={classes}
            href={breadcrumbProps.href}
            onClick={breadcrumbProps.disabled ? null : breadcrumbProps.onClick}
            tabIndex={breadcrumbProps.disabled ? null : 0}
            target={breadcrumbProps.target}
        >
            {breadcrumbProps.text}
        </a>
    );
};
