/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Radio, RadioGroup, Switch } from "@blueprintjs/core";
import BaseExample, { handleBooleanChange, handleStringChange } from "@blueprintjs/core/examples/common/baseExample";
import * as React from "react";

import { DateInput } from "../src";

export interface IDateInputExampleState {
    closeOnSelection?: boolean;
    disabled?: boolean;
    format?: string;
    openOnFocus?: boolean;
}

export class DateInputExample extends BaseExample<IDateInputExampleState> {
    public state: IDateInputExampleState = {
        closeOnSelection: true,
        disabled: false,
        format: "DD/MM/YYYY",
        openOnFocus: true,
    };

    private toggleFocus = handleBooleanChange((openOnFocus) => this.setState({ openOnFocus }));
    private toggleSelection = handleBooleanChange((closeOnSelection) => this.setState({ closeOnSelection }));
    private toggleDisabled = handleBooleanChange((disabled) => this.setState({ disabled }));
    private toggleFormat = handleStringChange((format) => this.setState({ format }));

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
            ], [
                <RadioGroup
                    key="Format"
                    label="Date format"
                    onChange={this.toggleFormat}
                    selectedValue={this.state.format}
                >
                    <Radio label="DD/MM/YYYY" value="DD/MM/YYYY" />
                    <Radio label="MM-DD-YYYY" value="MM-DD-YYYY" />
                    <Radio label="YYYY-MM-DD" value="YYYY-MM-DD" />
                </RadioGroup>,
            ],
        ];
    }
}
