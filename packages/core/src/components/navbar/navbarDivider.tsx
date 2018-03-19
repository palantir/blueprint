/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { HTMLDivProps, IProps } from "../../common/props";

// allow the empty interface so we can label it clearly in the docs
export interface INavbarDividerProps extends IProps, HTMLDivProps {
    // Empty
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class NavbarDivider extends React.PureComponent<INavbarDividerProps, {}> {
    public static displayName = "Blueprint2.NavbarDivider";

    public render() {
        const { className, ...htmlProps } = this.props;
        return <div className={classNames(Classes.NAVBAR_DIVIDER, className)} {...htmlProps} />;
    }
}
