/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { H5, Position, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { TimezoneDisplayFormat, TimezoneSelect } from "@blueprintjs/datetime";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

export interface TimezoneSelectExampleState {
    disabled: boolean;
    displayFormat: TimezoneDisplayFormat;
    fill: boolean;
    showCustomTarget: boolean;
    showLocalTimezone: boolean;
    timezone: string;
}

export class TimezoneSelectExample extends React.PureComponent<ExampleProps, TimezoneSelectExampleState> {
    public state: TimezoneSelectExampleState = {
        disabled: false,
        displayFormat: TimezoneDisplayFormat.COMPOSITE,
        fill: false,
        showCustomTarget: false,
        showLocalTimezone: true,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleDisplayFormatChange = handleValueChange((displayFormat: TimezoneDisplayFormat) =>
        this.setState({ displayFormat }),
    );

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));

    private handleShowLocalChange = handleBooleanChange(showLocalTimezone => this.setState({ showLocalTimezone }));

    public render() {
        const { timezone, disabled, displayFormat, fill, showLocalTimezone } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={showLocalTimezone} label="Show local timezone" onChange={this.handleShowLocalChange} />
                <Switch checked={disabled} label="Disabled" onChange={this.handleDisabledChange} />
                <Switch label="Fill container width" checked={this.state.fill} onChange={this.handleFillChange} />
                <RadioGroup
                    label="Display format"
                    onChange={this.handleDisplayFormatChange}
                    selectedValue={this.state.displayFormat}
                >
                    <Radio label="Composite" value={TimezoneDisplayFormat.COMPOSITE} />
                    <Radio label="Abbreviation" value={TimezoneDisplayFormat.ABBREVIATION} />
                    <Radio label="Long Name" value={TimezoneDisplayFormat.LONG_NAME} />
                    <Radio label="IANA Code" value={TimezoneDisplayFormat.CODE} />
                    <Radio label="Offset" value={TimezoneDisplayFormat.OFFSET} />
                </RadioGroup>
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <TimezoneSelect
                    disabled={disabled}
                    fill={fill}
                    onChange={this.handleTimezoneChange}
                    popoverProps={{ position: Position.BOTTOM }}
                    showLocalTimezone={showLocalTimezone}
                    value={timezone}
                    valueDisplayFormat={displayFormat}
                />
            </Example>
        );
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
