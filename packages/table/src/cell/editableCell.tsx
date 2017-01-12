
/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { EditableText, safeInvoke } from "@blueprintjs/core";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";
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

export interface IEditableCellState {
    /**
     * Stores the editing state of the cell
     */
    isEditing: boolean;
}

@PureRender
export class EditableCell extends React.Component<IEditableCellProps, IEditableCellState> {
    public constructor(props: IEditableCellProps, context?: any) {
        super(props, context);
        this.state = {
            isEditing: false,
        };
    }

    public render() {
        const { value, intent, onChange } = this.props;
        const { isEditing } = this.state;
        const interactive = this.props.interactive || isEditing;

        return (
            <Cell {...this.props} truncated={false} interactive={interactive}>
                <Draggable
                    onActivate={this.handleCellActivate}
                    onDoubleClick={this.handleCellDoubleClick}
                    preventDefault={!interactive}
                    stopPropagation={interactive}
                >
                    <EditableText
                        className={"bp-table-editable-name"}
                        defaultValue={value}
                        intent={intent}
                        minWidth={null}
                        onCancel={this.handleCancel}
                        onChange={onChange}
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
        safeInvoke(this.props.onCancel, value);
    }

    private handleConfirm = (value: string) => {
        this.setState({ isEditing: false });
        safeInvoke(this.props.onConfirm, value);
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
