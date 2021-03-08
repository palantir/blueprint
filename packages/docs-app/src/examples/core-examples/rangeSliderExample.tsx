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

import { H5, NumberRange, RangeSlider, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IRangeSliderExampleState {
    range: NumberRange;
    vertical: boolean;
}

export class RangeSliderExample extends React.PureComponent<IExampleProps, IRangeSliderExampleState> {
    public state: IRangeSliderExampleState = {
        range: [36, 72],
        vertical: false,
    };

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const { range, vertical } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Vertical" checked={vertical} onChange={this.toggleVertical} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <RangeSlider
                    min={0}
                    max={100}
                    stepSize={2}
                    labelStepSize={20}
                    onChange={this.handleValueChange}
                    value={range}
                    vertical={vertical}
                />
            </Example>
        );
    }

    private handleValueChange = (range: NumberRange) => this.setState({ range });
}
