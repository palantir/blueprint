/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import {
    type ButtonProps,
    DISPLAYNAME_PREFIX,
    InputGroup,
    mergeRefs,
    Popover,
    type PopoverClickTargetHandlers,
    type PopoverTargetProps,
    Tag,
    Utils,
} from "@blueprintjs/core";
import {
    type DatePickerShortcut,
    DatePickerUtils,
    DateUtils,
    Errors,
    TimezoneNameUtils,
    TimezoneSelect,
    TimezoneUtils,
} from "@blueprintjs/datetime";

import { Classes } from "../../classes";
import { getDefaultDateFnsFormat } from "../../common/dateFnsFormatUtils";
import { useDateFnsLocale } from "../../common/dateFnsLocaleUtils";
import type { ReactDayPickerSingleProps } from "../../common/reactDayPickerProps";
import { DatePicker3 } from "../date-picker3/datePicker3";
import type { DateInput3DefaultProps, DateInput3Props, DateInput3PropsWithDefaults } from "./dateInput3Props";
import { useDateFormatter } from "./useDateFormatter";
import { useDateParser } from "./useDateParser";

export type { DateInput3Props };

const timezoneSelectButtonProps: Partial<ButtonProps> = {
    fill: false,
    minimal: true,
    outlined: true,
};

const defaultProps: DateInput3DefaultProps = {
    closeOnSelection: true,
    disabled: false,
    invalidDateMessage: "Invalid date",
    locale: "en-US",
    maxDate: DatePickerUtils.getDefaultMaxDate(),
    minDate: DatePickerUtils.getDefaultMinDate(),
    outOfRangeMessage: "Out of range",
    reverseMonthAndYearMenus: false,
};

/**
 * Date input (v3) component.
 *
 * @see https://blueprintjs.com/docs/#datetime2/date-input3
 */
export const DateInput3: React.FC<DateInput3Props> = React.memo(function _DateInput(props) {
    const {
        closeOnSelection,
        dateFnsFormat,
        dateFnsLocaleLoader,
        defaultTimezone,
        defaultValue,
        disabled,
        disableTimezoneSelect,
        fill,
        inputProps = {},
        invalidDateMessage,
        locale: localeOrCode,
        maxDate,
        minDate,
        onChange,
        onError,
        onTimezoneChange,
        outOfRangeMessage,
        popoverProps = {},
        popoverRef,
        rightElement,
        showTimezoneSelect,
        timePrecision,
        timezone: controlledTimezone,
        value,
        ...datePickerProps
    } = props as DateInput3PropsWithDefaults;

    const locale = useDateFnsLocale(localeOrCode, dateFnsLocaleLoader);
    const placeholder = getPlaceholder(props);
    const formatDateString = useDateFormatter(props, locale);
    const parseDateString = useDateParser(props, locale);

    // Refs
    // ------------------------------------------------------------------------

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const popoverContentRef = React.useRef<HTMLDivElement | null>(null);
    const popoverId = Utils.uniqueId("date-picker");

    // State
    // ------------------------------------------------------------------------

    const [isOpen, setIsOpen] = React.useState(false);
    const [timezoneValue, setTimezoneValue] = React.useState(getInitialTimezoneValue(props));
    const valueFromProps = React.useMemo(
        () => TimezoneUtils.getDateObjectFromIsoString(value, timezoneValue),
        [timezoneValue, value],
    );
    const isControlled = valueFromProps !== undefined;
    const defaultValueFromProps = React.useMemo(
        () => TimezoneUtils.getDateObjectFromIsoString(defaultValue, timezoneValue),
        [defaultValue, timezoneValue],
    );
    const [valueAsDate, setValue] = React.useState<Date | null | undefined>(
        isControlled ? valueFromProps : defaultValueFromProps,
    );

    const [selectedShortcutIndex, setSelectedShortcutIndex] = React.useState<number | undefined>(undefined);
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    // rendered as the text input's value
    const formattedDateString = React.useMemo(
        () => (valueAsDate === null ? undefined : formatDateString(valueAsDate)),
        [valueAsDate, formatDateString],
    );
    const [inputValue, setInputValue] = React.useState(formattedDateString ?? undefined);

    const isErrorState =
        valueAsDate != null &&
        (!DateUtils.isDateValid(valueAsDate) || !DateUtils.isDayInRange(valueAsDate, [minDate, maxDate]));

    // Effects
    // ------------------------------------------------------------------------

    React.useEffect(() => {
        if (isControlled) {
            setValue(valueFromProps);
        }
    }, [isControlled, valueFromProps]);

    React.useEffect(() => {
        // uncontrolled mode, updating initial timezone value
        if (defaultTimezone !== undefined && TimezoneNameUtils.isValidTimezone(defaultTimezone)) {
            setTimezoneValue(defaultTimezone);
        }
    }, [defaultTimezone]);

    React.useEffect(() => {
        // controlled mode, updating timezone value
        if (controlledTimezone !== undefined && TimezoneNameUtils.isValidTimezone(controlledTimezone)) {
            setTimezoneValue(controlledTimezone);
        }
    }, [controlledTimezone]);

    React.useEffect(() => {
        if (isControlled && !isInputFocused) {
            setInputValue(formattedDateString);
        }
    }, [isControlled, isInputFocused, formattedDateString]);

    // Popover contents (date picker)
    // ------------------------------------------------------------------------

    const handlePopoverClose = React.useCallback(
        (e: React.SyntheticEvent<HTMLElement>) => {
            popoverProps.onClose?.(e);
            setIsOpen(false);
        },
        [popoverProps],
    );

    const handleDateChange = React.useCallback(
        (newDate: Date | null, isUserChange: boolean, didSubmitWithEnter = false) => {
            const prevDate = valueAsDate;

            if (newDate === null) {
                if (!isControlled && !didSubmitWithEnter) {
                    // user clicked on current day in the calendar, so we should clear the input when uncontrolled
                    setInputValue("");
                }
                onChange?.(null, isUserChange);
                return;
            }

            // this change handler was triggered by a change in month, day, or (if
            // enabled) time. for UX purposes, we want to close the popover only if
            // the user explicitly clicked a day within the current month.
            const newIsOpen =
                !isUserChange ||
                !closeOnSelection ||
                (prevDate != null &&
                    (DateUtils.hasMonthChanged(prevDate, newDate) ||
                        (timePrecision !== undefined && DateUtils.hasTimeChanged(prevDate, newDate))));

            // if selecting a date via click or Tab, the input will already be
            // blurred by now, so sync isInputFocused to false. if selecting via
            // Enter, setting isInputFocused to false won't do anything by itself,
            // plus we want the field to retain focus anyway.
            // (note: spelling out the ternary explicitly reads more clearly.)
            const newIsInputFocused = didSubmitWithEnter ? true : false;

            if (isControlled) {
                setIsInputFocused(newIsInputFocused);
                setIsOpen(newIsOpen);
            } else {
                const newFormattedDateString = formatDateString(newDate);
                setIsInputFocused(newIsInputFocused);
                setIsOpen(newIsOpen);
                setValue(newDate);
                setInputValue(newFormattedDateString);
            }

            const newIsoDateString = TimezoneUtils.getIsoEquivalentWithUpdatedTimezone(
                newDate,
                timezoneValue,
                timePrecision,
            );
            onChange?.(newIsoDateString, isUserChange);
        },
        [closeOnSelection, isControlled, formatDateString, onChange, timezoneValue, timePrecision, valueAsDate],
    );

    const dayPickerProps: ReactDayPickerSingleProps["dayPickerProps"] = {
        ...props.dayPickerProps,
        onDayKeyDown: (day, modifiers, e) => {
            props.dayPickerProps?.onDayKeyDown?.(day, modifiers, e);
        },
        onMonthChange: (month: Date) => {
            props.dayPickerProps?.onMonthChange?.(month);
        },
    };

    const handleShortcutChange = React.useCallback((_: DatePickerShortcut, index: number) => {
        setSelectedShortcutIndex(index);
    }, []);

    const handleStartFocusBoundaryFocusIn = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
        if (popoverContentRef.current?.contains(getRelatedTargetWithFallback(e))) {
            // Not closing Popover to allow user to freely switch between manually entering a date
            // string in the input and selecting one via the Popover
            inputRef.current?.focus();
        } else {
            getKeyboardFocusableElements(popoverContentRef).shift()?.focus();
        }
    }, []);

    const handleEndFocusBoundaryFocusIn = React.useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            if (popoverContentRef.current?.contains(getRelatedTargetWithFallback(e))) {
                inputRef.current?.focus();
                handlePopoverClose(e);
            } else {
                getKeyboardFocusableElements(popoverContentRef).pop()?.focus();
            }
        },
        [handlePopoverClose],
    );

    // React's onFocus prop listens to the focusin browser event under the hood, so it's safe to
    // provide it the focusIn event handlers instead of using a ref and manually adding the
    // event listeners ourselves.
    const popoverContent = (
        <div ref={popoverContentRef} role="dialog" aria-label="date picker" id={popoverId}>
            <div onFocus={handleStartFocusBoundaryFocusIn} tabIndex={0} />
            <DatePicker3
                {...datePickerProps}
                dayPickerProps={dayPickerProps}
                locale={locale}
                maxDate={maxDate}
                minDate={minDate}
                onChange={handleDateChange}
                onShortcutChange={handleShortcutChange}
                selectedShortcutIndex={selectedShortcutIndex}
                timePrecision={timePrecision}
                // the rest of this component handles invalid dates gracefully (to show error messages),
                // but DatePicker does not, so we must take care to filter those out
                value={isErrorState ? null : valueAsDate}
            />
            <div onFocus={handleEndFocusBoundaryFocusIn} tabIndex={0} />
        </div>
    );

    // Timezone select
    // ------------------------------------------------------------------------

    // we need a date which is guaranteed to be non-null here; if necessary,
    // we use today's date and shift it to the desired/current timezone
    const tzSelectDate = React.useMemo(
        () =>
            valueAsDate != null && DateUtils.isDateValid(valueAsDate)
                ? valueAsDate
                : TimezoneUtils.convertLocalDateToTimezoneTime(new Date(), timezoneValue),
        [timezoneValue, valueAsDate],
    );

    const isTimezoneSelectHidden = timePrecision === undefined || showTimezoneSelect === false;
    const isTimezoneSelectDisabled = disabled || disableTimezoneSelect;

    const handleTimezoneChange = React.useCallback(
        (newTimezone: string) => {
            if (controlledTimezone === undefined) {
                // uncontrolled timezone
                setTimezoneValue(newTimezone);
            }
            onTimezoneChange?.(newTimezone);

            if (valueAsDate != null) {
                const newDateString = TimezoneUtils.getIsoEquivalentWithUpdatedTimezone(
                    valueAsDate,
                    newTimezone,
                    timePrecision,
                );
                onChange?.(newDateString, true);
            }
        },
        [onChange, onTimezoneChange, valueAsDate, timePrecision, controlledTimezone],
    );

    const maybeTimezonePicker = React.useMemo(
        () =>
            isTimezoneSelectHidden ? undefined : (
                <TimezoneSelect
                    buttonProps={timezoneSelectButtonProps}
                    className={Classes.DATE_INPUT_TIMEZONE_SELECT}
                    date={tzSelectDate}
                    disabled={isTimezoneSelectDisabled}
                    onChange={handleTimezoneChange}
                    value={timezoneValue}
                >
                    <Tag
                        interactive={!isTimezoneSelectDisabled}
                        minimal={true}
                        rightIcon={isTimezoneSelectDisabled ? undefined : "caret-down"}
                    >
                        {TimezoneNameUtils.getTimezoneShortName(timezoneValue, tzSelectDate)}
                    </Tag>
                </TimezoneSelect>
            ),
        [handleTimezoneChange, isTimezoneSelectDisabled, isTimezoneSelectHidden, timezoneValue, tzSelectDate],
    );

    // Text input
    // ------------------------------------------------------------------------

    const handleInputFocus = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            setIsInputFocused(true);
            setIsOpen(true);
            setInputValue(formattedDateString);
            inputProps?.onFocus?.(e);
        },
        [formattedDateString, inputProps],
    );

    const handleInputBlur = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (inputValue == null || valueAsDate == null) {
                return;
            }

            const date = parseDateString(inputValue);

            if (
                inputValue.length > 0 &&
                inputValue !== formattedDateString &&
                (!DateUtils.isDateValid(date) || !DateUtils.isDayInRange(date, [minDate, maxDate]))
            ) {
                if (isControlled) {
                    setIsInputFocused(false);
                } else {
                    setIsInputFocused(false);
                    setValue(date);
                    setInputValue(undefined);
                }

                if (date === null) {
                    onChange?.(null, true);
                } else {
                    onError?.(date);
                }
            } else {
                if (inputValue.length === 0) {
                    setIsInputFocused(false);
                    setValue(null);
                    setInputValue(undefined);
                } else {
                    setIsInputFocused(false);
                }
            }
            inputProps?.onBlur?.(e);
        },
        [
            formattedDateString,
            inputProps,
            inputValue,
            isControlled,
            maxDate,
            minDate,
            onChange,
            onError,
            parseDateString,
            valueAsDate,
        ],
    );

    const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const valueString = e.target.value;
            const inputValueAsDate = parseDateString(valueString);

            if (
                DateUtils.isDateValid(inputValueAsDate) &&
                DateUtils.isDayInRange(inputValueAsDate, [minDate, maxDate])
            ) {
                if (isControlled) {
                    setInputValue(valueString);
                } else {
                    setValue(inputValueAsDate);
                    setInputValue(valueString);
                }
                const newIsoDateString = TimezoneUtils.getIsoEquivalentWithUpdatedTimezone(
                    inputValueAsDate,
                    timezoneValue,
                    timePrecision,
                );
                onChange?.(newIsoDateString, true);
            } else {
                if (valueString.length === 0) {
                    onChange?.(null, true);
                }
                setValue(inputValueAsDate);
                setInputValue(valueString);
            }
            inputProps?.onChange?.(e);
        },
        [isControlled, minDate, maxDate, timezoneValue, timePrecision, parseDateString, onChange, inputProps],
    );

    const handleInputClick = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>) => {
            // stop propagation to the Popover's internal handleTargetClick handler;
            // otherwise, the popover will flicker closed as soon as it opens.
            e.stopPropagation();
            inputProps?.onClick?.(e);
        },
        [inputProps],
    );

    const handleInputKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Tab" && e.shiftKey) {
                // close popover on SHIFT+TAB key press
                handlePopoverClose(e);
            } else if (e.key === "Tab" && isOpen) {
                getKeyboardFocusableElements(popoverContentRef).shift()?.focus();
                // necessary to prevent focusing the second focusable element
                e.preventDefault();
            } else if (e.key === "Escape") {
                setIsOpen(false);
                inputRef.current?.blur();
            } else if (e.key === "Enter" && inputValue != null) {
                const nextDate = parseDateString(inputValue);
                if (DateUtils.isDateValid(nextDate)) {
                    handleDateChange(nextDate, true, true);
                }
            }

            inputProps?.onKeyDown?.(e);
        },
        [handleDateChange, handlePopoverClose, inputProps, inputValue, isOpen, parseDateString],
    );

    // Main render
    // ------------------------------------------------------------------------

    const shouldShowErrorStyling =
        !isInputFocused || inputValue === outOfRangeMessage || inputValue === invalidDateMessage;

    // We use the renderTarget API to flatten the rendered DOM and make it easier to implement features like the "fill" prop.
    const renderTarget = React.useCallback(
        ({ isOpen: targetIsOpen, ref, ...targetProps }: PopoverTargetProps & PopoverClickTargetHandlers) => {
            return (
                <InputGroup
                    autoComplete="off"
                    className={classNames(targetProps.className, inputProps.className)}
                    intent={shouldShowErrorStyling && isErrorState ? "danger" : "none"}
                    placeholder={placeholder}
                    rightElement={
                        <>
                            {rightElement}
                            {maybeTimezonePicker}
                        </>
                    }
                    tagName={popoverProps.targetTagName}
                    type="text"
                    role="combobox"
                    {...targetProps}
                    {...inputProps}
                    aria-controls={popoverId}
                    aria-expanded={targetIsOpen}
                    disabled={disabled}
                    fill={fill}
                    inputRef={mergeRefs(ref, inputRef, inputProps?.inputRef ?? null)}
                    onBlur={handleInputBlur}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                    value={(isInputFocused ? inputValue : formattedDateString) ?? ""}
                />
            );
        },
        [
            disabled,
            fill,
            formattedDateString,
            handleInputBlur,
            handleInputChange,
            handleInputClick,
            handleInputFocus,
            handleInputKeyDown,
            inputProps,
            inputValue,
            isErrorState,
            isInputFocused,
            maybeTimezonePicker,
            placeholder,
            popoverProps.targetTagName,
            rightElement,
            shouldShowErrorStyling,
        ],
    );

    // N.B. no need to set `fill` since that is unused with the `renderTarget` API
    return (
        <Popover
            isOpen={isOpen && !disabled}
            {...popoverProps}
            autoFocus={false}
            className={classNames(Classes.DATE_INPUT, popoverProps.className, props.className)}
            content={popoverContent}
            enforceFocus={false}
            onClose={handlePopoverClose}
            popoverClassName={classNames(Classes.DATE_INPUT_POPOVER, popoverProps.popoverClassName)}
            ref={popoverRef}
            renderTarget={renderTarget}
        />
    );
});
DateInput3.displayName = `${DISPLAYNAME_PREFIX}.DateInput3`;
DateInput3.defaultProps = defaultProps;

/** Gets the input `placeholder` value from props, using default values if undefined */
function getPlaceholder(props: DateInput3Props): string | undefined {
    if (props.placeholder !== undefined || (props.formatDate !== undefined && props.parseDate !== undefined)) {
        return props.placeholder;
    } else {
        return props.dateFnsFormat ?? getDefaultDateFnsFormat(props);
    }
}

function getInitialTimezoneValue({ defaultTimezone, timezone }: DateInput3Props) {
    if (timezone !== undefined) {
        // controlled mode
        if (TimezoneNameUtils.isValidTimezone(timezone)) {
            return timezone;
        } else {
            console.error(Errors.DATEINPUT_INVALID_TIMEZONE);
            return TimezoneUtils.UTC_TIME.ianaCode;
        }
    } else if (defaultTimezone !== undefined) {
        // uncontrolled mode with initial value
        if (TimezoneNameUtils.isValidTimezone(defaultTimezone)) {
            return defaultTimezone;
        } else {
            console.error(Errors.DATEINPUT_INVALID_DEFAULT_TIMEZONE);
            return TimezoneUtils.UTC_TIME.ianaCode;
        }
    } else {
        // uncontrolled mode
        return TimezoneUtils.getCurrentTimezone();
    }
}

function getRelatedTargetWithFallback(e: React.FocusEvent<HTMLElement>) {
    return (e.relatedTarget ?? Utils.getActiveElement(e.currentTarget)) as HTMLElement;
}

function getKeyboardFocusableElements(popoverContentRef: React.MutableRefObject<HTMLDivElement | null>) {
    if (popoverContentRef.current === null) {
        return [];
    }

    const elements: HTMLElement[] = Array.from(
        popoverContentRef.current.querySelectorAll("button:not([disabled]),input,[tabindex]:not([tabindex='-1'])"),
    );
    // Remove focus boundary div elements
    elements.pop();
    elements.shift();
    return elements;
}
