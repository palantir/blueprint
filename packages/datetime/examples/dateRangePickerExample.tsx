/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Switch } from "@blueprintjs/core";
import BaseExample, { handleBooleanChange } from "@blueprintjs/core/examples/common/baseExample";
import * as React from "react";

import { DateRange, DateRangePicker } from "../src";
import { Moment } from "./datePickerExample";

export interface IDateRangePickerExampleState {
    allowSingleDayRange?: boolean;
    dateRange?: DateRange;
    isSequential?: boolean;
}

export class DateRangePickerExample extends BaseExample<IDateRangePickerExampleState> {
    public state: IDateRangePickerExampleState = {
        allowSingleDayRange: false,
        dateRange: [null, null],
        isSequential: true,
    };

    private toggleSingleDay = handleBooleanChange((allowSingleDayRange) => this.setState({ allowSingleDayRange }));
    private toggleSequential = handleBooleanChange((isSequential) => this.setState({ isSequential }));

    protected renderExample() {
        const [start, end] = this.state.dateRange;
        return <div className="docs-datetime-example">
            <DateRangePicker
                allowSingleDayRange={this.state.allowSingleDayRange}
                isSequential={this.state.isSequential}
                className={Classes.ELEVATION_1}
                onChange={this.handleDateChange}
            />
            <div>
                <Moment date={start} />
                <span className={`${Classes.ICON_LARGE} ${Classes.iconClass("arrow-right")}`} />
                <Moment date={end} />
            </div>
        </div>;
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.allowSingleDayRange}
                    key="SingleDay"
                    label="Allow single day range"
                    onChange={this.toggleSingleDay}
                />,
                <Switch
                    checked={this.state.isSequential}
                    key="Sequential"
                    label="Contrain to sequentual months"
                    onChange={this.toggleSequential}
                />,
            ],
        ];
    }

    private handleDateChange = (dateRange: DateRange) => this.setState({ dateRange });
}
