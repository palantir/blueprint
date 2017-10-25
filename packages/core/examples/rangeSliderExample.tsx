/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
