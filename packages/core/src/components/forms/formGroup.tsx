/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, IntentProps, Props } from "../../common/props";

// eslint-disable-next-line deprecation/deprecation
export type FormGroupProps = IFormGroupProps;
/** @deprecated use FormGroupProps */
export interface IFormGroupProps extends IntentProps, Props {
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

@polyfill
export class FormGroup extends AbstractPureComponent2<FormGroupProps> {
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
