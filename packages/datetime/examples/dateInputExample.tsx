/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange, handleStringChange } from "@blueprintjs/docs";
import * as React from "react";

import { DateInput, TimePickerPrecision } from "../src";
import { FORMATS, FormatSelect } from "./common/formatSelect";
import { PrecisionSelect } from "./common/precisionSelect";

export interface IDateInputExampleState {
    closeOnSelection?: boolean;
    disabled?: boolean;
    format?: string;
    openOnFocus?: boolean;
    timePrecision?: TimePickerPrecision;
}

export class DateInputExample extends BaseExample<IDateInputExampleState> {
    public state: IDateInputExampleState = {
        closeOnSelection: true,
        disabled: false,
        format: FORMATS[0],
        openOnFocus: true,
    };

    private toggleFocus = handleBooleanChange((openOnFocus) => this.setState({ openOnFocus }));
    private toggleSelection = handleBooleanChange((closeOnSelection) => this.setState({ closeOnSelection }));
    private toggleDisabled = handleBooleanChange((disabled) => this.setState({ disabled }));
    private toggleFormat = handleStringChange((format) => this.setState({ format }));
    private toggleTimePrecision = handleNumberChange((timePrecision) =>
    this.setState({
        timePrecision: timePrecision < 0 ? undefined : timePrecision,
    }));

    protected renderExample() {
        return (
            <DateInput {...this.state} defaultValue={new Date()} />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.openOnFocus}
                    label="Open on input focus"
                    key="Focus"
                    onChange={this.toggleFocus}
                />,
                <Switch
                    checked={this.state.closeOnSelection}
                    label="Close on selection"
                    key="Selection"
                    onChange={this.toggleSelection}
                />,
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="Disabled"
                    onChange={this.toggleDisabled}
                />,
                <PrecisionSelect
                    label="Time Precision"
                    key="precision"
                    allowEmpty={true}
                    selectedValue={this.state.timePrecision}
                    onChange={this.toggleTimePrecision}
                />,
            ], [
                <FormatSelect
                    key="Format"
                    onChange={this.toggleFormat}
                    selectedValue={this.state.format}
                />,
            ],
        ];
    }
}
