/// <reference types="react" />
import * as React from "react";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITagInputExampleState {
    disabled?: boolean;
    fill?: boolean;
    intent?: boolean;
    large?: boolean;
    minimal?: boolean;
    values?: React.ReactNode[];
}
export declare class TagInputExample extends BaseExample<ITagInputExampleState> {
    state: ITagInputExampleState;
    private handleDisabledChange;
    private handleFillChange;
    private handleIntentChange;
    private handleLargeChange;
    private handleMinimalChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleChange;
    private handleClear;
}
