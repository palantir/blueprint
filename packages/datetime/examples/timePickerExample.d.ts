/// <reference types="react" />
import BaseExample from "@blueprintjs/core/examples/common/baseExample";
import { TimePickerPrecision } from "../src";
export interface ITimePickerExampleState {
    precision?: TimePickerPrecision;
    showArrowButtons?: boolean;
}
export declare class TimePickerExample extends BaseExample<ITimePickerExampleState> {
    state: {
        precision: TimePickerPrecision;
        showArrowButtons: boolean;
    };
    private handlePrecisionChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private toggleshowArrowButtons;
}
