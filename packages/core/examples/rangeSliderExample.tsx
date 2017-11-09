/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { NumberRange, RangeSlider, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface IRangeSliderExampleState {
    range?: NumberRange;
    vertical?: boolean;
}

export class RangeSliderExample extends BaseExample<IRangeSliderExampleState> {
    public state: IRangeSliderExampleState = {
        range: [36, 72],
        vertical: false,
    };

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));

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
                    vertical={this.state.vertical}
                />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [<Switch checked={this.state.vertical} label="Vertical" key="vertical" onChange={this.toggleVertical} />],
        ];
    }

    private handleValueChange = (range: NumberRange) => this.setState({ range });
}
