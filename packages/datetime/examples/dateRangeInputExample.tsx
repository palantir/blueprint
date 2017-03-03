/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Radio, RadioGroup } from "@blueprintjs/core";
import BaseExample, { handleStringChange } from "@blueprintjs/core/examples/common/baseExample";
import * as React from "react";

import { DateRangeInput } from "../src";

export interface IDateRangeInputExampleState {
    format?: string;
}

export class DateRangeInputExample extends BaseExample<IDateRangeInputExampleState> {
    public state: IDateRangeInputExampleState = {
        format: "DD/MM/YYYY",
    };

    private toggleFormat = handleStringChange((format) => this.setState({ format }));

    protected renderExample() {
        return <DateRangeInput {...this.state} />;
    }

    protected renderOptions() {
        return [
            [
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
