/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IInputGroupExampleState {
    disabled?: boolean;
    filterValue?: string;
    large?: boolean;
    showPassword?: boolean;
    tagValue?: string;
}
export declare class InputGroupExample extends BaseExample<IInputGroupExampleState> {
    state: IInputGroupExampleState;
    private handleDisabledChange;
    private handleLargeChange;
    private handleFilterChange;
    private handleTagChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleLockClick;
}
