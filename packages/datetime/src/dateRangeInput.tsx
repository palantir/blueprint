/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import {
    AbstractComponent,
    Button,
    Classes,
    InputGroup,
    Intent,
    IProps,
    Position,
} from "@blueprintjs/core";

import * as DateClasses from "./common/classes";
import {
    DateRange,
} from "./common/dateUtils";
import {
    getDefaultMaxDate,
    getDefaultMinDate,
    IDatePickerBaseProps,
} from "./datePickerCore";
import { IDateRangeShortcut } from "./dateRangePicker";

export interface IDateRangeInputProps extends IDatePickerBaseProps, IProps {
    /**
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
     * @default false
     */
    allowSingleDayRange?: boolean;

    /**
     * Whether the calendar popover should close when a date range is selected.
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * Whether the component should be enabled or disabled.
     * @default false
     */
    disabled?: boolean;

    /**
     * Initial DateRange the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * The format of the date. See options
     * here: http://momentjs.com/docs/#/displaying/format/
     * @default "YYYY-MM-DD"
     */
    format?: string;

    /**
     * The error message to display when the selected date is invalid.
     * @default "Invalid date"
     */
    invalidDateMessage?: string;

    /**
     * The error message to display when the selected end date is invalid.
     * @default "Invalid date"
     */
    invalidEndDateMessage?: string;

    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedDates: DateRange) => void;

    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned. If the date is out of range,
     * the out of range date will be returned (`onChange` is not called in this case).
     */
    onError?: (errorDate: Date) => void;

    /**
     * If true, the Popover will open when the user clicks on the input. If false, the Popover will only
     * open when the calendar icon is clicked.
     * @default true
     */
    openOnFocus?: boolean;

    /**
     * The error message to display when the date selected is out of range.
     * @default "Out of range"
     */
    outOfRangeMessage?: string;

    /**
     * The position the date popover should appear in relative to the input box.
     * @default Position.BOTTOM
     */
    popoverPosition?: Position;

    /**
     * Whether all the text in each input should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;

    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array, the custom shortcuts provided will be displayed.
     * @default true
     */
    shortcuts?: boolean | IDateRangeShortcut[];

    /**
     * Whether to show the icon button.
     * @default true
     */
    showIcon?: boolean;

    /**
     * The currently selected DateRange.
     * If this prop is present, the component acts in a controlled manner.
     */
    value?: DateRange;
}

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, {}> {
    public static defaultProps: IDateRangeInputProps = {
        allowSingleDayRange: false,
        closeOnSelection: false,
        disabled: false,
        format: "YYYY-MM-DD",
        invalidDateMessage: "Invalid date",
        invalidEndDateMessage: "Invalid end date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        openOnFocus: true,
        outOfRangeMessage: "Out of range",
        popoverPosition: Position.BOTTOM_LEFT,
        selectAllOnFocus: true,
        shortcuts: true,
        showIcon: true,
    };

    public displayName = "Blueprint.DateRangeInput";

    private startDateInputRef: HTMLInputElement = null;
    private endDateInputRef: HTMLInputElement = null;

    public render() {
        return (
            <div className={Classes.CONTROL_GROUP}>
                <InputGroup
                    className={DateClasses.DATERANGEINPUT_FIELD}
                    inputRef={this.setStartDateInputRef}
                    placeholder="Start date"
                    type="text"
                />
                <InputGroup
                    className={DateClasses.DATERANGEINPUT_FIELD}
                    inputRef={this.setEndDateInputRef}
                    placeholder="End date"
                    type="text"
                />
                {this.maybeRenderIcon()}
            </div>
        );
    }

    private maybeRenderIcon() {
        // the icon element toggles the popover on click. it needs to be
        // visually inside of the input group but not contained within either
        // input field, so we have to get creative with our markup.
        return (
            <div className={classNames(DateClasses.DATERANGEINPUT_ICON_WRAPPER, Classes.INPUT_GROUP)}>
                <div className={Classes.INPUT}>
                    <Button
                        className={classNames(Classes.MINIMAL, "pt-icon-calendar")}
                        disabled={this.props.disabled}
                        intent={Intent.PRIMARY}
                    />
                </div>
            </div>
        );
    }

    private setStartDateInputRef = (el: HTMLInputElement) => {
        this.startDateInputRef = el;
    }

    private setEndDateInputRef = (el: HTMLInputElement) => {
        this.endDateInputRef = el;
    }
}
