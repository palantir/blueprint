/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractComponent, IProps, Utils } from "@blueprintjs/core";

import * as Classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import { DatePicker, IDatePickerProps } from "./datePicker";
import { ITimePickerProps, TimePicker } from "./timePicker";

export interface IDateTimePickerProps extends IProps {
    /**
     * The initial date and time value that will be set.
     * This will be ignored if `value` is set.
     * @default Date.now()
     */
    defaultValue?: Date;

    /**
     * Any props to be passed on to the `DatePicker` other than the `value` and `onChange` props as they come directly
     * from the `DateTimePicker` props.
     */
    datePickerProps?: IDatePickerProps;

    /**
     * Callback invoked when the user changes the date or time.
     */
    onChange?: (selectedDate: Date, isUserChange: boolean) => void;

    /**
     * Any props to be passed on to the `TimePicker` other than the `value` and `onChange` props as they come directly
     * from the `DateTimePicker` props.
     */
    timePickerProps?: ITimePickerProps;

    /**
     * The currently set date and time. If this prop is present, the component acts in a controlled manner.
     */
    value?: Date;
}

export interface IDateTimePickerState {
    value?: Date;
}

export class DateTimePicker extends AbstractComponent<IDateTimePickerProps, IDateTimePickerState> {
    public static defaultProps: IDateTimePickerProps = {
        defaultValue: new Date(),
    };

    public displayName = "Blueprint.DateTimePicker";

    public constructor(props?: IDateTimePickerProps, context?: any) {
        super(props, context);

        this.state = {
            value: (this.props.value != null) ? this.props.value : this.props.defaultValue,
        };
    }

    public render() {
        return (
            <div className={classNames(Classes.DATETIMEPICKER, this.props.className)}>
                <DatePicker
                    {...this.props.datePickerProps}
                    onChange={this.handleDateChange}
                    value={this.state.value}
                />
                <TimePicker
                    {...this.props.timePickerProps}
                    onChange={this.handleTimeChange}
                    value={this.state.value}
                />
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IDatePickerProps) {
        if (nextProps.value != null) {
            this.setState({ value: nextProps.value });
        }
    }

    public handleDateChange = (date: Date, isUserChange: boolean) => {
        const value = DateUtils.getDateTime(date, this.state.value);
        if (this.props.value === undefined) {
            this.setState({ value });
        }
        Utils.safeInvoke(this.props.onChange, value, isUserChange);
    }

    public handleTimeChange = (time: Date) => {
        const value = DateUtils.getDateTime(this.state.value, time);
        if (this.props.value === undefined) {
            this.setState({ value });
        }
        Utils.safeInvoke(this.props.onChange, value, true);
    }
}
