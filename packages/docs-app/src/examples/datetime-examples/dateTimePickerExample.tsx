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
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

import { DateTimePicker } from "@blueprintjs/datetime";
import { MomentDate } from "./common/momentDate";

export class DateTimePickerExample extends React.PureComponent<IExampleProps, { date: Date }> {
    public state = { date: new Date() };

    public render() {
        return (
            <Example options={false} {...this.props}>
                <DateTimePicker
                    className={Classes.ELEVATION_1}
                    value={this.state.date}
                    timePickerProps={{ precision: "second", useAmPm: true }}
                    onChange={this.handleDateChange}
                />
                <div>
                    <MomentDate date={this.state.date} format="LLLL" />
                </div>
            </Example>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
