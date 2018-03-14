/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface INavbarExampleState {
    alignRight?: boolean;
}
export declare class NavbarExample extends BaseExample<INavbarExampleState> {
    state: INavbarExampleState;
    private handleAlignRightChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
}
