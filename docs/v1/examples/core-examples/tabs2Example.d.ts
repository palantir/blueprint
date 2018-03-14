/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITabs2ExampleState {
    activeTabId?: string;
    activePanelOnly?: boolean;
    animate?: boolean;
    navbarTabId?: string;
    vertical?: boolean;
}
export declare class Tabs2Example extends BaseExample<ITabs2ExampleState> {
    state: ITabs2ExampleState;
    private toggleActiveOnly;
    private toggleAnimate;
    private toggleVertical;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleNavbarTabChange;
    private handleTabChange;
}
