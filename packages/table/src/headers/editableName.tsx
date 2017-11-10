/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
    onCancel?: (value: string) => void;

    /**
     * A listener that is triggered as soon as the editable name is modified.
     * This can be due, for example, to keyboard input or the clipboard.
     */
    onChange?: (value: string) => void;

    /**
     * A listener that is triggered once the editing is confirmed. This is
     * usually due to the `return` (or `enter`) key press.
     */
    onConfirm?: (value: string) => void;

    /**
     * The index of the name in the header. If provided, this will be passed as an argument to any
     * callbacks when they are invoked.
     */
    index?: number;
}

export interface IEditableNameState {
    isEditing?: boolean;
    savedName?: string;
    dirtyName?: string;
}

@PureRender
export class EditableName extends React.Component<IEditableNameProps, IEditableNameState> {
    public constructor(props: IEditableNameProps, context?: any) {
        super(props, context);
        this.state = {
            dirtyName: props.name,
            isEditing: false,
            savedName: props.name,
        };
    }

    public componentWillReceiveProps(nextProps: IEditableNameProps) {
        const { name } = nextProps;
        if (name !== this.props.name) {
            this.setState({ savedName: name, dirtyName: name });
        }
    }

    public render() {
        const { className, intent, name } = this.props;
        const { isEditing, dirtyName, savedName } = this.state;
        return (
            <EditableText
                className={classNames(className, Classes.TABLE_EDITABLE_NAME)}
                defaultValue={name}
                intent={intent}
                minWidth={null}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onConfirm={this.handleConfirm}
                onEdit={this.handleEdit}
                placeholder=""
                selectAllOnFocus={true}
                value={isEditing ? dirtyName : savedName}
            />
        );
    }

    private handleEdit = () => {
        this.setState({ isEditing: true, dirtyName: this.state.savedName });
    };

    private handleCancel = (value: string) => {
        // don't strictly need to clear the dirtyName, but it's better hygiene
        this.setState({ isEditing: false, dirtyName: undefined });
        this.invokeCallback(this.props.onCancel, value);
    };

    private handleChange = (value: string) => {
        this.setState({ dirtyName: value });
        this.invokeCallback(this.props.onChange, value);
    };

    private handleConfirm = (value: string) => {
        this.setState({ isEditing: false, savedName: value, dirtyName: undefined });
        this.invokeCallback(this.props.onConfirm, value);
    };

    private invokeCallback(callback: (value: string, columnIndex?: number) => void, value: string) {
        const { index } = this.props;
        CoreUtils.safeInvoke(callback, value, index);
    }
}
