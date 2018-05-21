/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

import { DatePicker } from "@blueprintjs/datetime";
import { MomentDate } from "./common/momentDate";

export interface IDatePickerExampleState {
    date: Date | null;
    reverseMonthAndYearMenus: boolean;
    showActionsBar: boolean;
}

export class DatePickerExample extends React.PureComponent<IExampleProps, IDatePickerExampleState> {
    public state: IDatePickerExampleState = {
        date: null,
        reverseMonthAndYearMenus: false,
        showActionsBar: false,
    };

    private toggleActionsBar = handleBooleanChange(showActionsBar => this.setState({ showActionsBar }));
    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));

    public render() {
        const { date, showActionsBar, reverseMonthAndYearMenus: reverseMenus } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={showActionsBar} label="Show actions bar" onChange={this.toggleActionsBar} />
                <Switch
                    checked={reverseMenus}
                    label="Reverse month and year menus"
                    onChange={this.toggleReverseMenus}
                />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <DatePicker
                    className={Classes.ELEVATION_1}
                    onChange={this.handleDateChange}
                    reverseMonthAndYearMenus={reverseMenus}
                    showActionsBar={showActionsBar}
                />
                <MomentDate date={date} />
            </Example>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
