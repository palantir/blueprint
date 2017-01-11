/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as moment from "moment";
import * as React from "react";

import {
    AbstractComponent,
    Button,
    Classes,
    InputGroup,
    Intent,
    IProps,
    Popover,
    Position,
} from "@blueprintjs/core";

import { DateRange } from "./common/dateUtils";
import {
    getDefaultMaxDate,
    getDefaultMinDate,
    IDatePickerBaseProps,
} from "./datePickerCore";
import { DateRangePicker } from "./dateRangePicker";

export interface IDateRangeInputProps extends IDatePickerBaseProps, IProps {
    /**
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
     * @default false
     */
    allowSingleDayRange?: boolean;

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
     * The error message to display when the date selected invalid.
     * @default "Invalid date"
     */
    invalidDateRangeMessage?: string;

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
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array, the custom shortcuts provided will be displayed.
     * @default true
     */
    // shortcuts?: boolean | IDateRangeShortcut[];

    /**
     * The currently selected DateRange.
     * If this prop is present, the component acts in a controlled manner.
     */
    value?: DateRange;
}

export interface IDateRangeInputState {
    isInputFocused?: boolean;
    isOpen?: boolean;
    value?: DateRange;
    valueString?: string;
}

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, IDateRangeInputState> {
    public static defaultProps: IDateRangeInputProps = {
        allowSingleDayRange: false,
        disabled: false,
        format: "YYYY-MM-DD",
        invalidDateRangeMessage: "Invalid date range",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        openOnFocus: true,
        outOfRangeMessage: "Out of range",
        popoverPosition: Position.BOTTOM_LEFT,
    };

    public displayName = "Blueprint.DateRangeInput";

    private inputRef: HTMLElement = null;

    public constructor(props: IDateRangeInputProps, context?: any) {
        super(props, context);

        this.state = {
            isInputFocused: false,
            isOpen: false,
            value: null,
            valueString: null,
        };
    }

    public render() {
        const { format } = this.props;
        const dateRangeString = this.getDateRangeString(this.state.value);

        const popoverContent = (
            <DateRangePicker
                onChange={this.handleDateRangeChange}
            />
        );

        const calendarIcon = (
            <Button
                className={Classes.MINIMAL}
                disabled={this.props.disabled}
                iconName="calendar"
                intent={Intent.PRIMARY}
                onClick={this.handleIconClick}
            />
        );

        return (
            <Popover
                autoFocus={false}
                content={popoverContent}
                enforceFocus={false}
                inline={true}
                isOpen={this.state.isOpen}
                onClose={this.handleClosePopover}
                popoverClassName="pt-daterangeinput-popover"
                position={this.props.popoverPosition}
            >
                <InputGroup
                    className={"pt-daterangeinput"}
                    disabled={this.props.disabled}
                    inputRef={this.setInputRef}
                    type="text"
                    onBlur={this.handleInputBlur}
                    onChange={this.onChange}
                    onClick={this.handleInputClick}
                    onFocus={this.handleInputFocus}
                    placeholder={`${format} - ${format}`}
                    rightElement={calendarIcon}
                    value={dateRangeString}
                />
            </Popover>
        );
    }

    private setInputRef = (el: HTMLElement) => {
        this.inputRef = el;
    }

    private getDateRangeString = (value: DateRange) => {
        if (value == null) {
            return "";
        }

        const startDate = value[0];
        const endDate = value[1];

        const startDateFormatted = this.formatDate(startDate);
        const endDateFormatted = this.formatDate(endDate);

        let dateRangeString: string;

        if (startDate != null && endDate != null) {
            dateRangeString = `${startDateFormatted} - ${endDateFormatted}`;
        } else if (startDate != null) {
            dateRangeString = `${startDateFormatted} - `;
        } else if (endDate != null) {
            dateRangeString = ` - ${endDateFormatted}`;
        } else {
            dateRangeString = "";
        }

        return dateRangeString;
    }

    private formatDate = (date: Date) => {
        if (date == null) {
            return "";
        }
        return moment(date).format(this.props.format);
    }

    private handleDateRangeChange = (dateRange: DateRange) => {
        this.setState({ value: dateRange });
    }

    private handleClosePopover = () => {
        this.setState({ isOpen: false });
    }

    private handleIconClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (this.state.isOpen) {
            if (this.inputRef != null) {
                this.inputRef.blur();
            }
        } else {
            this.setState({ isOpen: true });
            e.stopPropagation();
            if (this.inputRef != null) {
                this.inputRef.focus();
            }
        }
    }

    private handleInputBlur = () => {
        this.setState({ isInputFocused: false });
    }

    private handleInputClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
        if (this.props.openOnFocus) {
            e.stopPropagation();
        }
    }

    private handleInputFocus = () => {
        if (this.props.openOnFocus) {
            this.setState({ isInputFocused: true, isOpen: true });
        } else {
            this.setState({ isInputFocused: true });
        }
    }

    private onChange = () => {
        return;
    }
}
