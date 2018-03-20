/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { Alignment } from "../../common/alignment";
import * as Classes from "../../common/classes";
import { HTMLDivProps, IProps } from "../../common/props";

export interface INavbarGroupProps extends IProps, HTMLDivProps {
    /**
     * The side of the navbar on which the group should appear.
     * The `Alignment` enum provides constants for these values.
     * @default Alignment.LEFT
     */
    align?: Alignment;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class NavbarGroup extends React.PureComponent<INavbarGroupProps, {}> {
    public static displayName = "Blueprint2.NavbarGroup";

    public static defaultProps: INavbarGroupProps = {
        align: Alignment.LEFT,
    };

    public render() {
        const { align, children, className, ...htmlProps } = this.props;
        const classes = classNames(Classes.NAVBAR_GROUP, Classes.alignmentClass(align), className);
        return (
            <div className={classes} {...htmlProps}>
                {children}
            </div>
        );
    }
}
