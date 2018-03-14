/// <reference types="react" />
import * as React from "react";
import { IconName } from "@blueprintjs/core";
export interface IDocsIconProps {
    group: string;
    name: string;
    tags: string;
    className: IconName;
}
export declare class DocsIcon extends React.PureComponent<IDocsIconProps, {}> {
    render(): JSX.Element;
    renderContextMenu(): JSX.Element;
    private handleClick16;
    private handleClick20;
}
