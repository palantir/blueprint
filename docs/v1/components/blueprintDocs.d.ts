/// <reference types="react" />
import { IPackageInfo } from "@blueprintjs/docs-data";
import { IDocumentationProps } from "@blueprintjs/docs-theme";
import * as React from "react";
/** Return the current theme className. */
export declare function getTheme(): string;
/** Persist the current theme className in local storage. */
export declare function setTheme(themeName: string): void;
export interface IBlueprintDocsProps extends Pick<IDocumentationProps, "defaultPageId" | "docs" | "tagRenderers"> {
    releases: IPackageInfo[];
    versions: IPackageInfo[];
}
export declare class BlueprintDocs extends React.Component<IBlueprintDocsProps, {
    themeName: string;
}> {
    state: {
        themeName: string;
    };
    render(): JSX.Element;
    private renderVersionsMenu();
    private handleComponentUpdate;
    private handleToggleDark;
}
