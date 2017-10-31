/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { NumberRange, RangeSlider } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

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
