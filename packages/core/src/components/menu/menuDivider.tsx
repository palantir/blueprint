/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IMenuDividerProps extends IProps {
    /** This component does not support children. */
    children?: never;

    /** Optional header title. */
    title?: React.ReactNode;
}

export class MenuDivider extends React.Component<IMenuDividerProps, {}> {
    public static displayName = "Blueprint2.MenuDivider";

    public render() {
        const { className, title } = this.props;
        if (title == null) {
            // simple divider
            return <li className={classNames(Classes.MENU_DIVIDER, className)} />;
        } else {
            // section header with title
            return (
                <li className={classNames(Classes.MENU_HEADER, className)}>
                    <h6>{title}</h6>
                </li>
            );
        }
    }
}
