/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IMenuDividerProps extends IProps {
    /** Optional header title */
    title?: string;
}

export class MenuDivider extends React.Component<IMenuDividerProps, {}> {
    public static displayName = "Blueprint.MenuDivider";

    public render() {
        const { className, title } = this.props;
        if (title == null) {
            // simple divider
            return <li className={classNames(Classes.MENU_DIVIDER, className)} />;
        } else {
            // section header with title
            return <li className={classNames(Classes.MENU_HEADER, className)}><h6>{title}</h6></li>;
        }
    }
}

export var MenuDividerFactory = React.createFactory(MenuDivider);
