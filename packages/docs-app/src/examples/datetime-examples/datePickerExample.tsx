/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import { MomentDate } from "./common/momentDate";
import { PrecisionSelect } from "./common/precisionSelect";

export interface IDatePickerExampleState {
    date: Date | null;
    reverseMonthAndYearMenus: boolean;
    showActionsBar: boolean;
    timePrecision: TimePrecision | undefined;
}

export class DatePickerExample extends React.PureComponent<IExampleProps, IDatePickerExampleState> {
    public state: IDatePickerExampleState = {
        date: null,
        reverseMonthAndYearMenus: false,
        showActionsBar: false,
        timePrecision: undefined,
    };

    private toggleActionsBar = handleBooleanChange(showActionsBar => this.setState({ showActionsBar }));
    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));
    private handlePrecisionChange = handleStringChange((p: TimePrecision | "none") =>
        this.setState({ timePrecision: p === "none" ? undefined : p }),
    );

    public render() {
        const { date, ...props } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={props.showActionsBar} label="Show actions bar" onChange={this.toggleActionsBar} />
                <Switch
                    checked={props.reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={this.toggleReverseMenus}
                />
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    value={props.timePrecision}
                    onChange={this.handlePrecisionChange}
                />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <DatePicker className={Classes.ELEVATION_1} onChange={this.handleDateChange} {...props} />
                <MomentDate date={date} withTime={props.timePrecision !== undefined} />
            </Example>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
