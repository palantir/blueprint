/// <reference types="react" />
import * as React from "react";
import { Elevation } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ICardExampleState {
    elevation?: Elevation;
    interactive?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}
export declare class CardExample extends BaseExample<ICardExampleState> {
    state: ICardExampleState;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleElevationChange;
    private handleInteractiveChange;
}
