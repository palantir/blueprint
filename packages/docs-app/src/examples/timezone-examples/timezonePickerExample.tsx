/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { H5, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { TimezoneDisplayFormat, TimezonePicker } from "@blueprintjs/timezone";

export interface ITimezonePickerExampleState {
    disabled: boolean;
    showLocalTimezone: boolean;
    targetDisplayFormat: TimezoneDisplayFormat;
    timezone: string;
}

export class TimezonePickerExample extends React.PureComponent<IExampleProps, ITimezonePickerExampleState> {
    public state: ITimezonePickerExampleState = {
        disabled: false,
        showLocalTimezone: true,
        targetDisplayFormat: TimezoneDisplayFormat.COMPOSITE,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleShowLocalChange = handleBooleanChange(showLocalTimezone => this.setState({ showLocalTimezone }));
    private handleFormatChange = handleStringChange((targetDisplayFormat: TimezoneDisplayFormat) =>
        this.setState({ targetDisplayFormat }),
    );

    public render() {
        const { timezone, targetDisplayFormat, disabled, showLocalTimezone } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={showLocalTimezone} label="Show local timezone" onChange={this.handleShowLocalChange} />
                <Switch checked={disabled} label="Disabled" onChange={this.handleDisabledChange} />
                <RadioGroup
                    label="Display format"
                    onChange={this.handleFormatChange}
                    selectedValue={this.state.targetDisplayFormat}
                >
                    <Radio label="Abbreviation" value={TimezoneDisplayFormat.ABBREVIATION} />
                    <Radio label="Composite" value={TimezoneDisplayFormat.COMPOSITE} />
                    <Radio label="Name" value={TimezoneDisplayFormat.NAME} />
                    <Radio label="Offset" value={TimezoneDisplayFormat.OFFSET} />
                </RadioGroup>
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <TimezonePicker
                    value={timezone}
                    onChange={this.handleTimezoneChange}
                    valueDisplayFormat={targetDisplayFormat}
                    showLocalTimezone={showLocalTimezone}
                    disabled={disabled}
                />
            </Example>
        );
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
