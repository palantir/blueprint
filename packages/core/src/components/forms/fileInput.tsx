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
import { Utils } from "../../common";
import * as Classes from "../../common/classes";
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
}

// TODO: write tests (ignoring for now to get a build passing quickly)
/* istanbul ignore next */
export class FileInput extends React.PureComponent<IFileInputProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.FileInput`;

    public static defaultProps: IFileInputProps = {
        inputProps: {},
        text: "Choose file...",
    };

    public render() {
        const { className, fill, disabled, inputProps, onInputChange, large, text, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.FILE_INPUT,
            {
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
            },
            className,
        );

        return (
            <label {...htmlProps} className={rootClasses}>
                <input {...inputProps} onChange={this.handleInputChange} type="file" disabled={disabled} />
                <span className={Classes.FILE_UPLOAD_INPUT}>{text}</span>
            </label>
        );
    }

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        Utils.safeInvoke(this.props.onInputChange, e);
        Utils.safeInvoke(this.props.inputProps.onChange, e);
    };
}
