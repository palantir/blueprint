/// <reference types="react" />
import { Intent } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IButtonsExampleState {
    active?: boolean;
    disabled?: boolean;
    intent?: Intent;
    loading?: boolean;
    large?: boolean;
    minimal?: boolean;
    wiggling?: boolean;
}
export declare class ButtonsExample extends BaseExample<IButtonsExampleState> {
    state: IButtonsExampleState;
    private handleActiveChange;
    private handleDisabledChange;
    private handleLargeChange;
    private handleLoadingChange;
    private handleMinimalChange;
    private handleIntentChange;
    private wiggleTimeoutId;
    componentWillUnmount(): void;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private beginWiggling;
}
