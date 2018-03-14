/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ICollapseExampleState {
    isOpen?: boolean;
    keepChildrenMounted?: boolean;
}
export declare class CollapseExample extends BaseExample<ICollapseExampleState> {
    state: ICollapseExampleState;
    private handleChildrenMountedChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleClick;
}
