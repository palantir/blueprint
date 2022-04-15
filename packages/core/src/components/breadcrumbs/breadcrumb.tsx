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
import { ActionProps, LinkProps } from "../../common/props";
import { Icon } from "../icon/icon";

// eslint-disable-next-line deprecation/deprecation
export type BreadcrumbProps = IBreadcrumbProps;
/** @deprecated use BreadcrumbProps */
export interface IBreadcrumbProps extends ActionProps, LinkProps {
    children?: React.ReactNode;

    /** Whether this breadcrumb is the current breadcrumb. */
    current?: boolean;

    /**
     * Pass through value to icon's title attribute. Should be used for breadcrumbs without
     * text or children defined.
     */
    iconTitle?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = props => {
    const classes = classNames(
        Classes.BREADCRUMB,
        {
            [Classes.BREADCRUMB_CURRENT]: props.current,
            [Classes.DISABLED]: props.disabled,
        },
        props.className,
    );

    const icon = props.icon != null ? <Icon title={props.iconTitle} icon={props.icon} /> : undefined;

    if (props.href == null && props.onClick == null) {
        return (
            <span className={classes}>
                {icon}
                {props.text}
                {props.children}
            </span>
        );
    }
    return (
        <a
            className={classes}
            href={props.href}
            onClick={props.disabled ? undefined : props.onClick}
            tabIndex={props.disabled ? undefined : 0}
            target={props.target}
        >
            {icon}
            {props.text}
            {props.children}
        </a>
    );
};
