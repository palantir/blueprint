/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";
import * as React from "react";

import { DatePicker } from "@blueprintjs/datetime";
import { MomentDate } from "./common/momentDate";

export interface IDatePickerExampleState {
    date?: Date;
    reverseMonthAndYearMenus?: boolean;
    showActionsBar?: boolean;
}

export class DatePickerExample extends BaseExample<IDatePickerExampleState> {
    public state: IDatePickerExampleState = {
        date: null,
        reverseMonthAndYearMenus: false,
        showActionsBar: false,
    };

    private toggleActionsBar = handleBooleanChange(showActionsBar => this.setState({ showActionsBar }));
    private toggleReverseMonthAndYearMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );

    protected renderExample() {
        return (
            <div className="docs-datetime-example">
                <DatePicker
                    className={Classes.ELEVATION_1}
                    onChange={this.handleDateChange}
                    reverseMonthAndYearMenus={this.state.reverseMonthAndYearMenus}
                    showActionsBar={this.state.showActionsBar}
                />
                <MomentDate date={this.state.date} />
            </div>
        );
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
                <Switch
                    checked={this.state.reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    key="Reverse month and year menus"
                    onChange={this.toggleReverseMonthAndYearMenus}
                />,
            ],
        ];
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
