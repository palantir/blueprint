/// <reference types="react" />
import { Intent } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IEditableTextExampleState {
    confirmOnEnterKey?: boolean;
    intent?: Intent;
    maxLength?: number;
    report?: string;
    selectAllOnFocus?: boolean;
}
export declare class EditableTextExample extends BaseExample<IEditableTextExampleState> {
    state: IEditableTextExampleState;
    private handleIntentChange;
    private toggleSelectAll;
    private toggleSwap;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleReportChange;
    private handleMaxLengthChange;
}
