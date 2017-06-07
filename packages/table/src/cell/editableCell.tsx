/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import { EditableText, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { Utils } from "../index";
import { Draggable } from "../interactions/draggable";
import { Cell, ICellProps } from "./cell";

export interface IEditableCellProps extends ICellProps {
    /**
     * The value displayed in the text box. Be sure to update this value when
     * rendering this component after a confirmed change.
     */
    value?: string;

    /**
     * A listener that is triggered if the user cancels the edit. This is
     * important to listen to if you are doing anything with `onChange` events,
     * since you'll likely want to revert whatever changes you made. The
     * callback will also receive the row index and column index if they were
     * originally provided via props.
     */
    onCancel?: (value: string, rowIndex?: number, columnIndex?: number) => void;

    /**
     * A listener that is triggered as soon as the editable name is modified.
     * This can be due, for example, to keyboard input or the clipboard.
     * The callback will also receive the row index and column index if they
     * were originally provided via props.
     */
    onChange?: (value: string, rowIndex?: number, columnIndex?: number) => void;

    /**
     * A listener that is triggered once the editing is confirmed. This is
     * usually due to the <code>return</code> (or <code>enter</code>) key press.
     * The callback will also receive the row index and column index if they
     * were originally provided via props.
     */
    onConfirm?: (value: string, rowIndex?: number, columnIndex?: number) => void;
}

export interface IEditableCellState {
    isEditing: boolean;
}

export class EditableCell extends React.Component<IEditableCellProps, IEditableCellState> {
    public state = {
        isEditing: false,
    };

    public shouldComponentUpdate(nextProps: IEditableCellProps, nextState: IEditableCellState) {
        return !Utils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] })
            || !Utils.shallowCompareKeys(this.state, nextState)
            || !Utils.deepCompareKeys(this.props, nextProps, ["style"]);
    }

    public render() {
        const {
            onCancel,
            onChange,
            onConfirm,
            value,

            ...spreadableProps,
        } = this.props;

        const { isEditing } = this.state;
        const interactive = spreadableProps.interactive || isEditing;

        return (
            <Cell {...spreadableProps} truncated={false} interactive={interactive}>
                <Draggable
                    onActivate={this.handleCellActivate}
                    onDoubleClick={this.handleCellDoubleClick}
                    preventDefault={!interactive}
                    stopPropagation={interactive}
                >
                    <EditableText
                        className={Classes.TABLE_EDITABLE_NAME}
                        defaultValue={value}
                        intent={this.props.intent}
                        minWidth={null}
                        onCancel={this.handleCancel}
                        onChange={this.handleChange}
                        onConfirm={this.handleConfirm}
                        onEdit={this.handleEdit}
                        placeholder=""
                        selectAllOnFocus={true}
                    />
                </Draggable>
            </Cell>
        );
    }

    private handleEdit = () => {
        this.setState({ isEditing: true });
    }

    private handleCancel = (value: string) => {
        this.setState({ isEditing: false });
        this.invokeCallback(value, this.props.onCancel);
    }

    private handleChange = (value: string) => {
        this.invokeCallback(value, this.props.onChange);
    }

    private handleConfirm = (value: string) => {
        this.setState({ isEditing: false });
        this.invokeCallback(value, this.props.onConfirm);
    }

    private invokeCallback(value: string, callback: (value: string, rowIndex?: number, columnIndex?: number) => void) {
        // pass through the row and column indices if they were provided by the consumer
        const { rowIndex, columnIndex } = this.props;
        CoreUtils.safeInvoke(callback, value, rowIndex, columnIndex);
    }

    private handleCellActivate = (_event: MouseEvent) => {
        // Cancel edit of active cell when clicking away
        if (!this.state.isEditing && document.activeElement instanceof HTMLElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        return true;
    }

    private handleCellDoubleClick = (_event: MouseEvent) => {
        const cellElement = ReactDOM.findDOMNode(this) as HTMLElement;
        if (cellElement == null) {
            return;
        }

        const focusable = (cellElement.querySelector(".pt-editable-text") as HTMLElement);
        if (focusable.focus != null) {
            focusable.focus();
        }
    }
}
