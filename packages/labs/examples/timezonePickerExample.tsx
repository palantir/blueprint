/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes, Intent, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs";

import { TimezoneDisplayFormat, TimezonePicker } from "../src";

export interface ITimezonePickerExampleState {
    date?: Date;
    defaultToLocalTimezone?: boolean;
    disabled?: boolean;
    showLocalTimezone?: boolean;
    targetDisplayFormat?: TimezoneDisplayFormat;
    timezone?: string;
}

export class TimezonePickerExample extends BaseExample<ITimezonePickerExampleState> {
    public state: ITimezonePickerExampleState = {
        date: new Date(),
        defaultToLocalTimezone: false,
        disabled: false,
        showLocalTimezone: true,
        targetDisplayFormat: TimezoneDisplayFormat.OFFSET,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange((disabled) => this.setState({ disabled }));
    private handleShowLocalTimezoneChange = handleBooleanChange((showLocalTimezone) =>
        this.setState({ showLocalTimezone }));
    private handleDefaultToLocalTimezoneChange = handleBooleanChange((defaultToLocalTimezone) =>
        this.setState({ defaultToLocalTimezone }));
    private handleFormatChange = handleStringChange((targetDisplayFormat: TimezoneDisplayFormat) =>
        this.setState({ targetDisplayFormat }));

    protected renderExample() {
        const {
            date,
            timezone,
            targetDisplayFormat,
            disabled,
            showLocalTimezone,
            defaultToLocalTimezone,
        } = this.state;

        return (
            <TimezonePicker
                date={date}
                value={timezone}
                onChange={this.handleTimezoneChange}
                valueDisplayFormat={targetDisplayFormat}
                showLocalTimezone={showLocalTimezone}
                disabled={disabled}
                defaultToLocalTimezone={defaultToLocalTimezone}
                buttonProps={{ intent: Intent.PRIMARY }}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.showLocalTimezone}
                    label="Show local timezone in initial list"
                    key="show-local-timezone"
                    onChange={this.handleShowLocalTimezoneChange}
                />,
                <Switch
                    checked={this.state.defaultToLocalTimezone}
                    label="Default to the local timezone"
                    key="default-to-local-timezone"
                    onChange={this.handleDefaultToLocalTimezoneChange}
                />,
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.handleDisabledChange}
                />,
            ],
            [
                this.renderDisplayFormatSelect(),
            ],
        ];
    }

    private renderDisplayFormatSelect() {
        return (
            <label key="display-format-select" className={Classes.LABEL}>
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

    private handleTimezoneChange = (timezone: string) => {
        this.setState({ timezone });
    }
}
