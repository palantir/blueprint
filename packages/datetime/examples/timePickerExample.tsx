/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Switch } from "@blueprintjs/core";
import { BaseExample, handleNumberChange } from "@blueprintjs/docs";
import * as React from "react";
import { PrecisionSelect } from "./common/precisionSelect";

import { TimePicker, TimePickerPrecision } from "../src";
import { getDefaultMaxTime, getDefaultMinTime } from "../src/timePicker";

export interface ITimePickerExampleState {
    precision?: TimePickerPrecision;
    selectAllOnFocus?: boolean;
    showArrowButtons?: boolean;
    disabled?: boolean;
    minTime?: Date;
    maxTime?: Date;
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

export class TimePickerExample extends BaseExample<ITimePickerExampleState> {
    public state = {
        disabled: false,
        precision: TimePickerPrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
    };

    private handlePrecisionChange = handleNumberChange((precision) => this.setState({ precision }));

    protected renderExample() {
        return <TimePicker {...this.state} />;
    }

    protected renderOptions() {
        return [
            [
                <PrecisionSelect
                    value={this.state.precision}
                    onChange={this.handlePrecisionChange}
                    key="precision"
                />,
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="focus"
                    onChange={this.toggleSelectAllOnFocus}
                />,
                <Switch
                    checked={this.state.showArrowButtons}
                    label="Show arrow buttons"
                    key="arrows"
                    onChange={this.toggleShowArrowButtons}
                />,
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.toggleDisabled}
                />,
            ],
            [
                <label key={0} className={Classes.LABEL}>
                    Minimum time
                    <div className={Classes.SELECT}>
                        <select onChange={handleNumberChange(this.changeMinHour)}>
                            <option key={0} value={MinimumHours.NONE}>None</option>
                            <option key={1} value={MinimumHours.SIX_PM}>6pm (18:00)</option>
                        </select>
                    </div>
                </label>,
                <label key={1}  className={Classes.LABEL}>
                    Maximum time
                    <div className={Classes.SELECT}>
                        <select onChange={handleNumberChange(this.changeMaxHour)}>
                            <option key={0} value={MaximumHours.NONE}>None</option>
                            <option key={1} value={MaximumHours.SIX_PM}>6pm (18:00)</option>
                            <option key={2} value={MaximumHours.NINE_PM}>9pm (21:00)</option>
                            <option key={3} value={MaximumHours.TWO_AM}>2am (02:00)</option>
                        </select>
                    </div>
                </label>,
            ],
        ];
    }

    private toggleShowArrowButtons = () => {
        this.setState({ showArrowButtons: !this.state.showArrowButtons });
    }

    private toggleSelectAllOnFocus = () => {
        this.setState({ selectAllOnFocus: !this.state.selectAllOnFocus });
    }

    private toggleDisabled = () => {
        this.setState({ disabled: !this.state.disabled });
    }

    private changeMinHour = (hour: MinimumHours) => {
        let minTime = new Date(1995, 6, 30, hour);

        if (hour === MinimumHours.NONE) {
            minTime = getDefaultMinTime();
        }

        this.setState({ minTime });
    }

    private changeMaxHour = (hour: MaximumHours) => {
        let maxTime = new Date(1995, 6, 30, hour);

        if (hour === MaximumHours.NONE) {
            maxTime = getDefaultMaxTime();
        }

        this.setState({ maxTime });
    }
}
