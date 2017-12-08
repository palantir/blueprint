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

export interface IControlGroupProps extends React.AllHTMLAttributes<HTMLDivElement>, IProps {
    /**
     * Whether the control group should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Whether the button group should appear with vertical styling.
     */
    vertical?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@PureRender
export class ControlGroup extends React.Component<IControlGroupProps, {}> {
    public static displayName = "Blueprint.ControlGroup";

    public render() {
        const { children, className, fill, vertical, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.CONTROL_GROUP,
            {
                [Classes.FILL]: fill,
                [Classes.VERTICAL]: vertical,
            },
            className,
        );

        return (
            <div {...htmlProps} className={rootClasses}>
                {children}
            </div>
        );
    }
}

export const ControlGroupFactory = React.createFactory(ControlGroup);
