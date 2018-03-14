/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { DateRange } from "@blueprintjs/datetime";
export interface IDateRangePickerExampleState {
    allowSingleDayRange?: boolean;
    contiguousCalendarMonths?: boolean;
    dateRange?: DateRange;
    maxDateIndex?: number;
    minDateIndex?: number;
    reverseMonthAndYearMenus?: boolean;
    shortcuts?: boolean;
}
export declare class DateRangePickerExample extends BaseExample<IDateRangePickerExampleState> {
    state: IDateRangePickerExampleState;
    private handleMaxDateIndexChange;
    private handleMinDateIndexChange;
    private toggleReverseMonthAndYearMenus;
    private toggleSingleDay;
    private toggleShortcuts;
    private toggleContiguousCalendarMonths;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleDateChange;
    private renderSelectMenu(label, selectedValue, options, onChange);
    private renderSelectMenuOptions(options);
}
