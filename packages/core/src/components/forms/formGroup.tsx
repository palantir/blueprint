/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, type Intent } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type IntentProps, type Props } from "../../common/props";

export interface FormGroupProps extends IntentProps, Props, HTMLDivProps {
    /** Group contents. */
    children?: React.ReactNode;

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
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Optional helper text. The given content will be wrapped in
     * `Classes.FORM_HELPER_TEXT` and displayed beneath `children`.
     * Helper text color is determined by the `intent`.
     */
    helperText?: React.ReactNode;

    /** Whether to render the label and children on a single line. */
    inline?: boolean;

    /**
     * Visual intent to apply to helper text and sub label.
     * Note that child form elements need to have their own intents applied independently.
     */
    intent?: Intent;

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

    /**
     * Optional text for `label`. The given content will be wrapped in
     * `Classes.FORM_GROUP_SUB_LABEL` and displayed beneath `label`.
     */
    subLabel?: React.ReactNode;
}

/**
 * Form group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/form-group
 */
export const FormGroup: React.FC<FormGroupProps> = props => {
    const {
        children,
        className,
        contentClassName,
        disabled,
        fill,
        helperText,
        inline,
        intent,
        label,
        labelFor,
        labelInfo,
        style,
        subLabel,
        ...htmlProps
    } = props;

    const classes = classNames(
        Classes.FORM_GROUP,
        Classes.intentClass(intent),
        {
            [Classes.DISABLED]: disabled,
            [Classes.FILL]: fill,
            [Classes.INLINE]: inline,
        },
        className,
    );

    return (
        <div className={classes} style={style} {...htmlProps}>
            {label && (
                <label className={Classes.LABEL} htmlFor={labelFor}>
                    {label} <span className={Classes.TEXT_MUTED}>{labelInfo}</span>
                </label>
            )}
            {subLabel && <div className={Classes.FORM_GROUP_SUB_LABEL}>{subLabel}</div>}
            <div className={classNames(Classes.FORM_CONTENT, contentClassName)}>
                {children}
                {helperText && <div className={Classes.FORM_HELPER_TEXT}>{helperText}</div>}
            </div>
        </div>
    );
};

FormGroup.displayName = `${DISPLAYNAME_PREFIX}.FormGroup`;
