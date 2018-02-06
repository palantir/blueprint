/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface INavbarGroupProps extends React.HTMLProps<HTMLDivElement>, IProps {
    /**
     * The side of the navbar on which the group should appear.
     * The `Alignment` enum provides constants for these values.
     * @default "left"
     */
    align?: "left" | "right";
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class NavbarGroup extends React.PureComponent<INavbarGroupProps, {}> {
    public static displayName = "Blueprint2.NavbarGroup";

    public static defaultProps: INavbarGroupProps = {
        align: "left",
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
