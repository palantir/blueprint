/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Classes, Switch } from "@blueprintjs/core";
import BaseExample, { handleNumberChange } from "@blueprintjs/core/examples/common/baseExample";
import * as React from "react";

import { TimePicker, TimePickerPrecision } from "../src";

export interface ITimePickerExampleState {
    precision?: TimePickerPrecision;
    showArrowButtons?: boolean;
}

export class TimePickerExample extends BaseExample<ITimePickerExampleState> {
    public state = {
        precision: TimePickerPrecision.MINUTE,
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
                    TimePicker precision
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
                    checked={this.state.showArrowButtons}
                    label="Show arrow buttons"
                    key="arrows"
                    onChange={this.toggleshowArrowButtons}
                />,
            ],
        ];
    }

    private toggleshowArrowButtons = () => {
        this.setState({ showArrowButtons: !this.state.showArrowButtons });
    };
}
