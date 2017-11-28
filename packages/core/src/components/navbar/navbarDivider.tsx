/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

// allow the empty interface so we can label it clearly in the docs
// tslint:disable-next-line:no-empty-interface
export interface INavbarDividerProps extends React.HTMLProps<HTMLDivElement>, IProps {
    // Empty
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@PureRender
export class NavbarDivider extends React.Component<INavbarDividerProps, {}> {
    public static displayName = "Blueprint.NavbarDivider";

    public render() {
        const { className, ...htmlProps } = this.props;
        return <div className={classNames(Classes.NAVBAR_DIVIDER, className)} {...htmlProps} />;
    }
}
