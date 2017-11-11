/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

// allow the empty interface so we can label it clearly in the docs
// tslint:disable-next-line:no-empty-interface
export interface INavbarProps extends IProps {
    // Empty
}

export const Navbar: React.SFC<INavbarProps & { children?: React.ReactNode }> = ({ children, className }) => (
    <div className={classNames(Classes.NAVBAR, className)}>{children}</div>
);
