/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as moment from "moment";
import * as React from "react";
import { DayPickerProps } from "react-day-picker/types/props";

import {
    AbstractPureComponent,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
    IProps,
    Keys,
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
    momentToString,
    stringToMoment,
} from "./common/dateUtils";
import { DATEINPUT_WARN_DEPRECATED_POPOVER_POSITION } from "./common/errors";
import { IDateFormatter } from "./dateFormatter";
import { DatePicker } from "./datePicker";
import { getDefaultMaxDate, getDefaultMinDate, IDatePickerBaseProps } from "./datePickerCore";
import { DateTimePicker } from "./dateTimePicker";
import { ITimePickerProps, TimePickerPrecision } from "./timePicker";

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
     * Props to pass to ReactDayPicker. See API documentation
     * [here](http://react-day-picker.js.org/docs/api-daypicker.html).
     *
     * The following props are managed by the component and cannot be configured:
     * `canChangeMonth`, `captionElement`, `fromMonth` (use `minDate`), `month` (use
     * `initialMonth`), `toMonth` (use `maxDate`).
     */
    dayPickerProps?: DayPickerProps;

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
     * Alternatively, pass an `IDateFormatter` for custom date rendering.
     * @default "YYYY-MM-DD"
     */
    format?: string | IDateFormatter;

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
     * Any props to be passed on to the `TimePicker`. `value`, `onChange`, and
     * `timePrecision` will be ignored in favor of the corresponding top-level
     * props on this component.
     */
    timePickerProps?: ITimePickerProps;

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

export class DateInput extends AbstractPureComponent<IDateInputProps, IDateInputState> {
    public static defaultProps: IDateInputProps = {
        closeOnSelection: true,
        dayPickerProps: {},
        disabled: false,
        format: "YYYY-MM-DD",
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        popoverPosition: Position.BOTTOM,
        reverseMonthAndYearMenus: false,
        timePickerProps: {},
    };

    public static displayName = "Blueprint2.DateInput";

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

        const popoverContent =
            this.props.timePrecision === undefined ? (
                <DatePicker {...this.props} onChange={this.handleDateChange} value={dateValue} />
            ) : (
                <DateTimePicker
                    canClearSelection={this.props.canClearSelection}
                    onChange={this.handleDateChange}
                    value={dateValue}
                    datePickerProps={this.props}
                    timePickerProps={{ ...this.props.timePickerProps, precision: this.props.timePrecision }}
                />
            );
        // assign default empty object here to prevent mutation
        const { inputProps = {}, popoverProps = {}, format } = this.props;

        const inputClasses = classNames(
            {
                "pt-intent-danger": !(this.isMomentValidAndInRange(date) || isMomentNull(date) || dateString === ""),
            },
            inputProps.className,
        );

        const placeholder = typeof format === "string" ? format : format.placeholder;

        return (
            <Popover
                inline={true}
                isOpen={this.state.isOpen && !this.props.disabled}
                position={this.props.popoverPosition}
                {...popoverProps}
                autoFocus={false}
                className={classNames(popoverProps.className, this.props.className)}
                content={popoverContent}
                enforceFocus={false}
                onClose={this.handleClosePopover}
                popoverClassName={classNames("pt-dateinput-popover", popoverProps.popoverClassName)}
            >
                <InputGroup
                    autoComplete="off"
                    placeholder={placeholder}
                    rightElement={this.props.rightElement}
                    {...inputProps}
                    className={inputClasses}
                    disabled={this.props.disabled}
                    type="text"
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClick}
                    onFocus={this.handleInputFocus}
                    onKeyDown={this.handleInputKeyDown}
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
    }

    private createMoment(valueString: string) {
        // Locale here used for parsing, does not set the locale on the moment itself
        return stringToMoment(valueString, this.props.format, this.props.locale);
    }

    private getDateString = (value: moment.Moment) => {
        if (isMomentNull(value)) {
            return "";
        }
        if (value.isValid()) {
            if (this.isMomentInRange(value)) {
                return momentToString(value, this.props.format, this.props.locale);
            } else {
                return this.props.outOfRangeMessage;
            }
        }
        return this.props.invalidDateMessage;
    };

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
    };

    private handleDateChange = (date: Date, hasUserManuallySelectedDate: boolean, didSubmitWithEnter = false) => {
        const prevMomentDate = this.state.value;
        const momentDate = fromDateToMoment(date);

        // this change handler was triggered by a change in month, day, or (if
        // enabled) time. for UX purposes, we want to close the popover only if
        // the user explicitly clicked a day within the current month.
        const isOpen =
            !hasUserManuallySelectedDate ||
            this.hasMonthChanged(prevMomentDate, momentDate) ||
            this.hasTimeChanged(prevMomentDate, momentDate) ||
            !this.props.closeOnSelection;

        // if selecting a date via click or Tab, the input will already be
        // blurred by now, so sync isInputFocused to false. if selecting via
        // Enter, setting isInputFocused to false won't do anything by itself,
        // plus we want the field to retain focus anyway.
        // (note: spelling out the ternary explicitly reads more clearly.)
        const isInputFocused = didSubmitWithEnter ? true : false;

        if (this.props.value === undefined) {
            this.setState({ isInputFocused, isOpen, value: momentDate, valueString: this.getDateString(momentDate) });
        } else {
            this.setState({ isInputFocused, isOpen });
        }
        Utils.safeInvoke(this.props.onChange, date === null ? null : fromMomentToDate(momentDate));
    };

    private shouldCheckForDateChanges(prevMomentDate: moment.Moment, nextMomentDate: moment.Moment) {
        return nextMomentDate != null && !isMomentNull(prevMomentDate) && prevMomentDate.isValid();
    }

    private hasMonthChanged(prevMomentDate: moment.Moment, nextMomentDate: moment.Moment) {
        return (
            this.shouldCheckForDateChanges(prevMomentDate, nextMomentDate) &&
            nextMomentDate.month() !== prevMomentDate.month()
        );
    }

    private hasTimeChanged(prevMomentDate: moment.Moment, nextMomentDate: moment.Moment) {
        return (
            this.shouldCheckForDateChanges(prevMomentDate, nextMomentDate) &&
            this.props.timePrecision != null &&
            (nextMomentDate.hours() !== prevMomentDate.hours() ||
                nextMomentDate.minutes() !== prevMomentDate.minutes() ||
                nextMomentDate.seconds() !== prevMomentDate.seconds() ||
                nextMomentDate.milliseconds() !== prevMomentDate.milliseconds())
        );
    }

    private handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        let valueString: string;
        if (isMomentNull(this.state.value)) {
            valueString = "";
        } else {
            valueString = momentToString(this.state.value, this.props.format, this.props.locale);
        }

        this.setState({ isInputFocused: true, isOpen: true, valueString });
        this.safeInvokeInputProp("onFocus", e);
    };

    private handleInputClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
        // stop propagation to the Popover's internal handleTargetClick handler;
        // otherwise, the popover will flicker closed as soon as it opens.
        e.stopPropagation();

        this.safeInvokeInputProp("onClick", e);
    };

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
    };

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { valueString } = this.state;
        const value = this.createMoment(valueString);
        if (
            valueString.length > 0 &&
            valueString !== this.getDateString(this.state.value) &&
            (!value.isValid() || !this.isMomentInRange(value))
        ) {
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
    };

    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.which === Keys.ENTER) {
            const nextValue = this.createMoment(this.state.valueString);
            const nextDate = fromMomentToDate(nextValue);
            this.handleDateChange(nextDate, true, true);
        } else if (e.which === Keys.TAB && e.shiftKey) {
            // close the popover if focus will move to the previous element on
            // the page. tabbing forward should *not* close the popover, because
            // focus will be moving into the popover itself.
            this.setState({ isOpen: false });
        }
        this.safeInvokeInputProp("onKeyDown", e);
    };

    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    private safeInvokeInputProp(name: keyof HTMLInputProps, e: React.SyntheticEvent<HTMLElement>) {
        const { inputProps = {} } = this.props;
        Utils.safeInvoke(inputProps[name], e);
    }
}
