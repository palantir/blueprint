/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { EditableText, IIntentProps, IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as Classes from "../common/classes";

export interface IEditableNameProps extends IIntentProps, IProps {
    /**
     * The name displayed in the text box. Be sure to update this value when
     * rendering this component after a confirmed change.
     */
    name?: string;

    /**
     * A listener that is triggered if the user cancels the edit. This is
     * important to listen to if you are doing anything with `onChange` events,
     * since you'll likely want to revert whatever changes you made.
     */
    onCancel?: (value: string, columnIndex?: number) => void;

    /**
     * A listener that is triggered as soon as the editable name is modified.
     * This can be due, for example, to keyboard input or the clipboard.
     */
    onChange?: (value: string, columnIndex?: number) => void;

    /**
     * A listener that is triggered once the editing is confirmed. This is
     * usually due to the `return` (or `enter`) key press.
     */
    onConfirm?: (value: string, columnIndex?: number) => void;
}

@PureRender
export class EditableName extends React.Component<IEditableNameProps, {}> {
    public render() {
        const { className, intent, name } = this.props;
        return (
            <EditableText
                className={classNames(className, Classes.TABLE_EDITABLE_NAME)}
                defaultValue={name}
                intent={intent}
                minWidth={null}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onConfirm={this.handleConfirm}
                placeholder=""
                selectAllOnFocus={true}
            />
        );
    }

    private handleCancel = (value: string) => {
        this.invokeCallback(this.props.onCancel, value);
    };

    private handleChange = (value: string) => {
        this.invokeCallback(this.props.onChange, value);
    };

    private handleConfirm = (value: string) => {
        this.invokeCallback(this.props.onConfirm, value);
    };

    private invokeCallback(callback: (value: string, rowIndex?: number, columnIndex?: number) => void, value: string) {
        // pass through the row and column indices if they were provided as props by the consumer
        // const { columnIndex } = this.props;
        CoreUtils.safeInvoke(callback, value);
    }
}
