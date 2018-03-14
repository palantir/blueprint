/// <reference types="react" />
import { IPackageInfo } from "@blueprintjs/docs-data";
import * as React from "react";
export interface INavbarActionsProps {
    onToggleDark: (useDark: boolean) => void;
    releases: IPackageInfo[];
    useDarkTheme: boolean;
}
export declare class NavbarActions extends React.PureComponent<INavbarActionsProps, {}> {
    render(): JSX.Element;
    renderHotkeys(): JSX.Element;
    /**
     * Render a list of the latest artifacts versions.
     * Also include a link to the GitHub release notes.
     */
    private renderReleasesMenu();
    private handleDarkSwitchChange;
}
