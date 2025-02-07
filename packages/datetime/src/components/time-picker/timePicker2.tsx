/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
    Classes as CoreClasses,
    Utils as CoreUtils,
    DISPLAYNAME_PREFIX,
    HTMLSelect,
    Icon,
    Intent,
} from "@blueprintjs/core";

import { Classes, DateUtils, type TimePickerProps, TimePrecision } from "../../common";
import {
    getDefaultMaxTime,
    getDefaultMinTime,
    getTimeUnit,
    getTimeUnitClassName,
    getTimeUnitMax,
    getTimeUnitPrintStr,
    isTimeUnitValid,
    setTimeUnit,
    TimeUnit,
    wrapTimeAtUnit,
} from "../../common/timeUnit";
import * as Utils from "../../common/utils";

const timeInputIds: { [key in TimeUnit]: string } = {
    [TimeUnit.HOUR_24]: CoreUtils.uniqueId(TimeUnit.HOUR_24 + "-input"),
    [TimeUnit.HOUR_12]: CoreUtils.uniqueId(TimeUnit.HOUR_12 + "-input"),
    [TimeUnit.MINUTE]: CoreUtils.uniqueId(TimeUnit.MINUTE + "-input"),
    [TimeUnit.SECOND]: CoreUtils.uniqueId(TimeUnit.SECOND + "-input"),
    [TimeUnit.MS]: CoreUtils.uniqueId(TimeUnit.MS + "-input"),
};

export interface TimePickerState {
    hourText?: string;
    minuteText?: string;
    secondText?: string;
    millisecondText?: string;
    value?: Date;
    isPm?: boolean;
}

type ChangeTime = {
    type: "changeTime";
    payload: { unit: TimeUnit; value: string };
};

type IncrementTime = {
    type: "incrementTime";
    payload: { unit: TimeUnit };
};

type DecrementTime = {
    type: "decrementTime";
    payload: { unit: TimeUnit };
};

type Action = ChangeTime | IncrementTime | DecrementTime;

function reducer(state: TimePickerState, action: Action): TimePickerState {
    const key = unitToStateKey(action.payload.unit);
    switch (action.type) {
        case "changeTime":
            return { ...state, [key]: action.payload.value };
        case "incrementTime":
            const newTime = getTimeUnit(action.payload.unit, state.value) + 1;
            const wrappedTime = wrapTimeAtUnit(action.payload.unit, newTime);
            return { ...state, [key]: getTimeUnit(action.payload.unit, state.value) + 1 };
        case "decrementTime":
            return { ...state, [key]: state[key] };
        default:
            return state;
    }
}

function unitToStateKey(unit: TimeUnit): keyof TimePickerState {
    switch (unit) {
        case TimeUnit.HOUR_24:
            return "hourText";
        case TimeUnit.HOUR_12:
            return "hourText";
        case TimeUnit.MINUTE:
            return "minuteText";
        case TimeUnit.SECOND:
            return "secondText";
        case TimeUnit.MS:
            return "millisecondText";
    }
}

/**
 * Time picker component.
 *
 * @see https://blueprintjs.com/docs/#datetime/timepicker
 */
export const TimePicker2: React.FC<TimePickerProps> = props => {
    const {
        autoFocus = false,
        className,
        defaultValue,
        disabled = false,
        maxTime = getDefaultMaxTime(),
        minTime = getDefaultMinTime(),
        onBlur,
        onFocus,
        onKeyDown,
        onKeyUp,
        onChange,
        precision = TimePrecision.MINUTE,
        selectAllOnFocus = false,
        showArrowButtons = false,
        useAmPm = false,
        value: initialValue,
    } = props;

    const value = initialValue != null ? initialValue : defaultValue != null ? defaultValue : minTime;

    const shouldRenderMilliseconds = precision === TimePrecision.MILLISECOND;
    const shouldRenderSeconds = shouldRenderMilliseconds || precision === TimePrecision.SECOND;

    const hourUnit = useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
    const timeInRange = DateUtils.getTimeInRange(value, minTime, maxTime);

    const getFullStateFromValue = (date: Date) => {
        /* eslint-disable sort-keys */
        return {
            hourText: formatTime(timeInRange.getHours(), hourUnit),
            minuteText: formatTime(timeInRange.getMinutes(), TimeUnit.MINUTE),
            secondText: formatTime(timeInRange.getSeconds(), TimeUnit.SECOND),
            millisecondText: formatTime(timeInRange.getMilliseconds(), TimeUnit.MS),
            value: timeInRange,
            isPm: DateUtils.getIsPmFrom24Hour(timeInRange.getHours()),
        };
        /* eslint-enable sort-keys */
    };

    const [state, dispatch] = React.useReducer(reducer, {
        /* eslint-disable sort-keys */
        hourText: formatTime(timeInRange.getHours(), hourUnit),
        minuteText: formatTime(timeInRange.getMinutes(), TimeUnit.MINUTE),
        secondText: formatTime(timeInRange.getSeconds(), TimeUnit.SECOND),
        millisecondText: formatTime(timeInRange.getMilliseconds(), TimeUnit.MS),
        value: timeInRange,
        isPm: DateUtils.getIsPmFrom24Hour(timeInRange.getHours()),
        /* eslint-enable sort-keys */
    });

    const getInputChangeHandler = (unit: TimeUnit) => (text: string) => {
        dispatch({ payload: { unit, value: text }, type: "changeTime" });
    };

    return (
        <div className={classNames(Classes.TIMEPICKER, className, { [CoreClasses.DISABLED]: disabled })}>
            {showArrowButtons && (
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    <ArrowButton dispatch={dispatch} isDirectionUp={true} unit={hourUnit} />
                    <ArrowButton dispatch={dispatch} isDirectionUp={true} unit={TimeUnit.MINUTE} />
                    {shouldRenderSeconds && (
                        <ArrowButton dispatch={dispatch} isDirectionUp={true} unit={TimeUnit.SECOND} />
                    )}
                    {shouldRenderMilliseconds && (
                        <ArrowButton dispatch={dispatch} isDirectionUp={true} unit={TimeUnit.MS} />
                    )}
                </div>
            )}
            <div className={Classes.TIMEPICKER_INPUT_ROW}>
                <TimePickerInput
                    autoFocus={autoFocus}
                    className={Classes.TIMEPICKER_HOUR}
                    disabled={disabled}
                    showArrowButtons={showArrowButtons}
                    onChange={getInputChangeHandler(hourUnit)}
                    unit={hourUnit}
                    value={state.hourText}
                />
                <TimePickerDivider />
                <TimePickerInput
                    autoFocus={autoFocus}
                    className={Classes.TIMEPICKER_MINUTE}
                    disabled={disabled}
                    showArrowButtons={showArrowButtons}
                    onChange={getInputChangeHandler(TimeUnit.MINUTE)}
                    unit={TimeUnit.MINUTE}
                    value={state.minuteText}
                />
                {shouldRenderSeconds && (
                    <>
                        <TimePickerDivider />
                        <TimePickerInput
                            autoFocus={autoFocus}
                            className={Classes.TIMEPICKER_SECOND}
                            disabled={disabled}
                            showArrowButtons={showArrowButtons}
                            onChange={getInputChangeHandler(TimeUnit.SECOND)}
                            unit={TimeUnit.SECOND}
                            value={state.secondText}
                        />
                    </>
                )}
                {shouldRenderMilliseconds && (
                    <>
                        <TimePickerDivider text="." />
                        <TimePickerInput
                            autoFocus={autoFocus}
                            className={Classes.TIMEPICKER_MILLISECOND}
                            disabled={disabled}
                            showArrowButtons={showArrowButtons}
                            onChange={getInputChangeHandler(TimeUnit.MS)}
                            unit={TimeUnit.MS}
                            value={state.millisecondText}
                        />
                    </>
                )}
            </div>
            {useAmPm && <TimePickerAmPm disabled={disabled} value={state.isPm} />}
            {showArrowButtons && (
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    <ArrowButton dispatch={dispatch} unit={hourUnit} />
                    <ArrowButton dispatch={dispatch} unit={TimeUnit.MINUTE} />
                    {shouldRenderSeconds && <ArrowButton dispatch={dispatch} unit={TimeUnit.SECOND} />}
                    {shouldRenderMilliseconds && <ArrowButton dispatch={dispatch} unit={TimeUnit.MS} />}
                </div>
            )}
        </div>
    );
};

TimePicker2.displayName = `${DISPLAYNAME_PREFIX}.TimePicker2`;

interface ArrowButtonProps {
    dispatch: React.Dispatch<Action>;
    isDirectionUp?: boolean;
    unit: TimeUnit;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ dispatch, isDirectionUp = false, unit }) => {
    const label = `${isDirectionUp ? "Increase" : "Decrease"} ${getTimeUnitPrintStr(unit)}`;

    const onClick = React.useCallback(() => {
        dispatch({ payload: { unit }, type: isDirectionUp ? "incrementTime" : "decrementTime" });
    }, [dispatch, isDirectionUp, unit]);

    // set tabIndex=-1 to ensure a valid FocusEvent relatedTarget when focused
    return (
        <span
            aria-controls={timeInputIds[unit]}
            aria-label={`${isDirectionUp ? "Increase" : "Decrease"} ${getTimeUnitPrintStr(unit)}`}
            className={classNames(Classes.TIMEPICKER_ARROW_BUTTON, getTimeUnitClassName(unit))}
            onClick={onClick}
            tabIndex={-1}
        >
            <Icon icon={isDirectionUp ? "chevron-up" : "chevron-down"} title={label} />
        </span>
    );
};

interface TimePickerDividerProps {
    text?: React.ReactNode;
}

const TimePickerDivider: React.FC<TimePickerDividerProps> = ({ text = ":" }) => {
    return <span className={Classes.TIMEPICKER_DIVIDER_TEXT}>{text}</span>;
};

interface TimePickerInputProps {
    autoFocus: boolean;
    className: string;
    disabled: boolean;
    onChange?: (newValue: string) => void;
    showArrowButtons: boolean;
    unit: TimeUnit;
    value: string;
}

const TimePickerInput: React.FC<TimePickerInputProps> = props => {
    const { autoFocus, className, disabled, onChange, showArrowButtons, unit, value } = props;
    const valueNumber = parseInt(value, 10);
    const isValid = isTimeUnitValid(unit, valueNumber);
    const isHour = unit === TimeUnit.HOUR_12 || unit === TimeUnit.HOUR_24;

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(event.target.value);
        },
        [onChange],
    );

    return (
        <input
            aria-label={getTimeUnitPrintStr(unit)}
            autoFocus={isHour && autoFocus}
            className={classNames(
                Classes.TIMEPICKER_INPUT,
                { [CoreClasses.intentClass(Intent.DANGER)]: !isValid },
                className,
            )}
            disabled={disabled}
            id={timeInputIds[unit]}
            min={0}
            max={getTimeUnitMax(unit)}
            onChange={handleChange}
            role={showArrowButtons ? "spinbutton" : undefined}
            type="number"
            value={value}
        />
    );
};

interface TimePickerAmPmProps {
    disabled: boolean;
    onChange?: (isPm: boolean) => void;
    value: boolean;
}

const TimePickerAmPm: React.FC<TimePickerAmPmProps> = ({ disabled, onChange, value }) => {
    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            onChange?.(event.currentTarget.value === "pm");
        },
        [onChange],
    );
    return (
        <HTMLSelect
            className={Classes.TIMEPICKER_AMPM_SELECT}
            disabled={disabled}
            onChange={handleChange}
            value={value ? "pm" : "am"}
        >
            <option value="am">AM</option>
            <option value="pm">PM</option>
        </HTMLSelect>
    );
};

function formatTime(time: number, unit: TimeUnit) {
    switch (unit) {
        case TimeUnit.HOUR_24:
            return time.toString();
        case TimeUnit.HOUR_12:
            return DateUtils.get12HourFrom24Hour(time).toString();
        case TimeUnit.MINUTE:
        case TimeUnit.SECOND:
            return Utils.padWithZeroes(time.toString(), 2);
        case TimeUnit.MS:
            return Utils.padWithZeroes(time.toString(), 3);
        default:
            throw Error("Invalid TimeUnit");
    }
}

function getStringValueFromInputEvent(event: React.SyntheticEvent<HTMLInputElement>) {
    return (event.target as HTMLInputElement).value;
}

interface KeyEventMap {
    [key: string]: () => void;
}

function handleKeyEvent(event: React.KeyboardEvent<HTMLInputElement>, actions: KeyEventMap, preventDefault = true) {
    for (const key of Object.keys(actions)) {
        if (event.key === key) {
            if (preventDefault) {
                event.preventDefault();
            }
            actions[key]();
        }
    }
}
