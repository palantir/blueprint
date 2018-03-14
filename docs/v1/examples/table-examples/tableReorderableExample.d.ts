/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITableReorderableExampleState {
    columns?: JSX.Element[];
    data?: any[];
    useInteractionBar?: boolean;
}
export declare class TableReorderableExample extends BaseExample<ITableReorderableExampleState> {
    state: ITableReorderableExampleState;
    private toggleUseInteractionBar;
    componentDidMount(): void;
    componentDidUpdate(_nextProps: {}, nextState: ITableReorderableExampleState): void;
    renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element;
    private renderLetterCell;
    private renderFruitCell;
    private renderAnimalCell;
    private renderCountryCell;
    private renderCityCell;
    private handleColumnsReordered;
    private handleRowsReordered;
}
