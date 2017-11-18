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
export interface ILabelProps extends React.HTMLProps<HTMLDivElement>, IProps {
    /**
     * Whether the label is non-interactive or not.
     * @default false
     */
    disabled?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@PureRender
export class Label extends React.Component<ILabelProps, {}> {
    public static displayName = "Blueprint.Label";

    public defaultProps: ILabelProps = {
        disabled: false,
    };

    public render() {
        const { children, className, disabled, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.LABEL,
            {
                [Classes.DISABLED]: disabled,
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
