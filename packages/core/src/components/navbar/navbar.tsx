/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { HTMLDivProps, IProps } from "../../common/props";
import { NavbarDivider } from "./navbarDivider";
import { NavbarGroup } from "./navbarGroup";
import { NavbarHeading } from "./navbarHeading";

export { INavbarDividerProps } from "./navbarDivider";

// allow the empty interface so we can label it clearly in the docs
export interface INavbarProps extends IProps, HTMLDivProps {
    // Empty
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class Navbar extends React.PureComponent<INavbarProps, {}> {
    public static displayName = "Blueprint2.Navbar";

    public static Divider = NavbarDivider;
    public static Group = NavbarGroup;
    public static Heading = NavbarHeading;

    public render() {
        const { children, className, ...htmlProps } = this.props;
        return (
            <div className={classNames(Classes.NAVBAR, className)} {...htmlProps}>
                {children}
            </div>
        );
    }
}
