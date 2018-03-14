/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITableLoadingExampleState {
    cellsLoading?: boolean;
    columnHeadersLoading?: boolean;
    rowHeadersLoading?: boolean;
}
export declare class TableLoadingExample extends BaseExample<ITableLoadingExampleState> {
    state: ITableLoadingExampleState;
    protected className: string;
    private handleCellsLoading;
    private handleColumnHeadersLoading;
    private handleRowHeadersLoading;
    renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderColumns();
    private renderCell;
    private formatColumnName;
}
