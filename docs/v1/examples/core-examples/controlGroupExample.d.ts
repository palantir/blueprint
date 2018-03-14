/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IControlGroupExampleState {
    fill?: boolean;
    vertical?: boolean;
}
export declare class ControlGroupExample extends BaseExample<IControlGroupExampleState> {
    state: IControlGroupExampleState;
    private toggleFill;
    private toggleVertical;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
}
