/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IIntentProps, IProps } from "../../common/props";

export interface IFormGroupProps extends IIntentProps, IProps {
    /**
     * Whether form group should appear as non-interactive.
     * Remember that `input` elements must be disabled separately.
     */
    disabled?: boolean;

    /**
     * Optional helper text. The given content will be wrapped in
     * `Classes.FORM_HELPER_TEXT` and displayed beneath `children`.
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
     * Whether this form input should appear as required (does not affect HTML form required status).
     * Providing a boolean `true` value will render a default "required" message after the `label` prop.
     * Providing a JSX value will render that content instead.
     *
     * _Note:_ the default message element is exposed as `FormGroup.DEFAULT_REQUIRED_CONTENT` and
     * can be changed to provide a new global default for your app.
     * @default false
     */
    requiredLabel?: boolean | React.ReactNode;
}

export class FormGroup extends React.PureComponent<IFormGroupProps, {}> {
    /**
     * Element used to render `required` message when a boolean value is
     * provided for that prop. Modifying the value of this property will change
     * the default globally in your app.
     *
     * Defaults to `<span class={Classes.TEXT_MUTED}>(required)</span>`.
     */
    public static DEFAULT_REQUIRED_CONTENT = <span className={Classes.TEXT_MUTED}>(required)</span>;

    public render() {
        const { children, label, labelFor } = this.props;
        return (
            <div className={this.getClassName()}>
                <label className={Classes.LABEL} htmlFor={labelFor}>
                    {label}
                    {this.maybeRenderRequiredLabel()}
                </label>
                <div className={Classes.FORM_CONTENT}>
                    {children}
                    {this.maybeRenderHelperText()}
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

    private maybeRenderRequiredLabel() {
        const { requiredLabel } = this.props;
        return requiredLabel === true ? FormGroup.DEFAULT_REQUIRED_CONTENT : requiredLabel;
    }

    private maybeRenderHelperText() {
        const { helperText } = this.props;
        if (!helperText) {
            return null;
        }
        return <div className={Classes.FORM_HELPER_TEXT}>{helperText}</div>;
    }
}
