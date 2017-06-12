/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Switch } from "@blueprintjs/core";
import { BaseExample, handleNumberChange } from "@blueprintjs/docs";
import * as React from "react";
import { PrecisionSelect } from "./common/precisionSelect";

import { TimePicker, TimePickerPrecision } from "../src";

export interface ITimePickerExampleState {
    precision?: TimePickerPrecision;
    selectAllOnFocus?: boolean;
    showArrowButtons?: boolean;
    disabled?: boolean;
}

export class TimePickerExample extends BaseExample<ITimePickerExampleState> {
    public state = {
        disabled: false,
        precision: TimePickerPrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
    };

    private handlePrecisionChange = handleNumberChange((precision) => this.setState({ precision }));

    protected renderExample() {
        return <TimePicker {...this.state}/>;
    }

    protected renderOptions() {
        return [
            [
                <PrecisionSelect
                    value={this.state.precision}
                    onChange={this.handlePrecisionChange}
                    key="precision"
                />,
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="focus"
                    onChange={this.toggleSelectAllOnFocus}
                />,
                <Switch
                    checked={this.state.showArrowButtons}
                    label="Show arrow buttons"
                    key="arrows"
                    onChange={this.toggleShowArrowButtons}
                />,
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.toggleDisabled}
                />,
            ],
        ];
    }

    private toggleShowArrowButtons = () => {
        this.setState({ showArrowButtons: !this.state.showArrowButtons });
    }

    private toggleSelectAllOnFocus = () => {
        this.setState({ selectAllOnFocus: !this.state.selectAllOnFocus });
    }

    private toggleDisabled = () => {
        this.setState({ disabled: !this.state.disabled });
    }
}
