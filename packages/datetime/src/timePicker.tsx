/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes as CoreClasses, Icon, IProps, Keys, Utils as BlueprintUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
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

export enum TimePickerPrecision {
    MINUTE = 0,
    SECOND = 1,
    MILLISECOND = 2,
}

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
     * @default TimePickerPrecision.MINUTE
     */
    precision?: TimePickerPrecision;

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
}

export class TimePicker extends React.Component<ITimePickerProps, ITimePickerState> {
    public static defaultProps: ITimePickerProps = {
        disabled: false,
        maxTime: getDefaultMaxTime(),
        minTime: getDefaultMinTime(),
        precision: TimePickerPrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
    };

    public static displayName = "Blueprint2.TimePicker";

    public constructor(props?: ITimePickerProps, context?: any) {
        super(props, context);

        if (props.value != null) {
            this.state = this.getFullStateFromValue(props.value);
        } else if (props.defaultValue != null) {
            this.state = this.getFullStateFromValue(props.defaultValue);
        } else {
            this.state = this.getFullStateFromValue(props.minTime);
        }
    }

    public render() {
        const shouldRenderSeconds = this.props.precision >= TimePickerPrecision.SECOND;
        const shouldRenderMilliseconds = this.props.precision >= TimePickerPrecision.MILLISECOND;
        const classes = classNames(Classes.TIMEPICKER, this.props.className, {
            [CoreClasses.DISABLED]: this.props.disabled,
        });

        /* tslint:disable:max-line-length */
        return (
            <div className={classes}>
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    {this.maybeRenderArrowButton(true, TimeUnit.HOUR)}
                    {this.maybeRenderArrowButton(true, TimeUnit.MINUTE)}
                    {shouldRenderSeconds && this.maybeRenderArrowButton(true, TimeUnit.SECOND)}
                    {shouldRenderMilliseconds && this.maybeRenderArrowButton(true, TimeUnit.MS)}
                </div>
                <div className={Classes.TIMEPICKER_INPUT_ROW}>
                    {this.renderInput(Classes.TIMEPICKER_HOUR, TimeUnit.HOUR, this.state.hourText)}
                    {this.renderDivider()}
                    {this.renderInput(Classes.TIMEPICKER_MINUTE, TimeUnit.MINUTE, this.state.minuteText)}
                    {shouldRenderSeconds && this.renderDivider()}
                    {shouldRenderSeconds &&
                        this.renderInput(Classes.TIMEPICKER_SECOND, TimeUnit.SECOND, this.state.secondText)}
                    {shouldRenderMilliseconds && this.renderDivider(".")}
                    {shouldRenderMilliseconds &&
                        this.renderInput(Classes.TIMEPICKER_MILLISECOND, TimeUnit.MS, this.state.millisecondText)}
                </div>
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    {this.maybeRenderArrowButton(false, TimeUnit.HOUR)}
                    {this.maybeRenderArrowButton(false, TimeUnit.MINUTE)}
                    {shouldRenderSeconds && this.maybeRenderArrowButton(false, TimeUnit.SECOND)}
                    {shouldRenderMilliseconds && this.maybeRenderArrowButton(false, TimeUnit.MS)}
                </div>
            </div>
        );
        /* tslint:enable:max-line-length */
    }

    public componentWillReceiveProps(nextProps: ITimePickerProps) {
        const didMinTimeChange = nextProps.minTime !== this.props.minTime;
        const didMaxTimeChange = nextProps.maxTime !== this.props.maxTime;
        const didBoundsChange = didMinTimeChange || didMaxTimeChange;

        if (didBoundsChange) {
            const timeInRange = DateUtils.getTimeInRange(this.state.value, nextProps.minTime, nextProps.maxTime);
            this.setState(this.getFullStateFromValue(timeInRange));
        }

        if (nextProps.value != null && !DateUtils.areSameTime(nextProps.value, this.props.value)) {
            this.setState(this.getFullStateFromValue(nextProps.value));
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
        return (
            <input
                className={classNames(Classes.TIMEPICKER_INPUT, className)}
                onBlur={this.getInputBlurHandler(unit)}
                onChange={this.getInputChangeHandler(unit)}
                onFocus={this.handleFocus}
                onKeyDown={this.getInputKeyDownHandler(unit)}
                value={value}
                disabled={this.props.disabled}
            />
        );
    }

    // begin method definitions: event handlers

    private getInputBlurHandler = (unit: TimeUnit) => (e: React.SyntheticEvent<HTMLInputElement>) => {
        const text = getStringValueFromInputEvent(e);
        this.updateTime(parseInt(text, 10), unit);
    };

    private getInputChangeHandler = (unit: TimeUnit) => (e: React.SyntheticEvent<HTMLInputElement>) => {
        const TWO_DIGITS = /^\d{0,2}$/;
        const THREE_DIGITS = /^\d{0,3}$/;
        const text = getStringValueFromInputEvent(e);

        let isValid = false;
        switch (unit) {
            case TimeUnit.HOUR:
            case TimeUnit.MINUTE:
            case TimeUnit.SECOND:
                isValid = TWO_DIGITS.test(text);
                break;
            case TimeUnit.MS:
                isValid = THREE_DIGITS.test(text);
                break;
            default:
                throw Error("Invalid TimeUnit");
        }

        if (isValid) {
            switch (unit) {
                case TimeUnit.HOUR:
                    this.updateState({ hourText: text });
                    break;
                case TimeUnit.MINUTE:
                    this.updateState({ minuteText: text });
                    break;
                case TimeUnit.SECOND:
                    this.updateState({ secondText: text });
                    break;
                case TimeUnit.MS:
                    this.updateState({ millisecondText: text });
                    break;
                default:
                    throw Error("Invalid TimeUnit");
            }
        }
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

    // begin method definitions: state modification

    /**
     * Generates a full ITimePickerState object with all text fields set to formatted strings based on value
     */
    private getFullStateFromValue(value: Date): ITimePickerState {
        const timeInRange = DateUtils.getTimeInRange(value, this.props.minTime, this.props.maxTime);
        /* tslint:disable:object-literal-sort-keys */
        return {
            hourText: formatTime(timeInRange.getHours(), TimeUnit.HOUR),
            minuteText: formatTime(timeInRange.getMinutes(), TimeUnit.MINUTE),
            secondText: formatTime(timeInRange.getSeconds(), TimeUnit.SECOND),
            millisecondText: formatTime(timeInRange.getMilliseconds(), TimeUnit.MS),
            value: timeInRange,
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
            setTimeUnit(unit, time, newValue);
            if (DateUtils.isTimeInRange(newValue, this.props.minTime, this.props.maxTime)) {
                this.updateState({ value: newValue });
            } else if (!DateUtils.areSameTime(this.state.value, this.props.minTime)) {
                this.updateState(this.getFullStateFromValue(newValue));
            }
        } else {
            // reset to last known good state
            this.updateState(this.getFullStateFromValue(this.state.value));
        }
    }

    private updateState(state: ITimePickerState) {
        let newState = state;
        const hasNewValue = newState.value != null && !DateUtils.areSameTime(newState.value, this.state.value);

        if (this.props.value == null) {
            // component is uncontrolled
            if (hasNewValue) {
                newState = this.getFullStateFromValue(newState.value);
            }
            this.setState(newState);
        } else {
            // component is controlled, and there's a new value
            // so set inputs' text based off of _old_ value and later fire onChange with new value
            if (hasNewValue) {
                this.setState(this.getFullStateFromValue(this.state.value));
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
        case TimeUnit.HOUR:
            return time.toString();
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
    return (e.currentTarget as HTMLInputElement).value;
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
