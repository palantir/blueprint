/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface ILabelProps extends React.AllHTMLAttributes<HTMLLabelElement>, IProps {
    /**
     * Whether the label is non-interactive.
     * Be sure to explicitly disable any child controls as well.
     */
    disabled?: boolean;

    /** The helper text to show next to the label. */
    helperText?: React.ReactNode;

    /** The text to show in the label. */
    text: React.ReactNode;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class Label extends React.PureComponent<ILabelProps, {}> {
    public static displayName = "Blueprint2.Label";

    public render() {
        const { children, className, disabled, helperText, text, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.LABEL,
            {
                [Classes.DISABLED]: disabled,
            },
            className,
        );

        return (
            <label {...htmlProps} className={rootClasses}>
                {text}
                {helperText && <span className={classNames(Classes.TEXT_MUTED)}>{" " + helperText}</span>}
                {children}
            </label>
        );
    }
}
