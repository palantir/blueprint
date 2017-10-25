/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import * as React from "react";

import { DateTimePicker, TimePickerPrecision } from "../src";
import { Moment } from "./datePickerExample";

export class DateTimePickerExample extends BaseExample<{ date: Date }> {
    public state = { date: null as Date };

    protected renderExample() {
        const timeProps = { precision: TimePickerPrecision.SECOND };
        return (
            <div className="docs-datetime-example">
                <DateTimePicker
                    className={Classes.ELEVATION_1}
                    timePickerProps={timeProps}
                    onChange={this.handleDateChange}
                />
                <div>
                    <Moment date={this.state.date} format="LLLL" />
                </div>
            </div>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
