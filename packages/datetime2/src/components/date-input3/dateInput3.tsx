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
    ButtonProps,
    DISPLAYNAME_PREFIX,
    InputGroup,
    mergeRefs,
    Popover,
    PopoverClickTargetHandlers,
    PopoverTargetProps,
    Tag,
    Utils,
} from "@blueprintjs/core";
import {
    DatePickerShortcut,
    DatePickerUtils,
    DateUtils,
    Errors,
    TimezoneNameUtils,
    TimezoneSelect,
    TimezoneUtils,
} from "@blueprintjs/datetime";

import { Classes } from "../../classes";
import { DatePicker3, DatePicker3Props } from "../date-picker3/datePicker3";
import { getFormattedDateString } from "./dateInput3FormatUtils";
import { DateInput3Props } from "./dateInput3Props";

export { DateInput3Props };

const timezoneSelectButtonProps: Partial<ButtonProps> = {
    fill: false,
    minimal: true,
    outlined: true,
};

const INVALID_DATE = new Date(undefined!);
const DEFAULT_MAX_DATE = DatePickerUtils.getDefaultMaxDate();
const DEFAULT_MIN_DATE = DatePickerUtils.getDefaultMinDate();

/**
 * Date input (v3) component.
 *
 * @see https://blueprintjs.com/docs/#datetime2/date-input3
 */
export const DateInput3: React.FC<DateInput3Props> = React.memo(function _DateInput(props) {
    const {
        closeOnSelection,
        defaultTimezone,
        defaultValue,
        disabled,
        disableTimezoneSelect,
        fill,
        formatDate,
        inputProps = {},
        invalidDateMessage,
        locale,
        // defaults duplicated here for TypeScript convenience
        maxDate = DEFAULT_MAX_DATE,
        minDate = DEFAULT_MIN_DATE,
        onChange,
        onError,
        outOfRangeMessage,
        parseDate,
        placeholder,
        popoverProps = {},
        popoverRef,
        rightElement,
        showTimezoneSelect,
        timePrecision,
        value,
        ...datePickerProps
    } = props;

    // Refs
    // ------------------------------------------------------------------------

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const popoverContentRef = React.useRef<HTMLDivElement | null>(null);

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
    const [valueAsDate, setValue] = React.useState<Date | null>(isControlled ? valueFromProps : defaultValueFromProps!);

    const [selectedShortcutIndex, setSelectedShortcutIndex] = React.useState<number | undefined>(undefined);
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    // rendered as the text input's value
    const formattedDateString = React.useMemo(() => {
        return valueAsDate === null
            ? undefined
            : getFormattedDateString(valueAsDate, {
                  formatDate,
                  invalidDateMessage,
                  locale,
                  maxDate,
                  minDate,
                  outOfRangeMessage,
              });
    }, [valueAsDate, minDate, maxDate, formatDate, locale, invalidDateMessage, outOfRangeMessage]);
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
        if (defaultTimezone !== undefined && TimezoneNameUtils.isValidTimezone(defaultTimezone)) {
            setTimezoneValue(defaultTimezone);
        }
    }, [defaultTimezone]);

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
                const newFormattedDateString = getFormattedDateString(newDate, props) ?? "";
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
        [closeOnSelection, isControlled, props, onChange, timezoneValue, timePrecision, valueAsDate],
    );

    const dayPickerProps: DatePicker3Props["dayPickerProps"] = {
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
        <div ref={popoverContentRef}>
            <div onFocus={handleStartFocusBoundaryFocusIn} tabIndex={0} />
            <DatePicker3
                {...datePickerProps}
                dayPickerProps={dayPickerProps}
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
            setTimezoneValue(newTimezone);
            if (valueAsDate != null) {
                const newDateString = TimezoneUtils.getIsoEquivalentWithUpdatedTimezone(
                    valueAsDate,
                    newTimezone,
                    timePrecision,
                );
                onChange?.(newDateString, true);
            }
        },
        [onChange, valueAsDate, timePrecision],
    );

    const maybeTimezonePicker = React.useMemo(
        () =>
            isTimezoneSelectHidden ? undefined : (
                <TimezoneSelect
                    value={timezoneValue}
                    onChange={handleTimezoneChange}
                    date={tzSelectDate}
                    disabled={isTimezoneSelectDisabled}
                    className={Classes.DATE_INPUT_TIMEZONE_SELECT}
                    buttonProps={timezoneSelectButtonProps}
                >
                    <Tag
                        rightIcon={isTimezoneSelectDisabled ? undefined : "caret-down"}
                        interactive={!isTimezoneSelectDisabled}
                        minimal={true}
                    >
                        {TimezoneNameUtils.getTimezoneShortName(timezoneValue, tzSelectDate)}
                    </Tag>
                </TimezoneSelect>
            ),
        [handleTimezoneChange, isTimezoneSelectDisabled, isTimezoneSelectHidden, timezoneValue, tzSelectDate],
    );

    // Text input
    // ------------------------------------------------------------------------

    const parseInputValue = React.useCallback(
        (dateString: string) => {
            if (dateString === outOfRangeMessage || dateString === invalidDateMessage) {
                return null;
            }
            const newDate = parseDate(dateString, locale);
            return newDate === false ? INVALID_DATE : newDate;
        },
        [outOfRangeMessage, invalidDateMessage, parseDate, locale],
    );

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

            const date = parseInputValue(inputValue);

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
            parseInputValue,
            valueAsDate,
        ],
    );

    const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const valueString = (e.target as HTMLInputElement).value;
            const inputValueAsDate = parseInputValue(valueString);

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
        [isControlled, minDate, maxDate, timezoneValue, timePrecision, parseInputValue, onChange, inputProps],
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
                const nextDate = parseInputValue(inputValue);
                if (DateUtils.isDateValid(nextDate)) {
                    handleDateChange(nextDate, true, true);
                }
            }

            inputProps?.onKeyDown?.(e);
        },
        [handleDateChange, handlePopoverClose, inputProps, inputValue, isOpen, parseInputValue],
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
                    {...targetProps}
                    {...inputProps}
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
DateInput3.defaultProps = {
    closeOnSelection: true,
    disabled: false,
    invalidDateMessage: "Invalid date",
    maxDate: DEFAULT_MAX_DATE,
    minDate: DEFAULT_MIN_DATE,
    outOfRangeMessage: "Out of range",
    reverseMonthAndYearMenus: false,
};

function getInitialTimezoneValue({ defaultTimezone }: DateInput3Props) {
    if (defaultTimezone === undefined) {
        return TimezoneUtils.getCurrentTimezone();
    } else {
        if (TimezoneNameUtils.isValidTimezone(defaultTimezone)) {
            return defaultTimezone;
        } else {
            console.error(Errors.DATEINPUT_INVALID_DEFAULT_TIMEZONE);
            return TimezoneUtils.UTC_TIME.ianaCode;
        }
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
