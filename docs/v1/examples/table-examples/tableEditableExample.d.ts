/// <reference types="react" />
import { Intent } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITableEditableExampleState {
    columnNames?: string[];
    sparseCellData?: {
        [key: string]: string;
    };
    sparseCellIntent?: {
        [key: string]: Intent;
    };
    sparseColumnIntents?: Intent[];
}
export declare class TableEditableExample extends BaseExample<ITableEditableExampleState> {
    static dataKey: (rowIndex: number, columnIndex: number) => string;
    state: ITableEditableExampleState;
    render(): JSX.Element;
    renderCell: (rowIndex: number, columnIndex: number) => JSX.Element;
    renderColumnHeader: (columnIndex: number) => JSX.Element;
    private isValidValue(value);
    private nameValidator;
    private nameSetter;
    private cellValidator;
    private cellSetter;
    private setArrayState<T>(key, index, value);
    private setSparseState<T>(stateKey, dataKey, value);
}
