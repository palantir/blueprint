/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITableFreezingExampleState {
    numFrozenColumns?: number;
    numFrozenRows?: number;
}
export declare class TableFreezingExample extends BaseExample<ITableFreezingExampleState> {
    render(): JSX.Element;
    renderCell: (rowIndex: number, columnIndex: number) => JSX.Element;
    renderColumns: () => JSX.Element[];
}
