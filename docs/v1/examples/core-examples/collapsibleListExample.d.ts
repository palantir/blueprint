/// <reference types="react" />
import { CollapseFrom } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ICollapsibleListExampleState {
    collapseFrom?: CollapseFrom;
    visibleItemCount?: number;
}
export declare class CollapsibleListExample extends BaseExample<ICollapsibleListExampleState> {
    state: ICollapsibleListExampleState;
    private handleChangeCollapse;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderBreadcrumb(props);
    private handleChangeCount;
}
