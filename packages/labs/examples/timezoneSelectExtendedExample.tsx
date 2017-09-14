/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as moment from "moment-timezone";
import * as React from "react";

import { Classes, Icon, Switch, Tag } from "@blueprintjs/core";
import { DatePicker, TimePicker, TimePickerPrecision } from "@blueprintjs/datetime";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs";

import { ITimezoneSelectTargetRenderer, TimezoneDisplayFormat, TimezoneSelect } from "../src";

export interface ITimezoneSelectExtendedExampleState {
    date?: Date;
    time?: Date;
    timezone?: string;
    dateTime?: Date;
    targetDisplayFormat?: TimezoneDisplayFormat;
    disabled?: boolean;
    showLocalTimezone?: boolean;
    useDefault?: boolean;
    defaultToUserTimezoneGuess?: boolean;
    useCustomRenderer?: boolean;
}

const EXAMPLE_DEFAULT_TIMEZONE = "Pacific/Honolulu";

export class TimezoneSelectExtendedExample extends BaseExample<ITimezoneSelectExtendedExampleState> {
    public state: ITimezoneSelectExtendedExampleState = {
        date: new Date(),
        dateTime: new Date(),
        defaultToUserTimezoneGuess: false,
        disabled: false,
        showLocalTimezone: true,
        targetDisplayFormat: TimezoneDisplayFormat.OFFSET,
        time: new Date(),
        timezone: "",
        useCustomRenderer: true,
        useDefault: false,
    };

    private handleDisabledChange = handleBooleanChange((disabled) =>
        this.setState({ disabled }));
    private handleShowLocalTimezoneChange = handleBooleanChange((showLocalTimezone) =>
        this.setState({ showLocalTimezone }));
    private handleUseDefaultChange = handleBooleanChange((useDefault) =>
        this.setState({ useDefault }));
    private handleDefaultToUserTimezoneGuessChange = handleBooleanChange((defaultToUserTimezoneGuess) =>
        this.setState({ defaultToUserTimezoneGuess }));
    private handleUseCustomRendererChange = handleBooleanChange((useCustomRenderer) =>
        this.setState({ useCustomRenderer }));
    private handleFormatChange = handleStringChange((targetDisplayFormat: TimezoneDisplayFormat) =>
        this.setState({ targetDisplayFormat }));

    protected renderExample() {
        const {
            date,
            time,
            timezone,
            dateTime,
            targetDisplayFormat,
            disabled,
            showLocalTimezone,
            useCustomRenderer,
            useDefault,
            defaultToUserTimezoneGuess,
        } = this.state;

        const selection = dateTime && timezone
            ? toISOString(dateTime, timezone)
            : "Select a date, time, and timezone";

        return (
            <div>
                <div
                    className={Classes.ELEVATION_1}
                    style={{ display: "inline-block", background: "white", borderRadius: 3 }}
                >
                    <DatePicker
                        value={date}
                        onChange={this.handleDateChange}
                    />

                    <div style={{ padding: 10, display: "flex", justifyContent: "center" }}>
                        <TimePicker
                            value={time}
                            onChange={this.handleTimeChange}
                            precision={TimePickerPrecision.SECOND}
                        />

                        <TimezoneSelect
                            date={date}
                            value={timezone}
                            onChange={this.handleTimezoneChange}
                            targetDisplayFormat={targetDisplayFormat}
                            showLocalTimezone={showLocalTimezone}
                            disabled={disabled}
                            defaultValue={useDefault ? EXAMPLE_DEFAULT_TIMEZONE : undefined}
                            defaultToLocalTimezone={defaultToUserTimezoneGuess}
                            targetRenderer={useCustomRenderer ? this.targetRenderer : undefined}
                        />
                    </div>
                </div>

                <div style={{ marginTop: 20 }}>
                    <Tag
                        className={classNames(Classes.MINIMAL, Classes.LARGE)}
                        onRemove={this.reset}
                    >
                        <Icon iconName="time" />
                        <span style={{ marginLeft: 10 }}>{selection}</span>
                    </Tag>
                </div>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.handleDisabledChange}
                />,
                <Switch
                    checked={this.state.showLocalTimezone}
                    label="Show user timezone guess"
                    key="show-user-timezone-guess"
                    onChange={this.handleShowLocalTimezoneChange}
                />,
                <Switch
                    checked={this.state.useDefault}
                    label="Use a default timezone"
                    key="use-default"
                    onChange={this.handleUseDefaultChange}
                />,
                <Switch
                    checked={this.state.defaultToUserTimezoneGuess}
                    label="Default to the user's guessed timezone"
                    key="default-to-user-timezone-guess"
                    onChange={this.handleDefaultToUserTimezoneGuessChange}
                />,
                <Switch
                    checked={this.state.useCustomRenderer}
                    label="Use a custom target renderer"
                    key="use-custom-renderer"
                    onChange={this.handleUseCustomRendererChange}
                />,
            ],
            [
                this.renderFormatSelect(),
            ],
        ];
    }

    private targetRenderer: ITimezoneSelectTargetRenderer = (targetProps) => {
        const { value, displayValue, defaultDisplayValue, placeholder, disabled } = targetProps;
        const emptyValue = !value;
        const targetTextClasses = classNames({ [Classes.TEXT_MUTED]: emptyValue });
        const targetIconClasses = classNames(Classes.ALIGN_RIGHT, { [Classes.TEXT_MUTED]: emptyValue });

        return (
            <button
                className={Classes.INPUT}
                disabled={disabled}
                style={{ cursor: !disabled ? "text" : undefined }}
            >
                <span className={targetTextClasses}>
                    {displayValue || defaultDisplayValue || placeholder}
                </span>
                <Icon iconName="caret-down" className={targetIconClasses} />
            </button>
        );
    }

    private renderFormatSelect() {
        return (
            <label key="format-select" className={Classes.LABEL}>
                Target display format
                <div className={Classes.SELECT}>
                    <select
                        value={this.state.targetDisplayFormat}
                        onChange={this.handleFormatChange}
                    >
                        <option value={TimezoneDisplayFormat.ABBREVIATION.toString()}>Abbreviation</option>
                        <option value={TimezoneDisplayFormat.NAME.toString()}>Name</option>
                        <option value={TimezoneDisplayFormat.OFFSET.toString()}>Offset</option>
                    </select>
                </div>
            </label>
        );
    }

    private handleDateChange = (date: Date) => {
        this.setState({ date, dateTime: toDateTime(date, this.state.time) });
    }

    private handleTimeChange = (time: Date) => {
        this.setState({ time, dateTime: toDateTime(this.state.date, time) });
    }

    private handleTimezoneChange = (timezone: string) => {
        this.setState({ timezone });
    }

    private reset = () => {
        this.setState({ date: null, time: null, timezone: "", dateTime: null });
    }
}

function toDateTime(date: Date, time: Date): Date {
    return date && time
        ? new Date(
            date.getFullYear(), date.getMonth(), date.getDate(),
            time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())
        : null;
}

const DATE_FORMAT_WITHOUT_TIMEZONE = "MMM DD YYYY HH:mm:ss";
const DATE_FORMAT_ISO = "YYYY-MM-DDTHH:mm:ssZ";
function toISOString(date: Date, timezone: string) {
    const dateStringWithoutTimezone = moment(date).format(DATE_FORMAT_WITHOUT_TIMEZONE);
    const zonedDate = moment.tz(dateStringWithoutTimezone, DATE_FORMAT_WITHOUT_TIMEZONE, timezone);
    return zonedDate.format(DATE_FORMAT_ISO);
}
