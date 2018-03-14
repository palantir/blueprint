/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import * as React from "react";
export declare const Moment: React.SFC<{
    date: Date;
    format?: string;
}>;
export interface IDatePickerExampleState {
    date?: Date;
    reverseMonthAndYearMenus?: boolean;
    showActionsBar?: boolean;
}
export declare class DatePickerExample extends BaseExample<IDatePickerExampleState> {
    state: IDatePickerExampleState;
    private toggleActionsBar;
    private toggleReverseMonthAndYearMenus;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private handleDateChange;
}
