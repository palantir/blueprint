/// <reference types="react" />
import * as React from "react";
import { IDocsIconProps as IIcon } from "./docsIcon";
export interface IIconsState {
    filter: string;
}
export interface IIconsProps {
    iconFilter?: (query: string, icon: IIcon) => boolean;
    iconRenderer?: (icon: IIcon, index: number) => JSX.Element;
    icons?: IIcon[];
}
export declare class Icons extends React.PureComponent<IIconsProps, IIconsState> {
    static defaultProps: IIconsProps;
    state: IIconsState;
    private iconGroups;
    constructor(props?: IIconsProps, context?: any);
    render(): JSX.Element;
    private maybeRenderIconGroup(groupName, index);
    private renderZeroState();
    private handleFilterChange;
}
