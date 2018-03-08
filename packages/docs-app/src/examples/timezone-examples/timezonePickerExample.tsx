/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { TimezoneDisplayFormat, TimezonePicker } from "@blueprintjs/timezone";

export interface ITimezonePickerExampleState {
    disabled: boolean;
    showLocalTimezone: boolean;
    targetDisplayFormat: TimezoneDisplayFormat;
    timezone: string;
}

export class TimezonePickerExample extends BaseExample<ITimezonePickerExampleState> {
    public state: ITimezonePickerExampleState = {
        disabled: false,
        showLocalTimezone: true,
        targetDisplayFormat: TimezoneDisplayFormat.COMPOSITE,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleShowLocalTimezoneChange = handleBooleanChange(showLocalTimezone =>
        this.setState({ showLocalTimezone }),
    );
    private handleFormatChange = handleStringChange((targetDisplayFormat: TimezoneDisplayFormat) =>
        this.setState({ targetDisplayFormat }),
    );

    protected renderExample() {
        const { timezone, targetDisplayFormat, disabled, showLocalTimezone } = this.state;

        return (
            <TimezonePicker
                value={timezone}
                onChange={this.handleTimezoneChange}
                valueDisplayFormat={targetDisplayFormat}
                showLocalTimezone={showLocalTimezone}
                disabled={disabled}
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
            [this.renderDisplayFormatOption()],
        ];
    }

    private renderDisplayFormatOption() {
        return (
            <RadioGroup
                key="display-format"
                label="Display format"
                onChange={this.handleFormatChange}
                selectedValue={this.state.targetDisplayFormat}
            >
                <Radio label="Abbreviation" value={TimezoneDisplayFormat.ABBREVIATION} />
                <Radio label="Composite" value={TimezoneDisplayFormat.COMPOSITE} />
                <Radio label="Name" value={TimezoneDisplayFormat.NAME} />
                <Radio label="Offset" value={TimezoneDisplayFormat.OFFSET} />
            </RadioGroup>
        );
    }

    private handleTimezoneChange = (timezone: string) => {
        this.setState({ timezone });
    };
}
