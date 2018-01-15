/// <reference types="react" />
import { TabId } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITabsExampleState {
    activeTabId?: TabId;
    activePanelOnly?: boolean;
    animate?: boolean;
    navbarTabId?: TabId;
    vertical?: boolean;
}
export declare class TabsExample extends BaseExample<ITabsExampleState> {
    state: ITabsExampleState;
    private toggleActiveOnly;
    private toggleAnimate;
    private toggleVertical;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleNavbarTabChange;
    private handleTabChange;
}
