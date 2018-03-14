/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ISliderExampleState {
    value1?: number;
    value2?: number;
    value3?: number;
    vertical?: boolean;
}
export declare class SliderExample extends BaseExample<ISliderExampleState> {
    state: ISliderExampleState;
    private toggleVertical;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private getChangeHandler(key);
    private renderLabel1(val);
    private renderLabel3(val);
}
