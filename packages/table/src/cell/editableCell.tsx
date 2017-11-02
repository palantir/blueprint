/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { EditableText, Hotkey, Hotkeys, HotkeysTarget, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { Draggable } from "../interactions/draggable";
import { Cell, ICellProps } from "./cell";

export interface IEditableCellProps extends ICellProps {
    /**
     * Whether the given cell is the current active/focused cell.
     */
    isFocused?: boolean;

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
     * This can be due, for example, to keyboard input or the clipboard. The
     * callback will also receive the row index and column index if they were
     * originally provided via props.
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
    isEditing?: boolean;
    savedValue?: string;
    dirtyValue?: string;
}

@HotkeysTarget
export class EditableCell extends React.Component<IEditableCellProps, IEditableCellState> {
    public static defaultProps = {
        truncated: true,
        wrapText: false,
    };

    private cellRef: HTMLElement;
    private refHandlers = {
        cell: (ref: HTMLElement) => {
            this.cellRef = ref;
        },
    };

    public constructor(props: IEditableCellProps, context?: any) {
        super(props, context);
        this.state = {
            isEditing: false,
            savedValue: props.value,
        };
    }

    public componentDidMount() {
        this.checkShouldFocus();
    }

    public componentDidUpdate() {
        this.checkShouldFocus();
    }

    public shouldComponentUpdate(nextProps: IEditableCellProps, nextState: IEditableCellState) {
        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !CoreUtils.shallowCompareKeys(this.state, nextState) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, ["style"])
        );
    }

    public componentWillReceiveProps(nextProps: IEditableCellProps) {
        const { value } = nextProps;
        if (value !== this.props.value) {
            this.setState({ savedValue: value, dirtyValue: value });
        }
    }

    public render() {
        const { onCancel, onChange, onConfirm, truncated, wrapText, ...spreadableProps } = this.props;

        const { isEditing, dirtyValue, savedValue } = this.state;
        const interactive = spreadableProps.interactive || isEditing;

        let cellContents: JSX.Element = null;
        if (isEditing) {
            cellContents = (
                <EditableText
                    isEditing={true}
                    className={classNames(Classes.TABLE_EDITABLE_TEXT, Classes.TABLE_EDITABLE_NAME)}
                    intent={spreadableProps.intent}
                    minWidth={null}
                    onCancel={this.handleCancel}
                    onChange={this.handleChange}
                    onConfirm={this.handleConfirm}
                    onEdit={this.handleEdit}
                    placeholder=""
                    selectAllOnFocus={false}
                    value={dirtyValue}
                />
            );
        } else {
            const textClasses = classNames(Classes.TABLE_EDITABLE_TEXT, {
                [Classes.TABLE_TRUNCATED_TEXT]: truncated,
                [Classes.TABLE_NO_WRAP_TEXT]: !wrapText,
            });

            cellContents = <div className={textClasses}>{savedValue}</div>;
        }

        return (
            <Cell
                {...spreadableProps}
                truncated={false}
                interactive={interactive}
                cellRef={this.refHandlers.cell}
                onKeyPress={this.handleKeyPress}
            >
                <Draggable
                    onActivate={this.handleCellActivate}
                    onDoubleClick={this.handleCellDoubleClick}
                    preventDefault={false}
                    stopPropagation={interactive}
                >
                    {cellContents}
                </Draggable>
            </Cell>
        );
    }

    public renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey
                    key="edit-cell"
                    label="Edit the currently focused cell"
                    group="Table"
                    combo="f2"
                    onKeyDown={this.handleEdit}
                />
            </Hotkeys>
        );
    }

    private checkShouldFocus() {
        if (this.props.isFocused && !this.state.isEditing) {
            // don't focus if we're editing -- we'll lose the fact that we're editing
            this.cellRef.focus();
        }
    }

    private handleKeyPress = () => {
        if (this.state.isEditing || !this.props.isFocused) {
            return;
        }
        // setting dirty value to empty string because apparently the text field will pick up the key and write it in there
        this.setState({ isEditing: true, dirtyValue: "", savedValue: this.state.savedValue });
    };

    private handleEdit = () => {
        this.setState({ isEditing: true, dirtyValue: this.state.savedValue });
    };

    private handleCancel = (value: string) => {
        // don't strictly need to clear the dirtyValue, but it's better hygiene
        this.setState({ isEditing: false, dirtyValue: undefined });
        this.invokeCallback(this.props.onCancel, value);
    };

    private handleChange = (value: string) => {
        this.setState({ dirtyValue: value });
        this.invokeCallback(this.props.onChange, value);
    };

    private handleConfirm = (value: string) => {
        this.setState({ isEditing: false, savedValue: value, dirtyValue: undefined });
        this.invokeCallback(this.props.onConfirm, value);
    };

    private invokeCallback(callback: (value: string, rowIndex?: number, columnIndex?: number) => void, value: string) {
        // pass through the row and column indices if they were provided as props by the consumer
        const { rowIndex, columnIndex } = this.props;
        CoreUtils.safeInvoke(callback, value, rowIndex, columnIndex);
    }

    private handleCellActivate = (_event: MouseEvent) => {
        return true;
    };

    private handleCellDoubleClick = (_event: MouseEvent) => {
        this.handleEdit();
    };
}
