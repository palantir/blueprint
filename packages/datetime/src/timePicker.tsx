/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps, Keys, Utils as BlueprintUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import * as Utils from "./common/utils";

export enum TimePickerPrecision {
    MINUTE,
    SECOND,
    MILLISECOND,
}

export interface ITimePickerProps extends IProps {
   /**
    * Initial time the `TimePicker` will display.
    * This should not be set if `value` is set.
    */
    defaultValue?: Date;

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
    * Whether to show arrows buttons for changing the time.
    * @default false
    */
    showArrowButtons?: Boolean;

   /**
    * The currently set time.
    * If this prop is present, the component acts in a controlled manner.
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
        precision: TimePickerPrecision.MINUTE,
        showArrowButtons: false,
    };

    public displayName = "Blueprint.TimePicker";

    public constructor(props?: ITimePickerProps, context?: any) {
        super(props, context);

        if (props.value != null) {
            this.state = this.getFullStateFromValue(props.value);
        } else if (props.defaultValue != null) {
            this.state = this.getFullStateFromValue(props.defaultValue);
        } else {
            this.state = this.getFullStateFromValue(new Date(0, 0, 0, 0, 0, 0, 0));
        }
    }

    public render() {
        const shouldRenderSeconds = this.props.precision >= TimePickerPrecision.SECOND;
        const shouldRenderMilliseconds = this.props.precision >= TimePickerPrecision.MILLISECOND;

        /* tslint:disable:max-line-length */
        return (
            <div className={classNames(Classes.TIMEPICKER, this.props.className)}>
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    {this.maybeRenderArrowButton(true, Classes.TIMEPICKER_HOUR, () => this.incrementTime(TimeUnit.HOUR))}
                    {this.maybeRenderArrowButton(true, Classes.TIMEPICKER_MINUTE, () => this.incrementTime(TimeUnit.MINUTE))}
                    {shouldRenderSeconds ? this.maybeRenderArrowButton(true, Classes.TIMEPICKER_SECOND, () => this.incrementTime(TimeUnit.SECOND)) : null}
                    {shouldRenderMilliseconds ? this.maybeRenderArrowButton(true, Classes.TIMEPICKER_MILLISECOND, () => this.incrementTime(TimeUnit.MS)) : null}
                </div>
                <div className={Classes.TIMEPICKER_INPUT_ROW}>
                    {this.renderInput(Classes.TIMEPICKER_HOUR, TimeUnit.HOUR, this.state.hourText)}
                    {this.renderDivider()}
                    {this.renderInput(Classes.TIMEPICKER_MINUTE, TimeUnit.MINUTE, this.state.minuteText)}
                    {shouldRenderSeconds ? this.renderDivider() : null}
                    {shouldRenderSeconds ? this.renderInput(Classes.TIMEPICKER_SECOND, TimeUnit.SECOND, this.state.secondText) : null}
                    {shouldRenderMilliseconds ? this.renderDivider(".") : null}
                    {shouldRenderMilliseconds ? this.renderInput(Classes.TIMEPICKER_MILLISECOND, TimeUnit.MS, this.state.millisecondText) : null}
                </div>
                <div className={Classes.TIMEPICKER_ARROW_ROW}>
                    {this.maybeRenderArrowButton(false, Classes.TIMEPICKER_HOUR, () => this.decrementTime(TimeUnit.HOUR))}
                    {this.maybeRenderArrowButton(false, Classes.TIMEPICKER_MINUTE, () => this.decrementTime(TimeUnit.MINUTE))}
                    {shouldRenderSeconds ? this.maybeRenderArrowButton(false, Classes.TIMEPICKER_SECOND, () => this.decrementTime(TimeUnit.SECOND)) : null}
                    {shouldRenderMilliseconds ? this.maybeRenderArrowButton(false, Classes.TIMEPICKER_MILLISECOND, () => this.decrementTime(TimeUnit.MS)) : null}
                </div>
            </div>
        );
        /* tslint:enable:max-line-length */
    }

    public componentWillReceiveProps(nextProps: ITimePickerProps) {
        if (nextProps.value != null && !DateUtils.areSameTime(nextProps.value, this.props.value)) {
            this.setState(this.getFullStateFromValue(nextProps.value));
        }
    }

    // begin method definitions: rendering

    private maybeRenderArrowButton(
        isDirectionUp: boolean,
        className: string,
        onClick: React.MouseEventHandler<HTMLSpanElement>,
    ) {
        const classes = classNames(Classes.TIMEPICKER_ARROW_BUTTON, className, "pt-icon-standard", {
            "pt-icon-chevron-down": !isDirectionUp,
            "pt-icon-chevron-up": isDirectionUp,
        });
        return this.props.showArrowButtons ? <span className={classes} onClick={onClick}/> : null;
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
                onKeyDown={this.getInputKeyDownHandler(unit)}
                value={value}
            />
        );
    }

    // begin method definitions: event handlers

    private getInputBlurHandler = (unit: TimeUnit) => (e: React.SyntheticEvent<HTMLInputElement>) => {
        const text = getStringValueFromInputEvent(e);
        this.updateTime(parseInt(text, 10), unit);
    }

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
                case TimeUnit.HOUR: this.updateState({ hourText: text }); break;
                case TimeUnit.MINUTE: this.updateState({ minuteText: text }); break;
                case TimeUnit.SECOND: this.updateState({ secondText: text }); break;
                case TimeUnit.MS: this.updateState({ millisecondText: text }); break;
                default: throw Error("Invalid TimeUnit");
            }
        }
    }

    private getInputKeyDownHandler = (unit: TimeUnit) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        handleKeyEvent(e, {
            [Keys.ARROW_UP]: () => this.incrementTime(unit),
            [Keys.ARROW_DOWN]: () => this.decrementTime(unit),
            [Keys.ENTER]: () => {
                (e.currentTarget as HTMLInputElement).blur();
            },
        });
    }

    // begin method definitions: state modification

   /**
    * Generates a full ITimePickerState object with all text fields set to formatted strings based on value
    */
    private getFullStateFromValue(value: Date): ITimePickerState {
        /* tslint:disable:object-literal-sort-keys */
        return {
            hourText: formatTime(value.getHours(), TimeUnit.HOUR),
            minuteText: formatTime(value.getMinutes(), TimeUnit.MINUTE),
            secondText: formatTime(value.getSeconds(), TimeUnit.SECOND),
            millisecondText: formatTime(value.getMilliseconds(), TimeUnit.MS),
            value,
        };
        /* tslint:enable:object-literal-sort-keys */
    }

    private incrementTime(unit: TimeUnit) {
        const newTime = getTimeUnit(this.state.value, unit) + 1;
        this.updateTime(loopTime(newTime, unit), unit);
    }

    private decrementTime(unit: TimeUnit) {
        const newTime = getTimeUnit(this.state.value, unit) - 1;
        this.updateTime(loopTime(newTime, unit), unit);
    }

    private updateTime(time: number, unit: TimeUnit) {
        if (isTimeValid(time, unit)) {
            const newValue = DateUtils.clone(this.state.value);
            setTimeUnit(time, newValue, unit);
            this.updateState({ value: newValue });
        } else {
            // reset to last known good state
            this.updateState(this.getFullStateFromValue(this.state.value));
        }
    }

    private updateState(state: ITimePickerState) {
        let newState = state;
        const hasNewValue = newState.value != null
            && !DateUtils.areSameTime(newState.value, this.state.value);

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
                const clonedNewState = BlueprintUtils.shallowClone(newState);
                clonedNewState.value = DateUtils.clone(this.state.value);
                this.setState(clonedNewState);
            }
        }

        if (hasNewValue) {
            BlueprintUtils.safeInvoke(this.props.onChange, newState.value);
        }
    }
}

enum TimeUnit {
    HOUR,
    MINUTE,
    SECOND,
    MS,
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

function getTimeUnit(date: Date, unit: TimeUnit) {
    switch (unit) {
        case TimeUnit.HOUR: return date.getHours();
        case TimeUnit.MINUTE: return date.getMinutes();
        case TimeUnit.SECOND: return date.getSeconds();
        case TimeUnit.MS: return date.getMilliseconds();
        default: throw Error("Invalid TimeUnit");
    }
}

interface IKeyEventMap { [key: number]: () => void; }

function handleKeyEvent(e: React.KeyboardEvent<HTMLInputElement>, actions: IKeyEventMap, preventDefault = true) {
    for (let k of Object.keys(actions)) {
        const key = Number(k);
        if (e.which === key) {
            if (preventDefault) {
                e.preventDefault();
            }
            actions[key]();
        }
    }
}

function isTimeValid(time: number, unit: TimeUnit) {
    return time != null && !isNaN(time) && minTime(unit) <= time && time <= maxTime(unit);
}

function loopTime(time: number, unit: TimeUnit) {
    const max = maxTime(unit);
    const min = minTime(unit);

    if (time > max) {
        return min;
    } else if (time < min) {
        return max;
    }
    return time;
}

function minTime(unit: TimeUnit) {
    const min: { [unit: number]: number } = {
        [TimeUnit.HOUR]: 0,
        [TimeUnit.MINUTE]: 0,
        [TimeUnit.SECOND]: 0,
        [TimeUnit.MS]: 0,
    };
    return min[unit];
}

function maxTime(unit: TimeUnit) {
    const max: { [unit: number]: number } = {
        [TimeUnit.HOUR]: 23,
        [TimeUnit.MINUTE]: 59,
        [TimeUnit.SECOND]: 59,
        [TimeUnit.MS]: 999,
    };
    return max[unit];
}

function setTimeUnit(time: number, date: Date, unit: TimeUnit) {
    switch (unit) {
        case TimeUnit.HOUR: date.setHours(time); break;
        case TimeUnit.MINUTE: date.setMinutes(time); break;
        case TimeUnit.SECOND: date.setSeconds(time); break;
        case TimeUnit.MS: date.setMilliseconds(time); break;
        default: throw Error("Invalid TimeUnit");
    }
}

export let TimePickerFactory = React.createFactory(TimePicker);
