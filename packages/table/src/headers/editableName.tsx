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

import { DISPLAYNAME_PREFIX, EditableText, type IntentProps, type Props } from "@blueprintjs/core";

import * as Classes from "../common/classes";

export interface EditableNameProps extends IntentProps, Props, React.RefAttributes<HTMLDivElement> {
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

export interface EditableNameState {
    isEditing?: boolean;
    savedName?: string;
    dirtyName?: string;
}

/**
 * Editable name component.
 *
 * @see https://blueprintjs.com/docs/#table/api.editablename
 */
export const EditableName: React.FC<EditableNameProps> = React.forwardRef((props, ref) => {
    const { className, name, index, intent, onCancel, onChange, onConfirm } = props;
    const [dirtyName, setDirtyName] = React.useState(name);
    const [isEditing, setIsEditing] = React.useState(false);
    const [savedName, setSavedName] = React.useState(name);

    React.useEffect(() => {
        setDirtyName(name);
        setSavedName(name);
    }, [name]);

    const handleEdit = React.useCallback(() => {
        setIsEditing(true);
        setDirtyName(savedName);
    }, [savedName]);

    const handleCancel = React.useCallback(
        (value: string) => {
            // don't strictly need to clear the dirtyName, but it's better hygiene
            setIsEditing(false);
            setDirtyName(undefined);
            onCancel?.(value, index);
        },
        [onCancel, index],
    );

    const handleChange = React.useCallback(
        (value: string) => {
            setDirtyName(value);
            onChange?.(value, index);
        },
        [onChange, index],
    );

    const handleConfirm = React.useCallback(
        (value: string) => {
            setIsEditing(false);
            setSavedName(value);
            setDirtyName(undefined);
            onConfirm?.(value, index);
        },
        [onConfirm, index],
    );

    return (
        <EditableText
            className={classNames(className, Classes.TABLE_EDITABLE_NAME)}
            defaultValue={name}
            elementRef={ref}
            intent={intent}
            minWidth={0}
            onCancel={handleCancel}
            onChange={handleChange}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
            placeholder=""
            selectAllOnFocus={true}
            value={isEditing ? dirtyName : savedName}
        />
    );
});
EditableName.displayName = `${DISPLAYNAME_PREFIX}.EditableName`;
