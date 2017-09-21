/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { EditableText, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { Utils } from "../common/utils";
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

export class EditableCell extends React.Component<IEditableCellProps, IEditableCellState> {
    public static defaultProps = {
        truncated: true,
        wrapText: false,
    };

    public constructor(props: IEditableCellProps, context?: any) {
        super(props, context);
        this.state = {
            isEditing: false,
            savedValue: props.value,
        };
    }

    public shouldComponentUpdate(nextProps: IEditableCellProps, nextState: IEditableCellState) {
        return (
            !Utils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !Utils.shallowCompareKeys(this.state, nextState) ||
            !Utils.deepCompareKeys(this.props, nextProps, ["style"])
        );
    }

    public componentWillReceiveProps(nextProps: IEditableCellProps) {
        const { value } = nextProps;
        this.setState({ savedValue: value, dirtyValue: value });
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
                    className={Classes.TABLE_EDITABLE_NAME}
                    intent={spreadableProps.intent}
                    minWidth={null}
                    onCancel={this.handleCancel}
                    onChange={this.handleChange}
                    onConfirm={this.handleConfirm}
                    onEdit={this.handleEdit}
                    placeholder=""
                    selectAllOnFocus={true}
                    value={dirtyValue}
                />
            );
        } else {
            const textClasses = classNames({
                [Classes.TABLE_TRUNCATED_TEXT]: truncated,
                [Classes.TABLE_NO_WRAP_TEXT]: !wrapText,
            });

            cellContents = <div className={textClasses}>{savedValue}</div>;
        }

        return (
            <Cell {...spreadableProps} truncated={false} interactive={interactive}>
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
