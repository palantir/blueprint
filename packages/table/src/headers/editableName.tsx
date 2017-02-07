/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { EditableText, IIntentProps, IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

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
     * usually due to the <code>return</code> (or <code>enter</code>) key press.
     */
    onConfirm?: (value: string) => void;
}

export class EditableName extends React.Component<IEditableNameProps, {}> {
    public render() {
        const { className, intent, name, onCancel, onChange, onConfirm } = this.props;
        return (
            <EditableText
                className={classNames(className, "bp-table-editable-name")}
                defaultValue={name}
                intent={intent}
                minWidth={null}
                onCancel={onCancel}
                onChange={onChange}
                onConfirm={onConfirm}
                placeholder=""
                selectAllOnFocus={true}
            />
        );
    }
}
