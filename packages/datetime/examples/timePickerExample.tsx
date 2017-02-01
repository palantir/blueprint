/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Switch } from "@blueprintjs/core";
import BaseExample, { handleNumberChange } from "@blueprintjs/core/examples/common/baseExample";
import * as React from "react";

import { TimePicker, TimePickerPrecision } from "../src";

export interface ITimePickerExampleState {
    precision?: TimePickerPrecision;
    selectAllOnFocus?: boolean;
    showArrowButtons?: boolean;
}

export class TimePickerExample extends BaseExample<ITimePickerExampleState> {
    public state = {
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
                <label className={Classes.LABEL} key="precision">
                    Precision
                    <div className={Classes.SELECT}>
                        <select
                            value={this.state.precision.toString()}
                            onChange={this.handlePrecisionChange}
                        >
                            <option value={TimePickerPrecision.MINUTE.toString()}>Minute</option>
                            <option value={TimePickerPrecision.SECOND.toString()}>Second</option>
                            <option value={TimePickerPrecision.MILLISECOND.toString()}>Millisecond</option>
                        </select>
                    </div>
                </label>,
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
            ],
        ];
    }

    private toggleShowArrowButtons = () => {
        this.setState({ showArrowButtons: !this.state.showArrowButtons });
    }

    private toggleSelectAllOnFocus = () => {
        this.setState({ selectAllOnFocus: !this.state.selectAllOnFocus });
    }
}
