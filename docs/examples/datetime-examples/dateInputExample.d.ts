/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { TimePickerPrecision } from "@blueprintjs/datetime";
export interface IDateInputExampleState {
    closeOnSelection?: boolean;
    disabled?: boolean;
    formatKey?: string;
    reverseMonthAndYearMenus?: boolean;
    timePrecision?: TimePickerPrecision;
}
export declare class DateInputExample extends BaseExample<IDateInputExampleState> {
    state: IDateInputExampleState;
    private toggleSelection;
    private toggleDisabled;
    private toggleFormat;
    private toggleReverseMonthAndYearMenus;
    private toggleTimePrecision;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
}
