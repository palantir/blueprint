/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IActionProps, ILinkProps } from "../../common/props";
import { Icon } from "../icon/icon";

export interface IBreadcrumbProps extends IActionProps, ILinkProps {
    /** Whether this breadcrumb is the current breadcrumb. */
    current?: boolean;
}

export const Breadcrumb: React.FunctionComponent<IBreadcrumbProps> = breadcrumbProps => {
    const classes = classNames(
        Classes.BREADCRUMB,
        {
            [Classes.BREADCRUMB_CURRENT]: breadcrumbProps.current,
            [Classes.DISABLED]: breadcrumbProps.disabled,
        },
        breadcrumbProps.className,
    );

    const icon = breadcrumbProps.icon != null ? <Icon icon={breadcrumbProps.icon} /> : undefined;

    if (breadcrumbProps.href == null && breadcrumbProps.onClick == null) {
        return (
            <span className={classes}>
                {icon}
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
            {icon}
            {breadcrumbProps.text}
            {breadcrumbProps.children}
        </a>
    );
};
