/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
