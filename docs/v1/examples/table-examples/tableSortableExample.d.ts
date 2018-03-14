/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export declare type ICellLookup = (rowIndex: number, columnIndex: number) => any;
export declare type ISortCallback = (columnIndex: number, comparator: (a: any, b: any) => number) => void;
export interface ISortableColumn {
    getColumn(getCellData: ICellLookup, sortColumn: ISortCallback): JSX.Element;
}
export declare class TableSortableExample extends BaseExample<{}> {
    state: {
        columns: ISortableColumn[];
        data: any[];
        sortedIndexMap: number[];
    };
    render(): JSX.Element;
    private getCellData;
    private renderBodyContextMenu;
    private sortColumn;
}
