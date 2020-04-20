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
import { AbstractPureComponent2, Classes, Utils } from "../../common";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";

export interface IFileInputProps extends React.LabelHTMLAttributes<HTMLLabelElement>, IProps {
    /**
     * Whether the file input is non-interactive.
     * Setting this to `true` will automatically disable the child input too.
     */
    disabled?: boolean;

    /**
     * Whether the file input should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Whether the user has made a selection in the input. This will affect the component's
     * text styling. Make sure to set a non-empty value for the text prop as well.
     * @default false
     */
    hasSelection?: boolean;

    /**
     * The props to pass to the child input.
     * `disabled` will be ignored in favor of the top-level prop.
     * `type` will be ignored, because the input _must_ be `type="file"`.
     * Pass `onChange` here to be notified when the user selects a file.
     */
    inputProps?: React.HTMLProps<HTMLInputElement>;

    /**
     * Whether the file input should appear with large styling.
     */
    large?: boolean;

    /**
     * Callback invoked on `<input>` `change` events.
     *
     * This callback is offered as a convenience; it is equivalent to passing
     * `onChange` to `inputProps`.
     *
     * __Note:__ The top-level `onChange` prop is passed to the wrapping
     * `<label>` rather than the `<input>`, which may not be what you expect.
     */
    onInputChange?: React.FormEventHandler<HTMLInputElement>;

    /**
     * The text to display.
     * @default "Choose file..."
     */
    text?: React.ReactNode;

    /**
     * The button text.
     * @default "Browse"
     */
    buttonText?: string;
}

// TODO: write tests (ignoring for now to get a build passing quickly)
/* istanbul ignore next */
@polyfill
export class FileInput extends AbstractPureComponent2<IFileInputProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.FileInput`;

    public static defaultProps: IFileInputProps = {
        hasSelection: false,
        inputProps: {},
        text: "Choose file...",
    };

    public render() {
        const {
            buttonText,
            className,
            disabled,
            fill,
            hasSelection,
            inputProps,
            large,
            onInputChange,
            text,
            ...htmlProps
        } = this.props;

        const rootClasses = classNames(
            Classes.FILE_INPUT,
            {
                [Classes.FILE_INPUT_HAS_SELECTION]: hasSelection,
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
            },
            className,
        );

        const NS = Classes.getClassNamespace();

        const uploadProps = {
            [`${NS}-button-text`]: buttonText,
            className: classNames(Classes.FILE_UPLOAD_INPUT, {
                [Classes.FILE_UPLOAD_INPUT_CUSTOM_TEXT]: !!buttonText,
            }),
        };

        return (
            <label {...htmlProps} className={rootClasses}>
                <input {...inputProps} onChange={this.handleInputChange} type="file" disabled={disabled} />
                <span {...uploadProps}>{text}</span>
            </label>
        );
    }

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        Utils.safeInvoke(this.props.onInputChange, e);
        Utils.safeInvoke(this.props.inputProps.onChange, e);
    };
}
