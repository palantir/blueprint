/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";
import { DayPickerProps } from "react-day-picker/types/props";

import {
    AbstractPureComponent,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    Intent,
    IPopoverProps,
    IProps,
    Keys,
    Popover,
    Utils,
} from "@blueprintjs/core";

import { isDateValid, isDayInRange } from "./common/dateUtils";
import { getFormattedDateString, IDateFormatProps } from "./dateFormat";
import { DatePicker } from "./datePicker";
import { getDefaultMaxDate, getDefaultMinDate, IDatePickerBaseProps } from "./datePickerCore";
import { DateTimePicker } from "./dateTimePicker";
import { ITimePickerProps, TimePickerPrecision } from "./timePicker";

export interface IDateInputProps extends IDatePickerBaseProps, IDateFormatProps, IProps {
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
     * Props to pass to the [input group](#core/components/forms/input-group.javascript-api).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `type` is fixed to "text" and `ref` is not supported; use `inputRef` instead.
     */
    inputProps?: HTMLInputProps & IInputGroupProps;

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
    value?: Date | null;

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
    value: Date;
    valueString: string;
    isInputFocused: boolean;
    isOpen: boolean;
}

export class DateInput extends AbstractPureComponent<IDateInputProps, IDateInputState> {
    public static displayName = "Blueprint2.DateInput";

    public static defaultProps: Partial<IDateInputProps> = {
        closeOnSelection: true,
        dayPickerProps: {},
        disabled: false,
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        reverseMonthAndYearMenus: false,
        timePickerProps: {},
    };

    public state: IDateInputState = {
        isInputFocused: false,
        isOpen: false,
        value: this.props.value !== undefined ? this.props.value : this.props.defaultValue,
        valueString: null,
    };

    private inputEl: HTMLInputElement = null;
    private popoverContentEl: HTMLElement = null;
    private lastElementInPopover: HTMLElement = null;
    private refHandlers = {
        input: (el: HTMLInputElement) => {
            this.inputEl = el;
        },
        popoverContent: (el: HTMLElement) => {
            this.popoverContentEl = el;
        },
    };

    public componentWillUnmount() {
        super.componentWillUnmount();
        this.unregisterPopoverBlurHandler();
    }

    public render() {
        const { value, valueString } = this.state;
        const dateString = this.state.isInputFocused ? valueString : getFormattedDateString(value, this.props);
        const dateValue = isDateValid(value) ? value : null;
        const dayPickerProps = {
            ...this.props.dayPickerProps,
            // dom elements for the updated month is not available when
            // onMonthChange is called. setTimeout is necessary to wait
            // for the updated month to be rendered
            onMonthChange: (month: Date) => {
                Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, month);
                this.setTimeout(this.registerPopoverBlurHandler);
            },
        };

        const popoverContent =
            this.props.timePrecision === undefined ? (
                <DatePicker
                    {...this.props}
                    dayPickerProps={dayPickerProps}
                    onChange={this.handleDateChange}
                    value={dateValue}
                />
            ) : (
                <DateTimePicker
                    canClearSelection={this.props.canClearSelection}
                    onChange={this.handleDateChange}
                    value={value}
                    datePickerProps={this.props}
                    timePickerProps={{ ...this.props.timePickerProps, precision: this.props.timePrecision }}
                />
            );
        const wrappedPopoverContent = <div ref={this.refHandlers.popoverContent}>{popoverContent}</div>;
        // assign default empty object here to prevent mutation
        const { popoverProps = {} } = this.props;
        const inputProps = this.getInputPropsWithDefaults();
        const isErrorState = value != null && (!isDateValid(value) || !this.isDateInRange(value));

        return (
            <Popover
                isOpen={this.state.isOpen && !this.props.disabled}
                usePortal={false}
                {...popoverProps}
                autoFocus={false}
                className={classNames(popoverProps.className, this.props.className)}
                content={wrappedPopoverContent}
                enforceFocus={false}
                onClose={this.handleClosePopover}
                popoverClassName={classNames("pt-dateinput-popover", popoverProps.popoverClassName)}
            >
                <InputGroup
                    autoComplete="off"
                    intent={isErrorState ? Intent.DANGER : Intent.NONE}
                    placeholder={this.props.placeholder}
                    rightElement={this.props.rightElement}
                    {...inputProps}
                    disabled={this.props.disabled}
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClick}
                    onFocus={this.handleInputFocus}
                    onKeyDown={this.handleInputKeyDown}
                    type="text"
                    value={dateString}
                />
            </Popover>
        );
    }

    public componentWillReceiveProps(nextProps: IDateInputProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    private getInputPropsWithDefaults() {
        const { inputProps = {} } = this.props;
        if (Utils.isFunction(inputProps.inputRef)) {
            return {
                ...inputProps,
                inputRef: (el: HTMLInputElement) => {
                    this.refHandlers.input(el);
                    inputProps.inputRef(el);
                },
            };
        } else {
            return {
                ...inputProps,
                inputRef: this.refHandlers.input,
            };
        }
    }

    private isDateInRange(value: Date) {
        return isDayInRange(value, [this.props.minDate, this.props.maxDate]);
    }

    private handleClosePopover = (e?: React.SyntheticEvent<HTMLElement>) => {
        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.onClose, e);
        this.setState({ isOpen: false });
    };

    private handleDateChange = (
        newDate: Date | null,
        hasUserManuallySelectedDate: boolean,
        didSubmitWithEnter = false,
    ) => {
        const prevDate = this.state.value;

        // this change handler was triggered by a change in month, day, or (if
        // enabled) time. for UX purposes, we want to close the popover only if
        // the user explicitly clicked a day within the current month.
        const isOpen =
            !hasUserManuallySelectedDate ||
            !this.props.closeOnSelection ||
            (prevDate != null && (this.hasMonthChanged(prevDate, newDate) || this.hasTimeChanged(prevDate, newDate)));

        // if selecting a date via click or Tab, the input will already be
        // blurred by now, so sync isInputFocused to false. if selecting via
        // Enter, setting isInputFocused to false won't do anything by itself,
        // plus we want the field to retain focus anyway.
        // (note: spelling out the ternary explicitly reads more clearly.)
        const isInputFocused = didSubmitWithEnter ? true : false;

        if (this.props.value === undefined) {
            const valueString = getFormattedDateString(newDate, this.props);
            this.setState({ isInputFocused, isOpen, value: newDate, valueString });
        } else {
            this.setState({ isInputFocused, isOpen });
        }
        Utils.safeInvoke(this.props.onChange, newDate);
    };

    private hasMonthChanged(prevDate: Date | null, nextDate: Date | null) {
        return (prevDate == null) !== (nextDate == null) || nextDate.getMonth() !== prevDate.getMonth();
    }

    private hasTimeChanged(prevDate: Date | null, nextDate: Date | null) {
        if (this.props.timePrecision == null) {
            return false;
        }
        return (
            (prevDate == null) !== (nextDate == null) ||
            nextDate.getHours() !== prevDate.getHours() ||
            nextDate.getMinutes() !== prevDate.getMinutes() ||
            nextDate.getSeconds() !== prevDate.getSeconds() ||
            nextDate.getMilliseconds() !== prevDate.getMilliseconds()
        );
    }

    private handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const valueString = this.state.value == null ? "" : this.formatDate(this.state.value);
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
        const value = this.parseDate(valueString);

        if (isDateValid(value) && this.isDateInRange(value)) {
            if (this.props.value === undefined) {
                this.setState({ value, valueString });
            } else {
                this.setState({ valueString });
            }
            Utils.safeInvoke(this.props.onChange, value);
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
        const date = this.parseDate(valueString);
        if (
            valueString.length > 0 &&
            valueString !== getFormattedDateString(this.state.value, this.props) &&
            (!isDateValid(date) || !this.isDateInRange(date))
        ) {
            if (this.props.value === undefined) {
                this.setState({ isInputFocused: false, value: date, valueString: null });
            } else {
                this.setState({ isInputFocused: false });
            }

            if (isNaN(date.valueOf())) {
                Utils.safeInvoke(this.props.onError, new Date(undefined));
            } else if (!this.isDateInRange(date)) {
                Utils.safeInvoke(this.props.onError, date);
            } else {
                Utils.safeInvoke(this.props.onChange, date);
            }
        } else {
            if (valueString.length === 0) {
                this.setState({ isInputFocused: false, value: null, valueString: null });
            } else {
                this.setState({ isInputFocused: false });
            }
        }
        this.registerPopoverBlurHandler();
        this.safeInvokeInputProp("onBlur", e);
    };

    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.which === Keys.ENTER) {
            const nextDate = this.parseDate(this.state.valueString);
            this.handleDateChange(nextDate, true, true);
        } else if (e.which === Keys.TAB && e.shiftKey) {
            // close the popover if focus will move to the previous element on
            // the page. tabbing forward should *not* close the popover, because
            // focus will be moving into the popover itself.
            this.setState({ isOpen: false });
        } else if (e.which === Keys.ESCAPE) {
            this.setState({ isOpen: false });
            this.inputEl.blur();
        }
        this.safeInvokeInputProp("onKeyDown", e);
    };

    // focus DOM event listener (not React event)
    private handlePopoverBlur = (e: FocusEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget == null || !this.popoverContentEl.contains(relatedTarget)) {
            this.handleClosePopover();
        }
    };

    private registerPopoverBlurHandler = () => {
        if (this.popoverContentEl != null) {
            // Popover contents are well structured, but the selector will need
            // to be updated if more focusable components are added in the future
            const tabbableElements = this.popoverContentEl.querySelectorAll("input, [tabindex]:not([tabindex='-1'])");
            const numOfElements = tabbableElements.length;
            if (numOfElements > 0) {
                // Keep track of the last focusable element in popover and add
                // a blur handler, so that when:
                // * user tabs to the next element, popover closes
                // * focus moves to element within popover, popover stays open
                const lastElement = tabbableElements[numOfElements - 1] as HTMLElement;
                if (this.lastElementInPopover !== lastElement) {
                    this.unregisterPopoverBlurHandler();
                    this.lastElementInPopover = lastElement;
                    this.lastElementInPopover.addEventListener("blur", this.handlePopoverBlur);
                }
            }
        }
    };

    private unregisterPopoverBlurHandler = () => {
        if (this.lastElementInPopover != null) {
            this.lastElementInPopover.removeEventListener("blur", this.handlePopoverBlur);
        }
    };

    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    private safeInvokeInputProp(name: keyof HTMLInputProps, e: React.SyntheticEvent<HTMLElement>) {
        const { inputProps = {} } = this.props;
        Utils.safeInvoke(inputProps[name], e);
    }

    private parseDate(dateString: string): Date | null {
        if (dateString === this.props.outOfRangeMessage || dateString === this.props.invalidDateMessage) {
            return null;
        }
        const { locale, parseDate } = this.props;
        const newDate = parseDate(dateString, locale);
        return newDate === false ? new Date(undefined) : newDate;
    }

    private formatDate(date: Date): string {
        if (!isDateValid(date) || !this.isDateInRange(date)) {
            return "";
        }
        const { locale, formatDate } = this.props;
        return formatDate(date, locale);
    }
}
