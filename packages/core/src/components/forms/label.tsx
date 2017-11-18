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
     * Whether the label is non-interactive.
     * Be sure to explicitly disable any child controls as well.
     */
    disabled?: boolean;

    /** The helper text to show next to the label. */
    helperText?: JSX.Element | string;

    /** The text to show in the label. */
    text: JSX.Element | string;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@PureRender
export class Label extends React.Component<ILabelProps, {}> {
    public static displayName = "Blueprint.Label";

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
            <div {...htmlProps} className={rootClasses}>
                {text}
                <span className={classNames(Classes.TEXT_MUTED)}>{helperText}</span>
                {children}
            </div>
        );
    }
}
