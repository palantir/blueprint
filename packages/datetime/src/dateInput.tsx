/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to DateInput2 in the datetime2
 * package instead.
 */

/* eslint-disable deprecation/deprecation, @blueprintjs/no-deprecated-components */

import classNames from "classnames";
import * as React from "react";
import type { DayPickerProps } from "react-day-picker";

import {
    AbstractPureComponent2,
    DISPLAYNAME_PREFIX,
    InputGroup,
    InputGroupProps2,
    Intent,
    IPopoverProps,
    Keys,
    Popover,
    Props,
    refHandler,
    setRef,
} from "@blueprintjs/core";

import * as Classes from "./common/classes";
import { isDateValid, isDayInRange } from "./common/dateUtils";
import { DateFormatProps, getFormattedDateString } from "./dateFormat";
import { DatePicker } from "./datePicker";
import { DatePickerBaseProps, getDefaultMaxDate, getDefaultMinDate } from "./datePickerCore";
import { DatePickerShortcut } from "./shortcuts";

export type DateInputProps = IDateInputProps;
/** @deprecated use DateInputProps */
export interface IDateInputProps extends DatePickerBaseProps, DateFormatProps, Props {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * Passed to `DatePicker` component.
     *
     * @default true
     */
    canClearSelection?: boolean;

    /**
     * Text for the reset button in the date picker action bar.
     * Passed to `DatePicker` component.
     *
     * @default "Clear"
     */
    clearButtonText?: string;

    /**
     * Whether the calendar popover should close when a date is selected.
     *
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * Whether the date input is non-interactive.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * The default date to be used in the component when uncontrolled.
     */
    defaultValue?: Date;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Props to pass to the [input group](#core/components/text-inputs.input-group).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `type` is fixed to "text".
     */
    inputProps?: InputGroupProps2;

    /**
     * Called when the user selects a new valid date through the DatePicker or by typing
     * in the input.
     *
     * @param newDate Date or `null` (if the date is invalid or text input has been cleared)
     * @param isUserChange `true` if the user clicked on a date in the calendar, changed the input value,
     *     or cleared the selection; `false` if the date was changed by changing the month or year.
     */
    onChange?: (selectedDate: Date | null, isUserChange: boolean) => void;

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
    // eslint-disable-next-line @typescript-eslint/ban-types
    popoverProps?: Partial<IPopoverProps> & object;

    /**
     * Element to render on right side of input.
     */
    rightElement?: JSX.Element;

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown below the calendar.
     *
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * Whether shortcuts to quickly select a date are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     *
     * @default false
     */
    shortcuts?: boolean | DatePickerShortcut[];

    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     * To display no date in the input field, pass `null` to the value prop. To display an invalid date error
     * in the input field, pass `new Date(undefined)` to the value prop.
     */
    value?: Date | null;

    /**
     * Text for the today button in the date picker action bar.
     * Passed to `DatePicker` component.
     *
     * @default "Today"
     */
    todayButtonText?: string;
}

export interface IDateInputState {
    value: Date;
    valueString: string;
    isInputFocused: boolean;
    isOpen: boolean;
    selectedShortcutIndex?: number;
}

/**
 * Date input component.
 *
 * @see https://blueprintjs.com/docs/#datetime/dateinput
 * @deprecated use { DateInput2 } from "@blueprintjs/datetime2"
 */
export class DateInput extends AbstractPureComponent2<DateInputProps, IDateInputState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.DateInput`;

    public static defaultProps: Partial<DateInputProps> = {
        closeOnSelection: true,
        dayPickerProps: {},
        disabled: false,
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        reverseMonthAndYearMenus: false,
    };

    public state: IDateInputState = {
        isInputFocused: false,
        isOpen: false,
        value: this.props.value !== undefined ? this.props.value : this.props.defaultValue,
        valueString: null,
    };

    public inputElement: HTMLInputElement | null = null;

    public popoverContentElement: HTMLDivElement | null = null;

    private handleInputRef = refHandler<HTMLInputElement, "inputElement">(
        this,
        "inputElement",
        this.props.inputProps?.inputRef,
    );

    private handlePopoverContentRef: React.Ref<HTMLDivElement> = refHandler(this, "popoverContentElement");

    public render() {
        const { value, valueString } = this.state;
        const dateString = this.state.isInputFocused ? valueString : getFormattedDateString(value, this.props);
        const dateValue = isDateValid(value) ? value : null;
        const dayPickerProps: DayPickerProps = {
            ...this.props.dayPickerProps,
            onDayKeyDown: (day, modifiers, e) => {
                this.props.dayPickerProps.onDayKeyDown?.(day, modifiers, e);
            },
            onMonthChange: (month: Date) => {
                this.props.dayPickerProps.onMonthChange?.(month);
            },
        };

        // React's onFocus prop listens to the focusin browser event under the hood, so it's safe to
        // provide it the focusIn event handlers instead of using a ref and manually adding the
        // event listeners ourselves.
        const wrappedPopoverContent = (
            <div ref={this.handlePopoverContentRef}>
                <div onFocus={this.handleStartFocusBoundaryFocusIn} tabIndex={0} />
                <DatePicker
                    {...this.props}
                    dayPickerProps={dayPickerProps}
                    onChange={this.handleDateChange}
                    value={dateValue}
                    onShortcutChange={this.handleShortcutChange}
                    selectedShortcutIndex={this.state.selectedShortcutIndex}
                />
                <div onFocus={this.handleEndFocusBoundaryFocusIn} tabIndex={0} />
            </div>
        );

        // assign default empty object here to prevent mutation
        const { inputProps = {}, popoverProps = {} } = this.props;
        const isErrorState = value != null && (!isDateValid(value) || !this.isDateInRange(value));
        return (
            <Popover
                isOpen={this.state.isOpen && !this.props.disabled}
                fill={this.props.fill}
                {...popoverProps}
                autoFocus={false}
                className={classNames(popoverProps.className, this.props.className)}
                content={wrappedPopoverContent}
                enforceFocus={false}
                onClose={this.handleClosePopover}
                popoverClassName={classNames(Classes.DATEINPUT_POPOVER, popoverProps.popoverClassName)}
            >
                <InputGroup
                    autoComplete="off"
                    intent={isErrorState ? Intent.DANGER : Intent.NONE}
                    placeholder={this.props.placeholder}
                    rightElement={this.props.rightElement}
                    type="text"
                    {...inputProps}
                    disabled={this.props.disabled}
                    inputRef={this.handleInputRef}
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

    public componentDidUpdate(prevProps: DateInputProps, prevState: IDateInputState) {
        super.componentDidUpdate(prevProps, prevState);

        if (prevProps.inputProps?.inputRef !== this.props.inputProps?.inputRef) {
            setRef(prevProps.inputProps?.inputRef, null);
            this.handleInputRef = refHandler(this, "inputElement", this.props.inputProps?.inputRef);
            setRef(this.props.inputProps?.inputRef, this.inputElement);
        }

        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    private isDateInRange(value: Date) {
        return isDayInRange(value, [this.props.minDate, this.props.maxDate]);
    }

    private handleClosePopover = (e?: React.SyntheticEvent<HTMLElement>) => {
        const { popoverProps = {} } = this.props;
        popoverProps.onClose?.(e);
        this.setState({ isOpen: false });
    };

    private handleDateChange = (newDate: Date | null, isUserChange: boolean, didSubmitWithEnter = false) => {
        const prevDate = this.state.value;

        // this change handler was triggered by a change in month, day, or (if
        // enabled) time. for UX purposes, we want to close the popover only if
        // the user explicitly clicked a day within the current month.
        const isOpen =
            !isUserChange ||
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
        this.props.onChange?.(newDate, isUserChange);
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
            this.props.onChange?.(value, true);
        } else {
            if (valueString.length === 0) {
                this.props.onChange?.(null, true);
            }
            this.setState({ valueString });
        }
        this.safeInvokeInputProp("onChange", e);
    };

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { valueString } = this.state;
        const date: Date = this.parseDate(valueString);
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
                this.props.onError?.(new Date(undefined));
            } else if (!this.isDateInRange(date)) {
                this.props.onError?.(date);
            } else {
                this.props.onChange?.(date, true);
            }
        } else {
            if (valueString.length === 0) {
                this.setState({ isInputFocused: false, value: null, valueString: null });
            } else {
                this.setState({ isInputFocused: false });
            }
        }
        this.safeInvokeInputProp("onBlur", e);
    };

    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        if (e.which === Keys.ENTER) {
            const nextDate = this.parseDate(this.state.valueString);
            this.handleDateChange(nextDate, true, true);
        } else if (e.which === Keys.TAB && e.shiftKey) {
            // close popover on SHIFT+TAB key press
            this.handleClosePopover();
        } else if (e.which === Keys.TAB && this.state.isOpen) {
            this.getKeyboardFocusableElements().shift()?.focus();
            // necessary to prevent focusing the second focusable element
            e.preventDefault();
        } else if (e.which === Keys.ESCAPE) {
            this.setState({ isOpen: false });
            this.inputElement?.blur();
        }
        this.safeInvokeInputProp("onKeyDown", e);
    };

    private getKeyboardFocusableElements = (): HTMLElement[] => {
        const elements: HTMLElement[] = Array.from(
            this.popoverContentElement?.querySelectorAll(
                "button:not([disabled]),input,[tabindex]:not([tabindex='-1'])",
            ),
        );
        // Remove focus boundary div elements
        elements.pop();
        elements.shift();
        return elements;
    };

    private handleStartFocusBoundaryFocusIn = (e: React.FocusEvent<HTMLDivElement>) => {
        if (this.popoverContentElement.contains(this.getRelatedTarget(e))) {
            // Not closing Popover to allow user to freely switch between manually entering a date
            // string in the input and selecting one via the Popover
            this.inputElement?.focus();
        } else {
            this.getKeyboardFocusableElements().shift()?.focus();
        }
    };

    private handleEndFocusBoundaryFocusIn = (e: React.FocusEvent<HTMLDivElement>) => {
        if (this.popoverContentElement.contains(this.getRelatedTarget(e))) {
            this.inputElement?.focus();
            this.handleClosePopover();
        } else {
            this.getKeyboardFocusableElements().pop()?.focus();
        }
    };

    private getRelatedTarget(e: React.FocusEvent<HTMLDivElement>): HTMLElement {
        // Support IE11 (#2924)
        return (e.relatedTarget ?? document.activeElement) as HTMLElement;
    }

    private handleShortcutChange = (_: DatePickerShortcut, selectedShortcutIndex: number) => {
        this.setState({ selectedShortcutIndex });
    };

    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    private safeInvokeInputProp(name: keyof InputGroupProps2, e: React.SyntheticEvent<HTMLElement>) {
        const { inputProps = {} } = this.props;
        inputProps[name]?.(e);
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
