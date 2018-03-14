/// <reference types="react" />
import { Intent } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IProgressExampleState {
    className?: string;
    hasValue?: boolean;
    intent?: Intent;
    value?: number;
}
export declare class ProgressExample extends BaseExample<IProgressExampleState> {
    state: IProgressExampleState;
    protected className: string;
    private handleIndeterminateChange;
    private handleModifierChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderLabel;
    private handleValueChange;
}
