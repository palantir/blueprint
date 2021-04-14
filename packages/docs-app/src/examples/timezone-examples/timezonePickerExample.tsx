/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { H5, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleValueChange, ExampleProps } from "@blueprintjs/docs-theme";
import { TimezoneDisplayFormat, TimezonePicker } from "@blueprintjs/timezone";

import { CustomTimezonePickerTarget } from "./components";

export interface TimezonePickerExampleState {
    disabled: boolean;
    showCustomTarget: boolean;
    showLocalTimezone: boolean;
    targetDisplayFormat: TimezoneDisplayFormat;
    timezone: string;
}

export class TimezonePickerExample extends React.PureComponent<ExampleProps, TimezonePickerExampleState> {
    public state: TimezonePickerExampleState = {
        disabled: false,
        showCustomTarget: false,
        showLocalTimezone: true,
        targetDisplayFormat: TimezoneDisplayFormat.COMPOSITE,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleShowLocalChange = handleBooleanChange(showLocalTimezone => this.setState({ showLocalTimezone }));

    private handleCustomChildChange = handleBooleanChange(showCustomTarget => this.setState({ showCustomTarget }));

    private handleFormatChange = handleValueChange((targetDisplayFormat: TimezoneDisplayFormat) =>
        this.setState({ targetDisplayFormat }),
    );

    public render() {
        const { timezone, targetDisplayFormat, disabled, showCustomTarget, showLocalTimezone } = this.state;

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
                <H5>Example</H5>
                <Switch checked={showCustomTarget} label="Custom target" onChange={this.handleCustomChildChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <TimezonePicker
                    value={timezone}
                    onChange={this.handleTimezoneChange}
                    valueDisplayFormat={targetDisplayFormat}
                    popoverProps={{ placement: "bottom" }}
                    showLocalTimezone={showLocalTimezone}
                    disabled={disabled}
                >
                    {showCustomTarget ? this.renderCustomTarget() : undefined}
                </TimezonePicker>
            </Example>
        );
    }

    private renderCustomTarget() {
        return <CustomTimezonePickerTarget timezone={this.state.timezone} />;
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
