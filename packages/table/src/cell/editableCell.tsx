
/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, EditableText } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { Draggable } from "../interactions/draggable";
import { ICellProps } from "./cell";

export interface IEditableCellProps extends ICellProps {
    /**
     * The value displayed in the text box. Be sure to update this value when
     * rendering this component after a confirmed change.
     */
    value?: string;

    /**
     * A listener that is triggered if the user cancels the edit. This is
     * important to listen to if you are doing anything with onChange events,
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
     * usually due to the <kbd class="pt-key">return</kbd> (or
     * <kbd class="pt-key">enter</kbd>) key press.
     */
    onConfirm?: (value: string) => void;
}

export class EditableCell extends React.Component<IEditableCellProps, {}> {
    private cellElement: HTMLElement;

    public render() {
        const { className, value, intent, onCancel, onChange, onConfirm, style, tooltip } = this.props;
        return (
            <div
                className={classNames(className, Classes.intentClass(intent), "bp-table-cell")}
                style={style}
                title={tooltip}
                ref={this.handleCellRef}
            >
                <Draggable onDoubleClick={this.handleCellDoubleClick}>
                    <EditableText
                        className={"bp-table-editable-name"}
                        defaultValue={value}
                        intent={intent}
                        minWidth={null}
                        onCancel={onCancel}
                        onChange={onChange}
                        onConfirm={onConfirm}
                        placeholder=""
                        selectAllOnFocus={true}
                    />
                </Draggable>
            </div>
        );
    }

    private handleCellRef = (ref: HTMLElement) => {
        this.cellElement = ref;
    }

    private handleCellDoubleClick = (_event: MouseEvent) => {
        if (this.cellElement == null) {
            return;
        }

        const focusable = (this.cellElement.querySelector(".pt-editable-text") as HTMLElement);
        if (focusable.focus != null) {
            focusable.focus();
        }
    }
}
