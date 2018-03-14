/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { TimePickerPrecision } from "@blueprintjs/datetime";
export interface ITimePickerExampleState {
    precision?: TimePickerPrecision;
    selectAllOnFocus?: boolean;
    showArrowButtons?: boolean;
    disabled?: boolean;
    minTime?: Date;
    maxTime?: Date;
}
export declare class TimePickerExample extends BaseExample<ITimePickerExampleState> {
    state: {
        disabled: boolean;
        precision: TimePickerPrecision;
        selectAllOnFocus: boolean;
        showArrowButtons: boolean;
    };
    private handlePrecisionChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private toggleShowArrowButtons;
    private toggleSelectAllOnFocus;
    private toggleDisabled;
    private changeMinHour;
    private changeMaxHour;
}
