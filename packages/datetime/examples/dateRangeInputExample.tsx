/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs";
import * as React from "react";

import { DateRangeInput } from "../src";
import { FORMATS, FormatSelect } from "./common/formatSelect";

export interface IDateRangeInputExampleState {
    allowSingleDayRange?: boolean;
    closeOnSelection?: boolean;
    contiguousCalendarMonths?: boolean;
    disabled?: boolean;
    format?: string;
    selectAllOnFocus?: boolean;
}

export class DateRangeInputExample extends BaseExample<IDateRangeInputExampleState> {
    public state: IDateRangeInputExampleState = {
        allowSingleDayRange: false,
        closeOnSelection: false,
        contiguousCalendarMonths: true,
        disabled: false,
        format: FORMATS[0],
        selectAllOnFocus: false,
    };

    private toggleContiguous = handleBooleanChange((contiguous) => {
        this.setState({ contiguousCalendarMonths: contiguous });
    });
    private toggleDisabled = handleBooleanChange((disabled) => this.setState({ disabled }));
    private toggleFormat = handleStringChange((format) => this.setState({ format }));
    private toggleSelection = handleBooleanChange((closeOnSelection) => this.setState({ closeOnSelection }));
    private toggleSelectAllOnFocus = handleBooleanChange((selectAllOnFocus) => this.setState({ selectAllOnFocus }));
    private toggleSingleDay = handleBooleanChange((allowSingleDayRange) => this.setState({ allowSingleDayRange }));

    protected renderExample() {
        return <DateRangeInput {...this.state} />;
    }

    protected renderOptions() {
        return [
            [
                <FormatSelect
                    key="Format"
                    onChange={this.toggleFormat}
                    selectedValue={this.state.format}
                />,
            ], [
                <label className={Classes.LABEL} key="modifierslabel">Modifiers</label>,
                <Switch
                    checked={this.state.allowSingleDayRange}
                    label="Allow single day range"
                    key="Allow single day range"
                    onChange={this.toggleSingleDay}
                />,
                <Switch
                    checked={this.state.closeOnSelection}
                    label="Close on selection"
                    key="Selection"
                    onChange={this.toggleSelection}
                />,
                <Switch
                    checked={this.state.contiguousCalendarMonths}
                    label="Constrain calendar to contiguous months"
                    key="Constraint calendar to contiguous months"
                    onChange={this.toggleContiguous}
                />,
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="Disabled"
                    onChange={this.toggleDisabled}
                />,
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="Select all on focus"
                    onChange={this.toggleSelectAllOnFocus}
                />,
            ],
        ];
    }
}
