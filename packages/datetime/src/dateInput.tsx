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
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
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
import { DATEINPUT_WARN_DEPRECATED_OPEN_ON_FOCUS, DATEINPUT_WARN_DEPRECATED_POPOVER_POSITION } from "./common/errors";
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
     * Props to pass to the [input group](#core/components/forms/input-group.javascript-api).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `type` is fixed to "text" and `ref` is not supported; use `inputRef` instead.
     */
    inputProps?: HTMLInputProps & IInputGroupProps;

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
     * If `true`, the popover will open when the user clicks on the input.
     * @deprecated since 1.13.0.
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
     * @deprecated since v1.15.0, use `popoverProps.position`
     */
    popoverPosition?: Position;

    /**
     * Props to pass to the `Popover`.
     * Note that `content`, `autoFocus`, and `enforceFocus` cannot be changed.
     */
    popoverProps?: Partial<IPopoverProps> & object;

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

    public static displayName = "Blueprint.DateInput";

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
        const { value, valueString } = this.state;
        const dateString = this.state.isInputFocused ? valueString : this.getDateString(value);
        const date = this.state.isInputFocused ? this.createMoment(valueString) : value;
        const dateValue = this.isMomentValidAndInRange(value) ? fromMomentToDate(value) : null;

        const popoverContent = this.props.timePrecision === undefined
            ? <DatePicker {...this.props} onChange={this.handleDateChange} value={dateValue} />
            : <DateTimePicker
                onChange={this.handleDateChange}
                value={dateValue}
                datePickerProps={this.props}
                timePickerProps={{ precision: this.props.timePrecision }}
            />;
        // assign default empty object here to prevent mutation
        const { inputProps = {}, popoverProps = {} } = this.props;
        // exclude ref (comes from HTMLInputProps typings, not InputGroup)
        const { ref, ...htmlInputProps } = inputProps;

        const inputClasses = classNames({
            "pt-intent-danger": !(this.isMomentValidAndInRange(date) || isMomentNull(date) || dateString === ""),
        }, inputProps.className);

        return (
            <Popover
                inline={true}
                isOpen={this.state.isOpen && !this.props.disabled}
                position={this.props.popoverPosition}
                {...popoverProps}
                autoFocus={false}
                enforceFocus={false}
                content={popoverContent}
                onClose={this.handleClosePopover}
                popoverClassName={classNames("pt-dateinput-popover", popoverProps.popoverClassName)}
            >
                <InputGroup
                    autoComplete="off"
                    placeholder={this.props.format}
                    rightElement={this.props.rightElement}
                    {...htmlInputProps}
                    className={inputClasses}
                    disabled={this.props.disabled}
                    inputRef={this.setInputRef}
                    type="text"
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClick}
                    onFocus={this.handleInputFocus}
                    value={dateString}
                />
            </Popover>
        );
    }

    public componentWillReceiveProps(nextProps: IDateInputProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.value !== this.props.value) {
            this.setState({ value: fromDateToMoment(nextProps.value) });
        }
    }

    public validateProps(props: IDateInputProps) {
        if (props.popoverPosition !== DateInput.defaultProps.popoverPosition) {
            console.warn(DATEINPUT_WARN_DEPRECATED_POPOVER_POSITION);
        }
        if (props.openOnFocus !== DateInput.defaultProps.openOnFocus) {
            console.warn(DATEINPUT_WARN_DEPRECATED_OPEN_ON_FOCUS);
        }
    }

    private createMoment(valueString: string) {
        // Locale here used for parsing, does not set the locale on the moment itself
        return moment(valueString, this.props.format, this.props.locale);
    }

    private localizedFormat(value: moment.Moment) {
        if (this.props.locale) {
            return value.locale(this.props.locale).format(this.props.format);
        } else {
            return value.format(this.props.format);
        }
    }

    private getDateString = (value: moment.Moment) => {
        if (isMomentNull(value)) {
            return "";
        }
        if (value.isValid()) {
            if (this.isMomentInRange(value)) {
                return this.localizedFormat(value);
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

    private handleClosePopover = (e: React.SyntheticEvent<HTMLElement>) => {
        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.onClose, e);
        this.setState({ isOpen: false });
    }

    private handleDateChange = (date: Date, hasUserManuallySelectedDate: boolean) => {
        const prevMomentDate = this.state.value;
        const momentDate = fromDateToMoment(date);

        // this change handler was triggered by a change in month, day, or (if enabled) time. for UX
        // purposes, we want to close the popover only if the user explicitly clicked a day within
        // the current month.
        const isOpen = (!hasUserManuallySelectedDate
            || this.hasMonthChanged(prevMomentDate, momentDate)
            || this.hasTimeChanged(prevMomentDate, momentDate)
            || !this.props.closeOnSelection);

        if (this.props.value === undefined) {
            this.setState({ isInputFocused: false, isOpen, value: momentDate });
        } else {
            this.setState({ isInputFocused: false, isOpen });
        }
        Utils.safeInvoke(this.props.onChange, date === null ? null : fromMomentToDate(momentDate));
    }

    private shouldCheckForDateChanges(prevMomentDate: moment.Moment, nextMomentDate: moment.Moment) {
        return nextMomentDate != null && !isMomentNull(prevMomentDate) && prevMomentDate.isValid();
    }

    private hasMonthChanged(prevMomentDate: moment.Moment, nextMomentDate: moment.Moment) {
        return this.shouldCheckForDateChanges(prevMomentDate, nextMomentDate)
            && nextMomentDate.month() !== prevMomentDate.month();
    }

    private hasTimeChanged(prevMomentDate: moment.Moment, nextMomentDate: moment.Moment) {
        return this.shouldCheckForDateChanges(prevMomentDate, nextMomentDate)
            && this.props.timePrecision != null
            && (
                nextMomentDate.hours() !== prevMomentDate.hours()
                || nextMomentDate.minutes() !== prevMomentDate.minutes()
                || nextMomentDate.seconds() !== prevMomentDate.seconds()
                || nextMomentDate.milliseconds() !== prevMomentDate.milliseconds()
            );
    }

    private handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        let valueString: string;
        if (isMomentNull(this.state.value)) {
            valueString = "";
        } else {
            valueString = this.localizedFormat(this.state.value);
        }

        if (this.props.openOnFocus) {
            this.setState({ isInputFocused: true, isOpen: true, valueString });
        } else {
            this.setState({ isInputFocused: true, valueString });
        }
        this.safeInvokeInputProp("onFocus", e);
    }

    private handleInputClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
        if (this.props.openOnFocus) {
            e.stopPropagation();
        }
        this.safeInvokeInputProp("onClick", e);
    }

    private handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const valueString = (e.target as HTMLInputElement).value;
        const value = this.createMoment(valueString);

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
        this.safeInvokeInputProp("onChange", e);
    }

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const valueString = this.state.valueString;
        const value = this.createMoment(valueString);
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
        this.safeInvokeInputProp("onBlur", e);
    }

    private setInputRef = (el: HTMLElement) => {
        this.inputRef = el;
        const { inputProps = {} } = this.props;
        Utils.safeInvoke(inputProps.inputRef, el);
    }

    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    private safeInvokeInputProp(name: keyof HTMLInputProps, e: React.SyntheticEvent<HTMLElement>) {
        const { inputProps = {} } = this.props;
        Utils.safeInvoke(inputProps[name], e);
    }
}
