/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export declare type CellsLoadingConfiguration = "all" | "first-column" | "first-row" | "none" | "random";
export declare const CellsLoadingConfiguration: {
    ALL: CellsLoadingConfiguration;
    FIRST_COLUMN: CellsLoadingConfiguration;
    FIRST_ROW: CellsLoadingConfiguration;
    NONE: CellsLoadingConfiguration;
    RANDOM: CellsLoadingConfiguration;
};
export interface ICellLoadingExampleState {
    configuration?: CellsLoadingConfiguration;
    randomNumbers?: number[];
}
export declare class CellLoadingExample extends BaseExample<ICellLoadingExampleState> {
    state: ICellLoadingExampleState;
    protected className: string;
    private handleConfigurationChange;
    renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element;
    private renderColumns();
    private renderCell;
    private renderColumnHeaderCell;
    private renderRowHeaderCell;
    private isLoading;
}
