/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
import * as React from "react";

import { DateTimePicker, TimePickerPrecision } from "@blueprintjs/datetime";
import { MomentDate } from "./common/momentDate";

export class DateTimePickerExample extends BaseExample<{ date: Date }> {
    public state = { date: new Date() };

    protected renderExample() {
        const timeProps = { precision: TimePickerPrecision.SECOND };
        return (
            <div className="docs-datetime-example">
                <DateTimePicker
                    className={Classes.ELEVATION_1}
                    value={this.state.date}
                    timePickerProps={timeProps}
                    onChange={this.handleDateChange}
                />
                <div>
                    <MomentDate date={this.state.date} format="LLLL" />
                </div>
            </div>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
