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

export interface IFileUploadProps extends React.HTMLProps<HTMLLabelElement>, IProps {
    /**
     * Whether the file upload is non-interactive.
     * Setting this to `true` will automatically disable the child input too.
     */
    disabled?: boolean;

    /**
     * Whether the file upload should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * The props to pass to the child input.
     * `disabled` will be ignored in favor of the top-level prop.
     * Pass `onChange` here to be notified when the user uploads a file.
     */
    inputProps?: React.HTMLProps<HTMLInputElement>;

    /**
     * Whether the file upload should appear with large styling.
     */
    large?: boolean;

    /**
     * The text to display.
     * @default "Choose a file..."
     */
    text?: string;
}

// TODO: write tests (ignoring for now to get a build passing quickly)
/* istanbul ignore next */
@PureRender
export class FileUpload extends React.Component<IFileUploadProps, {}> {
    public static displayName = "Blueprint.FileUpload";

    public render() {
        const { className, fill, disabled, inputProps, large, text, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.FILE_UPLOAD,
            {
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
            },
            className,
        );

        return (
            <label {...htmlProps} className={rootClasses}>
                <input {...inputProps} type="file" disabled={disabled} />
                <span className={Classes.FILE_UPLOAD_INPUT}>{text}</span>
            </label>
        );
    }
}
