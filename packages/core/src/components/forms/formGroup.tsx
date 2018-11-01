/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IIntentProps, IProps } from "../../common/props";

export interface IFormGroupProps extends IIntentProps, IProps {
    /**
     * A space-delimited list of class names to pass along to the
     * `Classes.FORM_CONTENT` element that contains `children`.
     */
    contentClassName?: string;

    /**
     * Whether form group should appear as non-interactive.
     * Remember that `input` elements must be disabled separately.
     */
    disabled?: boolean;

    /**
     * Optional helper text. The given content will be wrapped in
     * `Classes.FORM_HELPER_TEXT` and displayed beneath `children`.
     * Helper text color is determined by the `intent`.
     */
    helperText?: React.ReactNode;

    /** Whether to render the label and children on a single line. */
    inline?: boolean;

    /** Label of this form group. */
    label?: React.ReactNode;

    /**
     * `id` attribute of the labelable form element that this `FormGroup` controls,
     * used as `<label for>` attribute.
     */
    labelFor?: string;

    /**
     * Optional secondary text that appears after the label.
     */
    labelInfo?: React.ReactNode;

    /** CSS properties to apply to the root element. */
    style?: React.CSSProperties;
}

export class FormGroup extends React.PureComponent<IFormGroupProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.FormGroup`;

    public render() {
        const { children, contentClassName, helperText, label, labelFor, labelInfo, style } = this.props;
        return (
            <div className={this.getClassName()} style={style}>
                {label && (
                    <label className={Classes.LABEL} htmlFor={labelFor}>
                        {label} <span className={Classes.TEXT_MUTED}>{labelInfo}</span>
                    </label>
                )}
                <div className={classNames(Classes.FORM_CONTENT, contentClassName)}>
                    {children}
                    {helperText && <div className={Classes.FORM_HELPER_TEXT}>{helperText}</div>}
                </div>
            </div>
        );
    }

    private getClassName() {
        const { className, disabled, inline, intent } = this.props;
        return classNames(
            Classes.FORM_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.DISABLED]: disabled,
                [Classes.INLINE]: inline,
            },
            className,
        );
    }
}
