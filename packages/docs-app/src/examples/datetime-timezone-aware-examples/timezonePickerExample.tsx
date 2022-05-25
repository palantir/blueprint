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

import { H5, Position, Switch } from "@blueprintjs/core";
import { TimeZonePicker } from "@blueprintjs/datetime-timezone-aware";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface ITimezonePickerExampleState {
    disabled: boolean;
    showCustomTarget: boolean;
    showLocalTimezone: boolean;
    timezone: string;
}

export class TimezonePickerExample extends React.PureComponent<IExampleProps, ITimezonePickerExampleState> {
    public state: ITimezonePickerExampleState = {
        disabled: false,
        showCustomTarget: false,
        showLocalTimezone: true,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleShowLocalChange = handleBooleanChange(showLocalTimezone => this.setState({ showLocalTimezone }));

    public render() {
        const { timezone, disabled, showLocalTimezone } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={showLocalTimezone} label="Show local timezone" onChange={this.handleShowLocalChange} />
                <Switch checked={disabled} label="Disabled" onChange={this.handleDisabledChange} />
                <H5>Example</H5>
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <TimeZonePicker
                    value={timezone}
                    onChange={this.handleTimezoneChange}
                    popoverProps={{ position: Position.BOTTOM }}
                    showLocalTimezone={showLocalTimezone}
                    disabled={disabled}
                />
            </Example>
        );
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
