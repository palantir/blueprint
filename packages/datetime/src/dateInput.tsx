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
    InputGroup,
    IProps,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";

import {
    fromDateToMoment,
    fromMomentToDate,
    isMomentInRange,
    isMomentNull,
    isMomentValidAndInRange,
} from "./common/dateUtils";
import { DatePicker } from "./datePicker";
import {
    getDefaultMaxDate,
    getDefaultMinDate,
    IDatePickerBaseProps,
} from "./datePickerCore";
import { DateTimePicker } from "./dateTimePicker";
import { TimePickerPrecision } from "./timePicker";

export interface IDateInputProps extends IDatePickerBaseProps, IProps {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * Passed to `DatePicker` component.
     * @default true
     */
    canClearSelection?: boolean;

    /**
     * Whether the calendar popover should close when a date is selected.
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * Whether the date input is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /**
     * The default date to be used in the component when uncontrolled.
     */
    defaultValue?: Date;

    /**
     * The format of the date. See http://momentjs.com/docs/#/displaying/format/.
     * @default "YYYY-MM-DD"
     */
    format?: string;

    /**
     * The error message to display when the date selected is invalid.
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
     * If `true`, the popover will open when the user clicks on the input. If `false`, the popover will only
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
     * Element to render on right side of input.
     */
    rightElement?: JSX.Element;

    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     * To display no date in the input field, pass `null` to the value prop. To display an invalid date error
     * in the input field, pass `new Date(undefined)` to the value prop.
     */
    value?: Date;

    /**
     * Adds a time chooser to the bottom of the popover.
     * Passed to the `DateTimePicker` component.
     */
    timePrecision?: TimePickerPrecision;
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

        const defaultValue = this.props.defaultValue ? fromDateToMoment(this.props.defaultValue) : moment(null);

        this.state = {
            isInputFocused: false,
            isOpen: false,
            value: this.props.value !== undefined ? fromDateToMoment(this.props.value) : defaultValue,
            valueString: null,
        };
    }

    public render() {
        const dateString = this.state.isInputFocused ? this.state.valueString : this.getDateString(this.state.value);
        const date = this.state.isInputFocused ? moment(this.state.valueString, this.props.format) : this.state.value;

        const sharedProps: IDatePickerBaseProps = {
            ...this.props,
            onChange: this.handleDateChange,
            value: this.isMomentValidAndInRange(this.state.value) ? fromMomentToDate(this.state.value) : null,
        };
        const popoverContent = this.props.timePrecision === undefined
            ? <DatePicker {...sharedProps} />
            : <DateTimePicker
                {...sharedProps}
                timePickerProps={{ precision: this.props.timePrecision }}
            />;

        const inputClasses = classNames({
            "pt-intent-danger": !(this.isMomentValidAndInRange(date) || isMomentNull(date) || dateString === ""),
        });

        return (
            <Popover
                autoFocus={false}
                content={popoverContent}
                enforceFocus={false}
                inline={true}
                isOpen={this.state.isOpen && !this.props.disabled}
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
                    rightElement={this.props.rightElement}
                    value={dateString}
                />
            </Popover>
        );
    }

    public componentWillReceiveProps(nextProps: IDateInputProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: fromDateToMoment(nextProps.value) });
        }

        super.componentWillReceiveProps(nextProps);
    }

    private getDateString = (value: moment.Moment) => {
        if (isMomentNull(value)) {
            return "";
        }
        if (value.isValid()) {
            if (this.isMomentInRange(value)) {
                return value.format(this.props.format);
            } else {
                return this.props.outOfRangeMessage;
            }
        }
        return this.props.invalidDateMessage;
    }

    private isMomentValidAndInRange(value: moment.Moment) {
        return isMomentValidAndInRange(value, this.props.minDate, this.props.maxDate);
    }

    private isMomentInRange(value: moment.Moment) {
        return isMomentInRange(value, this.props.minDate, this.props.maxDate);
    }

    private handleClosePopover = () => {
        this.setState({ isOpen: false });
    }

    private handleDateChange = (date: Date, hasUserManuallySelectedDate: boolean) => {
        const momentDate = fromDateToMoment(date);
        const hasMonthChanged = date !== null && !isMomentNull(this.state.value) && this.state.value.isValid() &&
            momentDate.month() !== this.state.value.month();
        const isOpen = !(this.props.closeOnSelection && hasUserManuallySelectedDate && !hasMonthChanged);
        if (this.props.value === undefined) {
            this.setState({ isInputFocused: false, isOpen, value: momentDate });
        } else {
            this.setState({ isInputFocused: false, isOpen });
        }
        Utils.safeInvoke(this.props.onChange, date === null ? null : fromMomentToDate(momentDate));
    }

    private handleInputFocus = () => {
        const valueString = isMomentNull(this.state.value) ? "" : this.state.value.format(this.props.format);

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

        if (value.isValid() && this.isMomentInRange(value)) {
            if (this.props.value === undefined) {
                this.setState({ value, valueString });
            } else {
                this.setState({ valueString });
            }
            Utils.safeInvoke(this.props.onChange, fromMomentToDate(value));
        } else {
            if (valueString.length === 0) {
                Utils.safeInvoke(this.props.onChange, null);
            }
            this.setState({ valueString });
        }
    }

    private handleInputBlur = () => {
        const valueString = this.state.valueString;
        const value = moment(valueString, this.props.format);
        if (valueString.length > 0
            && valueString !== this.getDateString(this.state.value)
            && (!value.isValid() || !this.isMomentInRange(value))) {

            if (this.props.value === undefined) {
                this.setState({ isInputFocused: false, value, valueString: null });
            } else {
                this.setState({ isInputFocused: false });
            }

            if (!value.isValid()) {
                Utils.safeInvoke(this.props.onError, new Date(undefined));
            } else if (!this.isMomentInRange(value)) {
                Utils.safeInvoke(this.props.onError, fromMomentToDate(value));
            } else {
                Utils.safeInvoke(this.props.onChange, fromMomentToDate(value));
            }
        } else {
            if (valueString.length === 0) {
                this.setState({ isInputFocused: false, value: moment(null), valueString: null });
            } else {
                this.setState({ isInputFocused: false });
            }
        }
    }

    private setInputRef = (el: HTMLElement) => {
        this.inputRef = el;
    }
}
