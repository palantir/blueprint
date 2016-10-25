/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Classes, Intent, Switch, Tag } from "@blueprint/core";
import { DatePicker } from "@blueprint/datetime";
import * as classNames from "classnames";
import * as moment from "moment";
import * as React from "react";

import BaseExample, { handleBooleanChange } from "./baseExample";

const FORMAT = "dddd, LL";

export const Moment: React.SFC<{ date: Date, format?: string }> = ({ date, format = FORMAT }) => {
    const m = moment(date);
    if (m.isValid()) {
        return <Tag className={Classes.LARGE} intent={Intent.PRIMARY}>{m.format(format)}</Tag>;
    } else {
        return <Tag className={classNames(Classes.LARGE, Classes.MINIMAL)}>no date</Tag>;
    }
};

export interface IDatePickerExampleState {
    date?: Date;
    showActionsBar?: boolean;
}

export class DatePickerExample extends BaseExample<IDatePickerExampleState> {
    public state: IDatePickerExampleState = {
        date: null,
        showActionsBar: false,
    };

    private toggleActionsBar = handleBooleanChange((showActionsBar) => this.setState({ showActionsBar }));

    protected renderExample() {
        return <div className="docs-datetime-example">
            <DatePicker
                className={Classes.ELEVATION_1}
                onChange={this.handleDateChange}
                showActionsBar={this.state.showActionsBar}
            />
            <Moment date={this.state.date} />
        </div>;
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.showActionsBar}
                    label="Show actions bar"
                    key="Actions"
                    onChange={this.toggleActionsBar}
                />,
            ],
        ];
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
