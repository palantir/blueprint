/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, H5, HTMLSelect, Switch } from "@blueprintjs/core";
import { Example, handleNumberChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";
import { PrecisionSelect } from "./common/precisionSelect";

import { TimePicker, TimePrecision } from "@blueprintjs/datetime";
// tslint:disable-next-line:no-submodule-imports
import { getDefaultMaxTime, getDefaultMinTime } from "@blueprintjs/datetime/lib/esm/common/timeUnit";

export interface ITimePickerExampleState {
    precision?: TimePrecision;
    selectAllOnFocus?: boolean;
    showArrowButtons?: boolean;
    disabled?: boolean;
    minTime?: Date;
    maxTime?: Date;
    useAmPm?: boolean;
}

enum MinimumHours {
    NONE = 0,
    SIX_PM = 18,
}

enum MaximumHours {
    NONE = 0,
    SIX_PM = 18,
    NINE_PM = 21,
    TWO_AM = 2,
}

export class TimePickerExample extends React.PureComponent<IExampleProps, ITimePickerExampleState> {
    public state = {
        disabled: false,
        precision: TimePrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
        useAmPm: false,
    };

    private handlePrecisionChange = handleStringChange((precision: TimePrecision) => this.setState({ precision }));

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <TimePicker {...this.state} />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    onChange={this.toggleSelectAllOnFocus}
                />
                <Switch
                    checked={this.state.showArrowButtons}
                    label="Show arrow buttons"
                    onChange={this.toggleShowArrowButtons}
                />
                <Switch checked={this.state.disabled} label="Disabled" onChange={this.toggleDisabled} />
                <Switch checked={this.state.useAmPm} label="Use AM/PM" onChange={this.toggleUseAmPm} />
                <PrecisionSelect value={this.state.precision} onChange={this.handlePrecisionChange} />
                <label className={Classes.LABEL}>
                    Minimum time
                    <HTMLSelect onChange={handleNumberChange(this.changeMinHour)}>
                        <option value={MinimumHours.NONE}>None</option>
                        <option value={MinimumHours.SIX_PM}>6pm (18:00)</option>
                    </HTMLSelect>
                </label>
                <label className={Classes.LABEL}>
                    Maximum time
                    <HTMLSelect onChange={handleNumberChange(this.changeMaxHour)}>
                        <option value={MaximumHours.NONE}>None</option>
                        <option value={MaximumHours.SIX_PM}>6pm (18:00)</option>
                        <option value={MaximumHours.NINE_PM}>9pm (21:00)</option>
                        <option value={MaximumHours.TWO_AM}>2am (02:00)</option>
                    </HTMLSelect>
                </label>
            </>
        );
    }

    private toggleShowArrowButtons = () => {
        this.setState({ showArrowButtons: !this.state.showArrowButtons });
    };

    private toggleSelectAllOnFocus = () => {
        this.setState({ selectAllOnFocus: !this.state.selectAllOnFocus });
    };

    private toggleDisabled = () => {
        this.setState({ disabled: !this.state.disabled });
    };

    private toggleUseAmPm = () => {
        this.setState({ useAmPm: !this.state.useAmPm });
    };

    private changeMinHour = (hour: MinimumHours) => {
        let minTime = new Date(1995, 6, 30, hour);

        if (hour === MinimumHours.NONE) {
            minTime = getDefaultMinTime();
        }

        this.setState({ minTime });
    };

    private changeMaxHour = (hour: MaximumHours) => {
        let maxTime = new Date(1995, 6, 30, hour);

        if (hour === MaximumHours.NONE) {
            maxTime = getDefaultMaxTime();
        }

        this.setState({ maxTime });
    };
}
