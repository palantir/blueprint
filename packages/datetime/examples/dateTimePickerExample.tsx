/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes } from "@blueprintjs/core";
import BaseExample from "@blueprintjs/docs/dist/components/baseExample";
import * as React from "react";

import { DateTimePicker, TimePickerPrecision } from "../src";
import { Moment } from "./datePickerExample";

export class DateTimePickerExample extends BaseExample<{ date: Date }> {
    public state = { date: null as Date };

    protected renderExample() {
        const timeProps = { precision: TimePickerPrecision.SECOND };
        return <div className="docs-datetime-example">
            <DateTimePicker
                className={Classes.ELEVATION_1}
                timePickerProps={timeProps}
                onChange={this.handleDateChange}
            />
            <div>
                <Moment date={this.state.date} format="LLLL" />
            </div>
        </div>;
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
