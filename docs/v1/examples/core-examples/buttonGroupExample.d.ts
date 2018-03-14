/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IButtonGroupExampleState {
    fill?: boolean;
    minimal?: boolean;
    large?: boolean;
    vertical?: boolean;
}
export declare class ButtonGroupExample extends BaseExample<IButtonGroupExampleState> {
    state: IButtonGroupExampleState;
    private handleFillChange;
    private handleLargeChange;
    private handleMinimalChange;
    private handleVerticalChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
}
