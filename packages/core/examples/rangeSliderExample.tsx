/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import BaseExample from "./common/baseExample";
import { NumberRange, RangeSlider } from "@blueprintjs/core";

export interface IRangeSliderExampleState {
    range?: NumberRange;
}

export class RangeSliderExample extends BaseExample<IRangeSliderExampleState> {
    public state: IRangeSliderExampleState = {
        range: [36, 72],
    };

    protected renderExample() {
        return (
            <div style={{ width: "100%" }}>
                <RangeSlider
                    min={0}
                    max={100}
                    stepSize={2}
                    labelStepSize={20}
                    onChange={this.handleValueChange}
                    value={this.state.range}
                />
            </div>
        );
    }

    private handleValueChange = (range: NumberRange) => this.setState({ range });
}
