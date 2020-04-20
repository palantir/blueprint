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

import {
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    HTMLSelect,
    Icon,
    Intent,
    IProps,
    Keys,
    Utils as BlueprintUtils,
} from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import * as Classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import {
    getDefaultMaxTime,
    getDefaultMinTime,
    getTimeUnit,
    getTimeUnitClassName,
    isTimeUnitValid,
    setTimeUnit,
    TimeUnit,
    wrapTimeAtUnit,
} from "./common/timeUnit";
import * as Utils from "./common/utils";

export const TimePrecision = {
    MILLISECOND: "millisecond" as "millisecond",
    MINUTE: "minute" as "minute",
    SECOND: "second" as "second",
};
export type TimePrecision = typeof TimePrecision[keyof typeof TimePrecision];

export interface ITimePickerProps extends IProps {
    /**
     * Initial time the `TimePicker` will display.
     * This should not be set if `value` is set.
     */
    defaultValue?: Date;

    /**
     * Whether the time picker is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /**
     * Callback invoked when the user changes the time.
     */
    onChange?: (newTime: Date) => void;

    /**
     * The precision of time the user can set.
     * @default TimePrecision.MINUTE
     */
    precision?: TimePrecision;

    /**
     * Whether all the text in each input should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;

    /**
     * Whether to show arrows buttons for changing the time.
     * @default false
     */
    showArrowButtons?: boolean;

    /**
     * Whether to use a 12 hour format with an AM/PM dropdown.
     * @default false
     */
    useAmPm?: boolean;

    /**
     * The latest time the user can select. The year, month, and day parts of the `Date` object are ignored.
     * While the `maxTime` will be later than the `minTime` in the basic case,
     * it is also allowed to be earlier than the `minTime`.
     * This is useful, for example, to express a time range that extends before and after midnight.
     * If the `maxTime` and `minTime` are equal, then the valid time range is constrained to only that one value.
     */
    maxTime?: Date;

    /**
     * The earliest time the user can select. The year, month, and day parts of the `Date` object are ignored.
     * While the `minTime` will be earlier than the `maxTime` in the basic case,
     * it is also allowed to be later than the `maxTime`.
     * This is useful, for example, to express a time range that extends before and after midnight.
     * If the `maxTime` and `minTime` are equal, then the valid time range is constrained to only that one value.
     */
    minTime?: Date;

    /**
     * The currently set time.
     * If this prop is provided, the component acts in a controlled manner.
     */
    value?: Date;
}

export interface ITimePickerState {
    hourText?: string;
    minuteText?: string;
    secondText?: string;
    millisecondText?: string;
    value?: Date;
    isPm?: boolean;
}

export class TimePicker extends React.Component<ITimePickerProps, ITimePickerState> {
    public static defaultProps: ITimePickerProps = {
        disabled: false,
        maxTime: getDefaultMaxTime(),
        minTime: getDefaultMinTime(),
        precision: TimePrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
        useAmPm: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.TimePicker`;

    public constructor(props?: ITimePickerProps, context?: any) {
        super(props, context);

        let value = props.minTime;
        if (props.value != null) {
            value = props.value;
        } else if (props.defaultValue != null) {
            value = props.defaultValue;
        }

        this.state = this.getFullStateFromValue(value, props.useAmPm);
    }

    public render() {
        const shouldRenderMilliseconds = this.props.precision === TimePrecision.MILLISECOND;
        const shouldRenderSeconds = shouldRenderMilliseconds || this.props.precision === TimePrecision.SECOND;
        const hourUnit = this.props.useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
        const classes = classNames(Classes.TIMEPICKER, this.props.className, {
            [CoreClasses.DISABLED]: this.props.disabled,
        });

        /* tslint:disable:max-line-length */
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
        /* tslint:enable:max-line-length */
    }

    public componentDidUpdate(prevProps: ITimePickerProps) {
        const didMinTimeChange = prevProps.minTime !== this.props.minTime;
        const didMaxTimeChange = prevProps.maxTime !== this.props.maxTime;
        const didBoundsChange = didMinTimeChange || didMaxTimeChange;
        const didPropValueChange = prevProps.value !== this.props.value;
        const shouldStateUpdate = didMinTimeChange || didMaxTimeChange || didBoundsChange || didPropValueChange;

        let value = this.state.value;
        if (didBoundsChange) {
            value = DateUtils.getTimeInRange(this.state.value, this.props.minTime, this.props.maxTime);
        }
        if (this.props.value != null && !DateUtils.areSameTime(this.props.value, prevProps.value)) {
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
        return (
            <span className={classes} onClick={onClick}>
                <Icon icon={isDirectionUp ? "chevron-up" : "chevron-down"} />
            </span>
        );
    }

    private renderDivider(text = ":") {
        return <span className={Classes.TIMEPICKER_DIVIDER_TEXT}>{text}</span>;
    }

    private renderInput(className: string, unit: TimeUnit, value: string) {
        const isValid = isTimeUnitValid(unit, parseInt(value, 10));

        return (
            <input
                className={classNames(
                    Classes.TIMEPICKER_INPUT,
                    { [CoreClasses.intentClass(Intent.DANGER)]: !isValid },
                    className,
                )}
                onBlur={this.getInputBlurHandler(unit)}
                onChange={this.getInputChangeHandler(unit)}
                onFocus={this.handleFocus}
                onKeyDown={this.getInputKeyDownHandler(unit)}
                value={value}
                disabled={this.props.disabled}
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

    private getInputBlurHandler = (unit: TimeUnit) => (e: React.SyntheticEvent<HTMLInputElement>) => {
        const text = getStringValueFromInputEvent(e);
        this.updateTime(parseInt(text, 10), unit);
    };

    private getInputKeyDownHandler = (unit: TimeUnit) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        handleKeyEvent(e, {
            [Keys.ARROW_UP]: () => this.incrementTime(unit),
            [Keys.ARROW_DOWN]: () => this.decrementTime(unit),
            [Keys.ENTER]: () => {
                (e.currentTarget as HTMLInputElement).blur();
            },
        });
    };

    private handleFocus = (e: React.SyntheticEvent<HTMLInputElement>) => {
        if (this.props.selectAllOnFocus) {
            e.currentTarget.select();
        }
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
     * Generates a full ITimePickerState object with all text fields set to formatted strings based on value
     */
    private getFullStateFromValue(value: Date, useAmPm: boolean): ITimePickerState {
        const timeInRange = DateUtils.getTimeInRange(value, this.props.minTime, this.props.maxTime);
        const hourUnit = useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
        /* tslint:disable:object-literal-sort-keys */
        return {
            hourText: formatTime(timeInRange.getHours(), hourUnit),
            minuteText: formatTime(timeInRange.getMinutes(), TimeUnit.MINUTE),
            secondText: formatTime(timeInRange.getSeconds(), TimeUnit.SECOND),
            millisecondText: formatTime(timeInRange.getMilliseconds(), TimeUnit.MS),
            value: timeInRange,
            isPm: DateUtils.getIsPmFrom24Hour(timeInRange.getHours()),
        };
        /* tslint:enable:object-literal-sort-keys */
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

    private updateState(state: ITimePickerState) {
        let newState = state;
        const hasNewValue = newState.value != null && !DateUtils.areSameTime(newState.value, this.state.value);

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
            BlueprintUtils.safeInvoke(this.props.onChange, newState.value);
        }
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

interface IKeyEventMap {
    [key: number]: () => void;
}

function handleKeyEvent(e: React.KeyboardEvent<HTMLInputElement>, actions: IKeyEventMap, preventDefault = true) {
    for (const k of Object.keys(actions)) {
        const key = Number(k);
        if (e.which === key) {
            if (preventDefault) {
                e.preventDefault();
            }
            actions[key]();
        }
    }
}
