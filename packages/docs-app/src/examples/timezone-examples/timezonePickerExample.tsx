/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Switch } from "@blueprintjs/core";
import { TimezonePicker } from "@blueprintjs/datetime";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";
import { getTimezoneItems } from "./momentTimezones";

const TIMEZONES = getTimezoneItems(new Date());

export interface ITimezonePickerExampleState {
    disabled: boolean;
    showLocalTimezone: boolean;
    timezone: string;
}

export class TimezonePickerExample extends BaseExample<ITimezonePickerExampleState> {
    public state: ITimezonePickerExampleState = {
        disabled: false,
        showLocalTimezone: true,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleShowLocalTimezoneChange = handleBooleanChange(showLocalTimezone =>
        this.setState({ showLocalTimezone }),
    );

    protected renderExample() {
        const { timezone, disabled } = this.state;

        return (
            <TimezonePicker
                disabled={disabled}
                onChange={this.handleTimezoneChange}
                timezones={TIMEZONES}
                value={timezone}
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
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.handleDisabledChange}
                />,
            ],
        ];
    }

    private handleTimezoneChange = (timezone: string) => {
        this.setState({ timezone });
    };
}
