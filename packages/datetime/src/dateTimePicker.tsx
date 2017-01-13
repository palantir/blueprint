/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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

// Handle date and time separately because changing the date shouldn't reset the time.
export interface IDateTimePickerState {
    dateValue?: Date;
    timeValue?: Date;
}

export class DateTimePicker extends AbstractComponent<IDateTimePickerProps, IDateTimePickerState> {
    public static defaultProps: IDateTimePickerProps = {
        defaultValue: new Date(),
    };

    public displayName = "Blueprint.DateTimePicker";

    public constructor(props?: IDateTimePickerProps, context?: any) {
        super(props, context);

        const initialValue = (this.props.value != null) ? this.props.value : this.props.defaultValue;
        this.state = {
            dateValue: initialValue,
            timeValue: initialValue,
        };
    }

    public render() {
        const value = DateUtils.getDateTime(this.state.dateValue, this.state.timeValue);
        return (
            <div className={classNames(Classes.DATETIMEPICKER, this.props.className)}>
                <DatePicker
                    {...this.props.datePickerProps}
                    onChange={this.handleDateChange}
                    value={value}
                />
                <TimePicker
                    {...this.props.timePickerProps}
                    onChange={this.handleTimeChange}
                    value={value}
                />
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IDatePickerProps) {
        if (nextProps.value != null) {
            this.setState({
                dateValue: nextProps.value,
                timeValue: nextProps.value,
            });
        }
    }

    public handleDateChange = (dateValue: Date, isUserChange: boolean) => {
        if (this.props.value === undefined) {
            this.setState({ dateValue });
        }
        const value = DateUtils.getDateTime(dateValue, this.state.timeValue);
        Utils.safeInvoke(this.props.onChange, value, isUserChange);
    }

    public handleTimeChange = (timeValue: Date) => {
        if (this.props.value === undefined) {
            this.setState({ timeValue });
        }
        const value = DateUtils.getDateTime(this.state.dateValue, timeValue);
        Utils.safeInvoke(this.props.onChange, value, true);
    }
}
