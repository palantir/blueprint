/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

export interface TimePickerState {
    hourText?: string;
    minuteText?: string;
    secondText?: string;
    millisecondText?: string;
    value?: Date;
    isPm?: boolean;
}

/**
 * Time picker component.
 *
 * @see https://blueprintjs.com/docs/#datetime/timepicker
 */
export class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
    public static defaultProps: TimePickerProps = {
        autoFocus: false,
        disabled: false,
        maxTime: getDefaultMaxTime(),
        minTime: getDefaultMinTime(),
        precision: TimePrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
        useAmPm: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.TimePicker`;

    public constructor(props?: TimePickerProps) {
        super(props);

        this.state = this.getFullStateFromValue(this.getInitialValue(), props.useAmPm);
    }

    private timeInputIds: { [key in TimeUnit]: string } = {
        [TimeUnit.HOUR_24]: CoreUtils.uniqueId(TimeUnit.HOUR_24 + "-input"),
        [TimeUnit.HOUR_12]: CoreUtils.uniqueId(TimeUnit.HOUR_12 + "-input"),
        [TimeUnit.MINUTE]: CoreUtils.uniqueId(TimeUnit.MINUTE + "-input"),
        [TimeUnit.SECOND]: CoreUtils.uniqueId(TimeUnit.SECOND + "-input"),
        [TimeUnit.MS]: CoreUtils.uniqueId(TimeUnit.MS + "-input"),
    };

    public render() {
        const shouldRenderMilliseconds = this.props.precision === TimePrecision.MILLISECOND;
        const shouldRenderSeconds = shouldRenderMilliseconds || this.props.precision === TimePrecision.SECOND;
        const hourUnit = this.props.useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
        const classes = classNames(Classes.TIMEPICKER, this.props.className, {
            [CoreClasses.DISABLED]: this.props.disabled,
        });

        return (
            <div className={classes}>
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    {this.maybeRenderArrowButton(true, hourUnit)}
                    {this.maybeRenderArrowButton(true, TimeUnit.MINUTE)}
                    {shouldRenderSeconds && this.maybeRenderArrowButton(true, TimeUnit.SECOND)}
                    {shouldRenderMilliseconds && this.maybeRenderArrowButton(true, TimeUnit.MS)}
                </div>
                <div className={Classes.TIMEPICKER_INPUT_ROW}>
                    {this.renderInput(Classes.TIMEPICKER_HOUR, hourUnit, this.state.hourText)}
                    {this.renderDivider()}
                    {this.renderInput(Classes.TIMEPICKER_MINUTE, TimeUnit.MINUTE, this.state.minuteText)}
                    {shouldRenderSeconds && this.renderDivider()}
                    {shouldRenderSeconds &&
                        this.renderInput(Classes.TIMEPICKER_SECOND, TimeUnit.SECOND, this.state.secondText)}
                    {shouldRenderMilliseconds && this.renderDivider(".")}
                    {shouldRenderMilliseconds &&
                        this.renderInput(Classes.TIMEPICKER_MILLISECOND, TimeUnit.MS, this.state.millisecondText)}
                </div>
                {this.maybeRenderAmPm()}
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    {this.maybeRenderArrowButton(false, hourUnit)}
                    {this.maybeRenderArrowButton(false, TimeUnit.MINUTE)}
                    {shouldRenderSeconds && this.maybeRenderArrowButton(false, TimeUnit.SECOND)}
                    {shouldRenderMilliseconds && this.maybeRenderArrowButton(false, TimeUnit.MS)}
                </div>
            </div>
        );
    }

    public componentDidUpdate(prevProps: TimePickerProps) {
        const didMinTimeChange = prevProps.minTime !== this.props.minTime;
        const didMaxTimeChange = prevProps.maxTime !== this.props.maxTime;
        const didBoundsChange = didMinTimeChange || didMaxTimeChange;
        const didPropValueChange = prevProps.value !== this.props.value;
        const shouldStateUpdate = didBoundsChange || didPropValueChange;

        let value = this.state.value;
        if (this.props.value == null) {
            value = this.getInitialValue();
        }
        if (didBoundsChange) {
            value = DateUtils.getTimeInRange(this.state.value, this.props.minTime, this.props.maxTime);
        }
        if (this.props.value != null && !DateUtils.isSameTime(this.props.value, prevProps.value)) {
            value = this.props.value;
        }

        if (shouldStateUpdate) {
            this.setState(this.getFullStateFromValue(value, this.props.useAmPm));
        }
    }

    // begin method definitions: rendering

    private maybeRenderArrowButton(isDirectionUp: boolean, timeUnit: TimeUnit) {
        if (!this.props.showArrowButtons) {
            return null;
        }
        const classes = classNames(Classes.TIMEPICKER_ARROW_BUTTON, getTimeUnitClassName(timeUnit));
        const onClick = () => (isDirectionUp ? this.incrementTime : this.decrementTime)(timeUnit);
        const label = `${isDirectionUp ? "Increase" : "Decrease"} ${getTimeUnitPrintStr(timeUnit)}`;

        // set tabIndex=-1 to ensure a valid FocusEvent relatedTarget when focused
        return (
            <span
                aria-controls={this.timeInputIds[timeUnit]}
                aria-label={label}
                tabIndex={-1}
                className={classes}
                onClick={onClick}
            >
                <Icon icon={isDirectionUp ? "chevron-up" : "chevron-down"} title={label} />
            </span>
        );
    }

    private renderDivider(text = ":") {
        return <span className={Classes.TIMEPICKER_DIVIDER_TEXT}>{text}</span>;
    }

    private renderInput(className: string, unit: TimeUnit, value: string) {
        const valueNumber = parseInt(value, 10);
        const isValid = isTimeUnitValid(unit, valueNumber);
        const isHour = unit === TimeUnit.HOUR_12 || unit === TimeUnit.HOUR_24;

        return (
            <input
                aria-label={getTimeUnitPrintStr(unit)}
                className={classNames(
                    Classes.TIMEPICKER_INPUT,
                    { [CoreClasses.intentClass(Intent.DANGER)]: !isValid },
                    className,
                )}
                id={this.timeInputIds[unit]}
                min={0}
                max={getTimeUnitMax(unit)}
                onBlur={this.getInputBlurHandler(unit)}
                onChange={this.getInputChangeHandler(unit)}
                onFocus={this.getInputFocusHandler(unit)}
                onKeyDown={this.getInputKeyDownHandler(unit)}
                onKeyUp={this.getInputKeyUpHandler(unit)}
                role={this.props.showArrowButtons ? "spinbutton" : undefined}
                type="number"
                value={value}
                disabled={this.props.disabled}
                autoFocus={isHour && this.props.autoFocus}
            />
        );
    }

    private maybeRenderAmPm() {
        if (!this.props.useAmPm) {
            return null;
        }
        return (
            <HTMLSelect
                className={Classes.TIMEPICKER_AMPM_SELECT}
                disabled={this.props.disabled}
                onChange={this.handleAmPmChange}
                value={this.state.isPm ? "pm" : "am"}
            >
                <option value="am">AM</option>
                <option value="pm">PM</option>
            </HTMLSelect>
        );
    }

    // begin method definitions: event handlers

    private getInputChangeHandler = (unit: TimeUnit) => (e: React.SyntheticEvent<HTMLInputElement>) => {
        const text = getStringValueFromInputEvent(e);
        switch (unit) {
            case TimeUnit.HOUR_12:
            case TimeUnit.HOUR_24:
                this.setState({ hourText: text });
                break;
            case TimeUnit.MINUTE:
                this.setState({ minuteText: text });
                break;
            case TimeUnit.SECOND:
                this.setState({ secondText: text });
                break;
            case TimeUnit.MS:
                this.setState({ millisecondText: text });
                break;
        }
    };

    private getInputBlurHandler = (unit: TimeUnit) => (e: React.FocusEvent<HTMLInputElement>) => {
        const text = getStringValueFromInputEvent(e);
        this.updateTime(parseInt(text, 10), unit);
        this.props.onBlur?.(e, unit);
    };

    private getInputFocusHandler = (unit: TimeUnit) => (e: React.FocusEvent<HTMLInputElement>) => {
        if (this.props.selectAllOnFocus) {
            e.currentTarget.select();
        }
        this.props.onFocus?.(e, unit);
    };

    private getInputKeyDownHandler = (unit: TimeUnit) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        handleKeyEvent(e, {
            ArrowDown: () => this.decrementTime(unit),
            ArrowUp: () => this.incrementTime(unit),
            Enter: () => {
                e.currentTarget.blur();
            },
        });
        this.props.onKeyDown?.(e, unit);
    };

    private getInputKeyUpHandler = (unit: TimeUnit) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.props.onKeyUp?.(e, unit);
    };

    private handleAmPmChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const isNextPm = e.currentTarget.value === "pm";
        if (isNextPm !== this.state.isPm) {
            const hour = DateUtils.convert24HourMeridiem(this.state.value.getHours(), isNextPm);
            this.setState({ isPm: isNextPm }, () => this.updateTime(hour, TimeUnit.HOUR_24));
        }
    };

    // begin method definitions: state modification

    /**
     * Generates a full TimePickerState object with all text fields set to formatted strings based on value
     */
    private getFullStateFromValue(value: Date, useAmPm: boolean): TimePickerState {
        const timeInRange = DateUtils.getTimeInRange(value, this.props.minTime, this.props.maxTime);
        const hourUnit = useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
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
    }

    private incrementTime = (unit: TimeUnit) => this.shiftTime(unit, 1);

    private decrementTime = (unit: TimeUnit) => this.shiftTime(unit, -1);

    private shiftTime(unit: TimeUnit, amount: number) {
        if (this.props.disabled) {
            return;
        }
        const newTime = getTimeUnit(unit, this.state.value) + amount;
        this.updateTime(wrapTimeAtUnit(unit, newTime), unit);
    }

    private updateTime(time: number, unit: TimeUnit) {
        const newValue = DateUtils.clone(this.state.value);

        if (isTimeUnitValid(unit, time)) {
            setTimeUnit(unit, time, newValue, this.state.isPm);
            if (DateUtils.isTimeInRange(newValue, this.props.minTime, this.props.maxTime)) {
                this.updateState({ value: newValue });
            } else {
                this.updateState(this.getFullStateFromValue(this.state.value, this.props.useAmPm));
            }
        } else {
            this.updateState(this.getFullStateFromValue(this.state.value, this.props.useAmPm));
        }
    }

    private updateState(state: TimePickerState) {
        let newState = state;
        const hasNewValue = newState.value != null && !DateUtils.isSameTime(newState.value, this.state.value);

        if (this.props.value == null) {
            // component is uncontrolled
            if (hasNewValue) {
                newState = this.getFullStateFromValue(newState.value, this.props.useAmPm);
            }
            this.setState(newState);
        } else {
            // component is controlled, and there's a new value
            // so set inputs' text based off of _old_ value and later fire onChange with new value
            if (hasNewValue) {
                this.setState(this.getFullStateFromValue(this.state.value, this.props.useAmPm));
            } else {
                // no new value, this means only text has changed (from user typing)
                // we want inputs to change, so update state with new text for the inputs
                // but don't change actual value
                this.setState({ ...newState, value: DateUtils.clone(this.state.value) });
            }
        }

        if (hasNewValue) {
            this.props.onChange?.(newState.value);
        }
    }

    private getInitialValue(): Date {
        let value = this.props.minTime;
        if (this.props.value != null) {
            value = this.props.value;
        } else if (this.props.defaultValue != null) {
            value = this.props.defaultValue;
        }

        return value;
    }
}

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

function getStringValueFromInputEvent(e: React.SyntheticEvent<HTMLInputElement>) {
    return (e.target as HTMLInputElement).value;
}

interface KeyEventMap {
    [key: string]: () => void;
}

function handleKeyEvent(e: React.KeyboardEvent<HTMLInputElement>, actions: KeyEventMap, preventDefault = true) {
    for (const key of Object.keys(actions)) {
        if (e.key === key) {
            if (preventDefault) {
                e.preventDefault();
            }
            actions[key]();
        }
    }
}
