/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IColumnLoadingExampleState {
    loadingColumn?: number;
}
export declare class ColumnLoadingExample extends BaseExample<IColumnLoadingExampleState> {
    state: IColumnLoadingExampleState;
    protected className: string;
    private handleLoadingColumnChange;
    renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element;
    private renderColumns();
    private renderCell;
    private formatColumnName;
    private loadingOptions;
}
