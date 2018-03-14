/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IDateRangeInputExampleState {
    allowSingleDayRange?: boolean;
    closeOnSelection?: boolean;
    contiguousCalendarMonths?: boolean;
    disabled?: boolean;
    formatKey: string;
    reverseMonthAndYearMenus?: boolean;
    selectAllOnFocus?: boolean;
}
export declare class DateRangeInputExample extends BaseExample<IDateRangeInputExampleState> {
    state: IDateRangeInputExampleState;
    private toggleContiguous;
    private toggleDisabled;
    private toggleFormatKey;
    private toggleReverseMonthAndYearMenus;
    private toggleSelection;
    private toggleSelectAllOnFocus;
    private toggleSingleDay;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
}
