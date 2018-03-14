/// <reference types="react" />
import { NumberRange } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IRangeSliderExampleState {
    range?: NumberRange;
    vertical?: boolean;
}
export declare class RangeSliderExample extends BaseExample<IRangeSliderExampleState> {
    state: IRangeSliderExampleState;
    private toggleVertical;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleValueChange;
}
