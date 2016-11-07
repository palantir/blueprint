/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Classes } from "@blueprint/core";
import BaseExample from "@blueprint/core/examples/common/baseExample";
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
