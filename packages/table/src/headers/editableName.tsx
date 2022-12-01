/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { EditableText, IntentProps, Props } from "@blueprintjs/core";

import * as Classes from "../common/classes";

export type EditableNameProps = IEditableNameProps;
export interface IEditableNameProps extends IntentProps, Props {
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

/**
 * Editable name component.
 *
 * @see https://blueprintjs.com/docs/#table/api.editablename
 */
export class EditableName extends React.PureComponent<IEditableNameProps, IEditableNameState> {
    public constructor(props: IEditableNameProps) {
        super(props);
        this.state = {
            dirtyName: props.name,
            isEditing: false,
            savedName: props.name,
        };
    }

    public componentDidUpdate(prevProps: IEditableNameProps) {
        const { name } = this.props;
        if (name !== prevProps.name) {
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
                minWidth={0}
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
        this.props.onCancel?.(value, this.props.index);
    };

    private handleChange = (value: string) => {
        this.setState({ dirtyName: value });
        this.props.onChange?.(value, this.props.index);
    };

    private handleConfirm = (value: string) => {
        this.setState({ isEditing: false, savedName: value, dirtyName: undefined });
        this.props.onConfirm?.(value, this.props.index);
    };
}
