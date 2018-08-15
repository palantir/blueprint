/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, HTMLDivProps, IProps } from "../../common/props";

export interface IControlGroupProps extends IProps, HTMLDivProps {
    /**
     * Whether the control group should take up the full width of its container.
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the control group should appear with vertical styling.
     * @default false
     */
    vertical?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class ControlGroup extends React.PureComponent<IControlGroupProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ControlGroup`;

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
