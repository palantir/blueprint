/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";
import { Intent } from "@blueprint/core";
import BaseExample from "@blueprint/core/examples/common/baseExample";
import { Column, ColumnHeaderCell, EditableCell, EditableName, Table } from "../src";

export class TableEditableExample extends BaseExample<{}> {

    public static dataKey = (rowIndex: number, columnIndex: number) => {
        return `${rowIndex}-${columnIndex}`;
    }

    public state = {
        columnNames: [
            "Please",
            "Rename",
            "Me",
        ],
        sparseCellData: {
            "1-1": "editable",
            "3-1": "validation 123",
        } as { [key: string]: string },
        sparseCellIntent: {
            "3-1": Intent.DANGER,
        } as { [key: string]: Intent },
        sparseColumnIntents: [] as Intent[],
    };

    public render() {
        const columns = this.state.columnNames.map((_: string, index: number) => {
            return (<Column key={index} renderCell={this.renderCell} renderColumnHeader={this.renderColumnHeader} />);
        });
        return (<Table numRows={7}>{columns}</Table>);
    }

    public renderCell = (rowIndex: number, columnIndex: number) => {
        const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (<EditableCell
            value={value == null ? "" : value}
            intent={this.state.sparseCellIntent[dataKey]}
            onCancel={this.cellValidator(rowIndex, columnIndex)}
            onChange={this.cellValidator(rowIndex, columnIndex)}
            onConfirm={this.cellSetter(rowIndex, columnIndex)}
        />);
    }

    public renderColumnHeader = (columnIndex: number) => {
        const renderName = (name: string) => {
            return (<EditableName
                name={name}
                intent={this.state.sparseColumnIntents[columnIndex]}
                onChange={this.nameValidator(columnIndex)}
                onCancel={this.nameValidator(columnIndex)}
                onConfirm={this.nameSetter(columnIndex)}
            />);
        };
        return (<ColumnHeaderCell
            name={this.state.columnNames[columnIndex]}
            renderName={renderName}
            useInteractionBar={true}
        />);
    }

    private isValidValue(value: string) {
        return /^[a-zA-Z]*$/.test(value);
    }

    private nameValidator = (index: number) => {
        return (name: string) => {
            const intent = this.isValidValue(name) ? null : Intent.DANGER;
            this.setArrayState("sparseColumnIntents", index, intent);
            this.setArrayState("columnNames", index, name);
        };
    }

    private nameSetter = (index: number) => {
        return (name: string) => {
            this.setArrayState("columnNames", index, name);
        };
    }

    private cellValidator = (rowIndex: number, columnIndex: number) => {
        const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = this.isValidValue(value) ? null : Intent.DANGER;
            this.setSparseState("sparseCellIntent", dataKey, intent);
            this.setSparseState("sparseCellData", dataKey, value);
        };
    }

    private cellSetter = (rowIndex: number, columnIndex: number) => {
        const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = this.isValidValue(value) ? null : Intent.DANGER;
            this.setSparseState("sparseCellData", dataKey, value);
            this.setSparseState("sparseCellIntent", dataKey, intent);
        };
    }

    private setArrayState<T>(key: string, index: number, value: T)  {
        const values = (this.state as any)[key].slice() as T[];
        values[index] = value;
        this.setState({ [key] : values });
    }

    private setSparseState<T>(stateKey: string, dataKey: string, value: T)  {
        const values = Object.assign({}, (this.state as any)[stateKey]) as {[key: string]: T};
        values[dataKey] = value;
        this.setState({ [stateKey] : values });
    }
}
