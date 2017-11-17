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

export interface INavbarGroupProps extends React.HTMLProps<HTMLDivElement>, IProps {
    /**
     * The side of the navbar on which the group should appear.
     * @default "left"
     */
    align?: "left" | "right";
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@PureRender
export class NavbarGroup extends React.Component<INavbarGroupProps, {}> {
    public static displayName = "Blueprint.NavbarGroup";

    public static defaultProps: INavbarGroupProps = {
        align: "left",
    };

    public render() {
        const { align, children, className: propsClassName, ...htmlProps } = this.props;
        const className = classNames(
            Classes.NAVBAR_GROUP,
            {
                [Classes.ALIGN_LEFT]: align === "left",
                [Classes.ALIGN_RIGHT]: align === "right",
            },
            propsClassName,
        );
        return (
            <div className={className} {...htmlProps}>
                {children}
            </div>
        );
    }
}
