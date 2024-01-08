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
 * All changes & bugfixes should be made to DateInput3 in the datetime2
 * package instead.
 */

/* eslint-disable deprecation/deprecation, @blueprintjs/no-deprecated-components, react-hooks/exhaustive-deps */

import classNames from "classnames";
import * as React from "react";
import type { DayPickerProps } from "react-day-picker";

import {
    type ButtonProps,
    DISPLAYNAME_PREFIX,
    InputGroup,
    type InputGroupProps,
    mergeRefs,
    Popover,
    type PopoverClickTargetHandlers,
    type PopoverTargetProps,
    type Props,
    Tag,
    Utils,
} from "@blueprintjs/core";

import { Classes, type DateFormatProps, type DatePickerBaseProps } from "../../common";
import { getFormattedDateString } from "../../common/dateFormatProps";
import type { DatetimePopoverProps } from "../../common/datetimePopoverProps";
import { hasMonthChanged, hasTimeChanged, isDateValid, isDayInRange } from "../../common/dateUtils";
import * as Errors from "../../common/errors";
import { getCurrentTimezone } from "../../common/getTimezone";
import { UTC_TIME } from "../../common/timezoneItems";
import { getTimezoneShortName, isValidTimezone } from "../../common/timezoneNameUtils";
import {
    convertLocalDateToTimezoneTime,
    getDateObjectFromIsoString,
    getIsoEquivalentWithUpdatedTimezone,
} from "../../common/timezoneUtils";
import { DatePicker } from "../date-picker/datePicker";
import { DatePickerUtils } from "../date-picker/datePickerUtils";
import type { DatePickerShortcut } from "../shortcuts/shortcuts";
import { TimezoneSelect } from "../timezone-select/timezoneSelect";

export interface DateInputProps extends DatePickerBaseProps, DateFormatProps, DatetimePopoverProps, Props {
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
     * The default timezone selected. Defaults to the user's local timezone.
     *
     * Mutually exclusive with `timezone` prop.
     *
     * @see https://www.iana.org/time-zones
     */
    defaultTimezone?: string;

    /**
     * Whether to disable the timezone select.
     *
     * @default false
     */
    disableTimezoneSelect?: boolean;

    /**
     * The default date to be used in the component when uncontrolled, represented as an ISO string.
     */
    defaultValue?: string;

    /**
     * Whether the date input is non-interactive.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Props to pass to the [InputGroup component](#core/components/input-group).
     *
     * Some properties are unavailable:
     * - `inputProps.value`: use `value` instead
     * - `inputProps.disabled`: use `disabled` instead
     * - `inputProps.type`: cannot be customized, always set to "text"
     *
     * Note that `inputProps.tagName` will override `popoverProps.targetTagName`.
     */
    inputProps?: Partial<Omit<InputGroupProps, "disabled" | "type" | "value">>;

    /**
     * Callback invoked whenever the date or timezone has changed.
     *
     * @param newDate ISO string or `null` (if the date is invalid or text input has been cleared)
     * @param isUserChange `true` if the user clicked on a date in the calendar, changed the input value,
     *     or cleared the selection; `false` if the date was changed by changing the month or year.
     */
    onChange?: (newDate: string | null, isUserChange: boolean) => void;

    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned. If the date is out of range,
     * the out of range date will be returned (`onChange` is not called in this case).
     */
    onError?: (errorDate: Date) => void;

    /**
     * Callback invoked when the user selects a timezone.
     *
     * @param timezone the new timezone's IANA code
     */
    onTimezoneChange?: (timezone: string) => void;

    /**
     * Element to render on right side of input.
     */
    rightElement?: React.JSX.Element;

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown below the calendar.
     *
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * Whether to show the timezone select dropdown on the right side of the input.
     * If `timePrecision` is undefined, this will always be false.
     *
     * @default false
     */
    showTimezoneSelect?: boolean;

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
     * The currently selected timezone UTC identifier, e.g. "Pacific/Honolulu".
     *
     * If you set this prop, the TimezoneSelect will behave in a controlled manner and you are responsible
     * for updating this value using the `onTimezoneChange` callback.
     *
     * Mutually exclusive with `defaultTimezone` prop.
     *
     * @see https://www.iana.org/time-zones
     */
    timezone?: string;

    /**
     * Text for the today button in the date picker action bar.
     * Passed to `DatePicker` component.
     *
     * @default "Today"
     */
    todayButtonText?: string;

    /** An ISO string representing the selected time. */
    value?: string | null;
}

const timezoneSelectButtonProps: Partial<ButtonProps> = {
    fill: false,
    minimal: true,
    outlined: true,
};

const INVALID_DATE = new Date(undefined!);
const DEFAULT_MAX_DATE = DatePickerUtils.getDefaultMaxDate();
const DEFAULT_MIN_DATE = DatePickerUtils.getDefaultMinDate();

/**
 * Date input component.
 *
 * @see https://blueprintjs.com/docs/#datetime/date-input
 * @deprecated use `{ DateInput3 } from "@blueprintjs/datetime2"` instead
 */
export const DateInput: React.FC<DateInputProps> = React.memo(function _DateInput(props) {
    const {
        defaultTimezone,
        defaultValue,
        disableTimezoneSelect,
        fill,
        inputProps = {},
        // defaults duplicated here for TypeScript convenience
        maxDate = DEFAULT_MAX_DATE,
        minDate = DEFAULT_MIN_DATE,
        placeholder,
        popoverProps = {},
        popoverRef,
        showTimezoneSelect,
        timePrecision,
        timezone,
        value,
        ...datePickerProps
    } = props;

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
        () => getDateObjectFromIsoString(value, timezoneValue),
        [timezoneValue, value],
    );
    const isControlled = valueFromProps !== undefined;
    const defaultValueFromProps = React.useMemo(
        () => getDateObjectFromIsoString(defaultValue, timezoneValue),
        [defaultValue, defaultTimezone],
    );
    const [valueAsDate, setValue] = React.useState<Date | null>(isControlled ? valueFromProps : defaultValueFromProps!);

    const [selectedShortcutIndex, setSelectedShortcutIndex] = React.useState<number | undefined>(undefined);
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    // rendered as the text input's value
    const formattedDateString = React.useMemo(() => {
        return valueAsDate === null ? undefined : getFormattedDateString(valueAsDate, props);
    }, [
        valueAsDate,
        minDate,
        maxDate,
        // HACKHACK: ESLint false positive
        // eslint-disable-next-line @typescript-eslint/unbound-method
        props.formatDate,
        props.locale,
        props.invalidDateMessage,
        props.outOfRangeMessage,
    ]);
    const [inputValue, setInputValue] = React.useState(formattedDateString ?? undefined);

    const isErrorState =
        valueAsDate != null && (!isDateValid(valueAsDate) || !isDayInRange(valueAsDate, [minDate, maxDate]));

    // Effects
    // ------------------------------------------------------------------------

    React.useEffect(() => {
        if (isControlled) {
            setValue(valueFromProps);
        }
    }, [valueFromProps]);

    React.useEffect(() => {
        // uncontrolled mode, updating initial timezone value
        if (defaultTimezone !== undefined && isValidTimezone(defaultTimezone)) {
            setTimezoneValue(defaultTimezone);
        }
    }, [defaultTimezone]);

    React.useEffect(() => {
        // controlled mode, updating timezone value
        if (timezone !== undefined && isValidTimezone(timezone)) {
            setTimezoneValue(timezone);
        }
    }, [timezone]);

    React.useEffect(() => {
        if (isControlled && !isInputFocused) {
            setInputValue(formattedDateString);
        }
    }, [formattedDateString]);

    // Popover contents (date picker)
    // ------------------------------------------------------------------------

    const handlePopoverClose = React.useCallback((e: React.SyntheticEvent<HTMLElement>) => {
        popoverProps.onClose?.(e);
        setIsOpen(false);
    }, []);

    const handleDateChange = React.useCallback(
        (newDate: Date | null, isUserChange: boolean, didSubmitWithEnter = false) => {
            const prevDate = valueAsDate;

            if (newDate === null) {
                if (!isControlled && !didSubmitWithEnter) {
                    // user clicked on current day in the calendar, so we should clear the input when uncontrolled
                    setInputValue("");
                }
                props.onChange?.(null, isUserChange);
                return;
            }

            // this change handler was triggered by a change in month, day, or (if
            // enabled) time. for UX purposes, we want to close the popover only if
            // the user explicitly clicked a day within the current month.
            const newIsOpen =
                !isUserChange ||
                !props.closeOnSelection ||
                (prevDate != null &&
                    (hasMonthChanged(prevDate, newDate) ||
                        (timePrecision !== undefined && hasTimeChanged(prevDate, newDate))));

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
                const newFormattedDateString = getFormattedDateString(newDate, props);
                setIsInputFocused(newIsInputFocused);
                setIsOpen(newIsOpen);
                setValue(newDate);
                setInputValue(newFormattedDateString);
            }

            const newIsoDateString = getIsoEquivalentWithUpdatedTimezone(newDate, timezoneValue, timePrecision);
            props.onChange?.(newIsoDateString, isUserChange);
        },
        [props.onChange, timezoneValue, timePrecision, valueAsDate],
    );

    const dayPickerProps: DayPickerProps = {
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

    const handleEndFocusBoundaryFocusIn = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
        if (popoverContentRef.current?.contains(getRelatedTargetWithFallback(e))) {
            inputRef.current?.focus();
            handlePopoverClose(e);
        } else {
            getKeyboardFocusableElements(popoverContentRef).pop()?.focus();
        }
    }, []);

    // React's onFocus prop listens to the focusin browser event under the hood, so it's safe to
    // provide it the focusIn event handlers instead of using a ref and manually adding the
    // event listeners ourselves.
    const popoverContent = (
        <div ref={popoverContentRef} role="dialog" aria-label="date picker" id={popoverId}>
            <div onFocus={handleStartFocusBoundaryFocusIn} tabIndex={0} />
            <DatePicker
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
            valueAsDate != null && isDateValid(valueAsDate)
                ? valueAsDate
                : convertLocalDateToTimezoneTime(new Date(), timezoneValue),
        [timezoneValue, valueAsDate],
    );

    const isTimezoneSelectHidden = timePrecision === undefined || showTimezoneSelect === false;
    const isTimezoneSelectDisabled = props.disabled || disableTimezoneSelect;

    const handleTimezoneChange = React.useCallback(
        (newTimezone: string) => {
            if (timezone === undefined) {
                // uncontrolled timezone
                setTimezoneValue(newTimezone);
            }
            props.onTimezoneChange?.(newTimezone);

            if (valueAsDate != null) {
                const newDateString = getIsoEquivalentWithUpdatedTimezone(valueAsDate, newTimezone, timePrecision);
                props.onChange?.(newDateString, true);
            }
        },
        [props.onChange, valueAsDate, timePrecision],
    );

    const maybeTimezonePicker = isTimezoneSelectHidden ? undefined : (
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
                {getTimezoneShortName(timezoneValue, tzSelectDate)}
            </Tag>
        </TimezoneSelect>
    );

    // Text input
    // ------------------------------------------------------------------------

    const parseDate = React.useCallback(
        (dateString: string) => {
            if (dateString === props.outOfRangeMessage || dateString === props.invalidDateMessage) {
                return null;
            }
            const newDate = props.parseDate(dateString, props.locale);
            return newDate === false ? INVALID_DATE : newDate;
        },
        // HACKHACK: ESLint false positive
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [props.outOfRangeMessage, props.invalidDateMessage, props.parseDate, props.locale],
    );

    const handleInputFocus = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            setIsInputFocused(true);
            setIsOpen(true);
            setInputValue(formattedDateString);
            props.inputProps?.onFocus?.(e);
        },
        [formattedDateString, props.inputProps?.onFocus],
    );

    const handleInputBlur = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (inputValue == null || valueAsDate == null) {
                return;
            }

            const date = parseDate(inputValue);

            if (
                inputValue.length > 0 &&
                inputValue !== formattedDateString &&
                (!isDateValid(date) || !isDayInRange(date, [minDate, maxDate]))
            ) {
                if (isControlled) {
                    setIsInputFocused(false);
                } else {
                    setIsInputFocused(false);
                    setValue(date);
                    setInputValue(undefined);
                }

                if (date === null) {
                    props.onChange?.(null, true);
                } else {
                    props.onError?.(date);
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
            props.inputProps?.onBlur?.(e);
        },
        [
            parseDate,
            formattedDateString,
            inputValue,
            valueAsDate,
            minDate,
            maxDate,
            props.onChange,
            props.onError,
            props.inputProps?.onBlur,
        ],
    );

    const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const valueString = (e.target as HTMLInputElement).value;
            const inputValueAsDate = parseDate(valueString);

            if (isDateValid(inputValueAsDate) && isDayInRange(inputValueAsDate, [minDate, maxDate])) {
                if (isControlled) {
                    setInputValue(valueString);
                } else {
                    setValue(inputValueAsDate);
                    setInputValue(valueString);
                }
                const newIsoDateString = getIsoEquivalentWithUpdatedTimezone(
                    inputValueAsDate,
                    timezoneValue,
                    timePrecision,
                );
                props.onChange?.(newIsoDateString, true);
            } else {
                if (valueString.length === 0) {
                    props.onChange?.(null, true);
                }
                setValue(inputValueAsDate);
                setInputValue(valueString);
            }
            props.inputProps?.onChange?.(e);
        },
        [minDate, maxDate, timezoneValue, timePrecision, parseDate, props.onChange, props.inputProps?.onChange],
    );

    const handleInputClick = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>) => {
            // stop propagation to the Popover's internal handleTargetClick handler;
            // otherwise, the popover will flicker closed as soon as it opens.
            e.stopPropagation();
            props.inputProps?.onClick?.(e);
        },
        [props.inputProps?.onClick],
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
                const nextDate = parseDate(inputValue);
                if (isDateValid(nextDate)) {
                    handleDateChange(nextDate, true, true);
                }
            }

            props.inputProps?.onKeyDown?.(e);
        },
        [inputValue, parseDate, props.inputProps?.onKeyDown],
    );

    // Main render
    // ------------------------------------------------------------------------

    const shouldShowErrorStyling =
        !isInputFocused || inputValue === props.outOfRangeMessage || inputValue === props.invalidDateMessage;

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
                            {props.rightElement}
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
                    disabled={props.disabled}
                    fill={fill}
                    inputRef={mergeRefs(ref, inputRef, props.inputProps?.inputRef ?? null)}
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
            fill,
            formattedDateString,
            inputValue,
            isInputFocused,
            isTimezoneSelectDisabled,
            isTimezoneSelectHidden,
            placeholder,
            shouldShowErrorStyling,
            timezoneValue,
            props.disabled,
            props.inputProps,
            props.rightElement,
        ],
    );

    // N.B. no need to set `fill` since that is unused with the `renderTarget` API
    return (
        <Popover
            isOpen={isOpen && !props.disabled}
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
DateInput.displayName = `${DISPLAYNAME_PREFIX}.DateInput`;
DateInput.defaultProps = {
    closeOnSelection: true,
    disabled: false,
    invalidDateMessage: "Invalid date",
    maxDate: DEFAULT_MAX_DATE,
    minDate: DEFAULT_MIN_DATE,
    outOfRangeMessage: "Out of range",
    reverseMonthAndYearMenus: false,
};

function getInitialTimezoneValue({ defaultTimezone, timezone }: DateInputProps) {
    if (timezone !== undefined) {
        // controlled mode
        if (isValidTimezone(timezone)) {
            return timezone;
        } else {
            console.error(Errors.DATEINPUT_INVALID_TIMEZONE);
            return UTC_TIME.ianaCode;
        }
    } else if (defaultTimezone !== undefined) {
        // uncontrolled mode with initial value
        if (isValidTimezone(defaultTimezone)) {
            return defaultTimezone;
        } else {
            console.error(Errors.DATEINPUT_INVALID_DEFAULT_TIMEZONE);
            return UTC_TIME.ianaCode;
        }
    } else {
        // uncontrolled mode
        return getCurrentTimezone();
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
