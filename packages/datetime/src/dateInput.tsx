/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
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
    Utils,
} from "@blueprintjs/core";

import { DatePicker } from "./datePicker";
import {
    getDefaultMaxDate,
    getDefaultMinDate,
    IDatePickerBaseProps,
} from "./datePickerCore";

export interface IDateInputProps extends IDatePickerBaseProps, IProps {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * Passed to `DatePicker` component
     */
    canClearSelection?: boolean;

    /**
     * Whether the calendar popover should close when a date is selected.
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * Whether the component should be enabled or disabled.
     * @default false
     */
    disabled?: boolean;

    /**
     * The default date to be used in the component when uncontrolled.
     */
    defaultValue?: Date;

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
    invalidDateMessage?: string;

    /**
     * Called when the user selects a new valid date through the `DatePicker` or by typing
     * in the input.
     */
    onChange?: (selectedDate: Date) => void;

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
     * The currently selected day. If this prop is present, the component acts in a controlled manner.
     * To display no date in the input field, pass `null` to the value prop. To display an invalid date error
     * in the input field, pass `new Date(undefined)` to the value prop.
     */
    value?: Date;
}

export interface IDateInputState {
    value?: moment.Moment;
    valueString?: string;
    isInputFocused?: boolean;
    isOpen?: boolean;
}

export class DateInput extends AbstractComponent<IDateInputProps, IDateInputState> {
    public static defaultProps: IDateInputProps = {
        closeOnSelection: true,
        disabled: false,
        format: "YYYY-MM-DD",
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        openOnFocus: true,
        outOfRangeMessage: "Out of range",
        popoverPosition: Position.BOTTOM,
    };

    public displayName = "Blueprint.DateInput";

    private inputRef: HTMLElement = null;

    public constructor(props?: IDateInputProps, context?: any) {
        super(props, context);

        const defaultValue = this.props.defaultValue ? this.fromDateToMoment(this.props.defaultValue) : moment(null);

        this.state = {
            isInputFocused: false,
            isOpen: false,
            value: this.props.value !== undefined ? this.fromDateToMoment(this.props.value) : defaultValue,
            valueString: null,
        };
    }

    public render() {
        const dateString = this.state.isInputFocused ? this.state.valueString : this.getDateString(this.state.value);
        const date = this.state.isInputFocused ? moment(this.state.valueString, this.props.format) : this.state.value;

        const popoverContent = (
            <DatePicker
                {...this.props}
                canClearSelection={this.props.canClearSelection}
                defaultValue={null}
                onChange={this.handleDateChange}
                value={this.validAndInRange(this.state.value) ? this.fromMomentToDate(this.state.value) : null}
            />
        );

        const inputClasses = classNames({
            "pt-intent-danger": !(this.validAndInRange(date) || this.isNull(date) || dateString === ""),
        });

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
                popoverClassName="pt-dateinput-popover"
                position={this.props.popoverPosition}
            >
                <InputGroup
                    className={inputClasses}
                    disabled={this.props.disabled}
                    inputRef={this.setInputRef}
                    type="text"
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClick}
                    onFocus={this.handleInputFocus}
                    placeholder={this.props.format}
                    rightElement={calendarIcon}
                    value={dateString}
                />
            </Popover>
        );
    }

    public componentWillReceiveProps(nextProps: IDateInputProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: this.fromDateToMoment(nextProps.value) });
        }

        super.componentWillReceiveProps(nextProps);
    }

    private getDateString = (value: moment.Moment) => {
        if (this.isNull(value)) {
            return "";
        }
        if (value.isValid()) {
            if (this.dateIsInRange(value)) {
                return value.format(this.props.format);
            } else {
                return this.props.outOfRangeMessage;
            }
        }
        return this.props.invalidDateMessage;
    }

    private validAndInRange(value: moment.Moment) {
        return value.isValid() && this.dateIsInRange(value);
    }

    private isNull(value: moment.Moment) {
        return value.parsingFlags().nullInput;
    }

    private dateIsInRange(value: moment.Moment) {
        return value.isBetween(this.props.minDate, this.props.maxDate, "day", "[]");
    }

    private handleClosePopover = () => {
        this.setState({ isOpen: false });
    }

    private handleDateChange = (date: Date, hasUserManuallySelectedDate: boolean) => {
        const momentDate = this.fromDateToMoment(date);
        const hasMonthChanged = date !== null && !this.isNull(this.state.value) && this.state.value.isValid() &&
            momentDate.month() !== this.state.value.month();
        const isOpen = !(this.props.closeOnSelection && hasUserManuallySelectedDate && !hasMonthChanged);
        if (this.props.value === undefined) {
            this.setState({ isInputFocused: false, isOpen, value: momentDate });
        } else {
            this.setState({ isInputFocused: false, isOpen });
        }
        Utils.safeInvoke(this.props.onChange, this.fromMomentToDate(momentDate));
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

    private handleInputFocus = () => {
        const valueString = this.isNull(this.state.value) ? "" : this.state.value.format(this.props.format);

        if (this.props.openOnFocus) {
            this.setState({ isInputFocused: true, isOpen: true, valueString });
        } else {
            this.setState({ isInputFocused: true, valueString });
        }
    }

    private handleInputClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
        if (this.props.openOnFocus) {
            e.stopPropagation();
        }
    }

    private handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const valueString = (e.target as HTMLInputElement).value;
        const value = moment(valueString, this.props.format);

        if (value.isValid() && this.dateIsInRange(value)) {
            if (this.props.value === undefined) {
                this.setState({ value, valueString });
            } else {
                this.setState({ valueString });
            }
            Utils.safeInvoke(this.props.onChange, this.fromMomentToDate(value));
        } else {
            this.setState({ valueString });
        }
    }

    private handleInputBlur = () => {
        const valueString = this.state.valueString;
        let value = moment(valueString, this.props.format);
        if (valueString !== this.getDateString(this.state.value) && (!value.isValid() || !this.dateIsInRange(value))) {

            if (this.props.value === undefined) {
                this.setState({ isInputFocused: false, value, valueString: null });
            } else {
                this.setState({ isInputFocused: false });
            }

            if (!value.isValid()) {
                Utils.safeInvoke(this.props.onError, new Date(undefined));
            } else if (!this.dateIsInRange(value)) {
                Utils.safeInvoke(this.props.onError, this.fromMomentToDate(value));
            } else {
                Utils.safeInvoke(this.props.onChange, this.fromMomentToDate(value));
            }
        } else {
            this.setState({ isInputFocused: false });
        }
    }

    private setInputRef = (el: HTMLElement) => {
        this.inputRef = el;
    }

    /**
     * Translate a moment into a Date object, adjusting the moment timezone into the local one.
     * This is a no-op unless moment-timezone's setDefault has been called.
     */
    private fromMomentToDate = (momentDate: moment.Moment) => {
        if (momentDate == null) {
            return null;
        }

        return new Date(
            momentDate.year(),
            momentDate.month(),
            momentDate.date(),
            momentDate.hours(),
            momentDate.minutes(),
            momentDate.seconds(),
            momentDate.milliseconds(),
        );
    }

    /**
     * Translate a Date object into a moment, adjusting the local timezone into the moment one.
     * This is a no-op unless moment-timezone's setDefault has been called.
     */
    private fromDateToMoment = (date: Date) => {
        if (date == null) {
            return moment(null);
        }

        return moment([
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        ]);
    }
}
