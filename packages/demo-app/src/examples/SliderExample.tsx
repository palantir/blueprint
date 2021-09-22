/* Copyright 2021 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import * as React from "react";

import { Slider } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

interface SliderExampleState {
    value1?: number;
    value2?: number;
}

const WIDTH = 300;
export class SliderExample extends React.PureComponent<Record<string, unknown>, SliderExampleState> {
    public state: SliderExampleState = {
        value1: 5,
        value2: 5,
    };

    private getChangeHandler(key: string) {
        return (value: number) => this.setState({ [key]: value });
    }

    public render() {
        return (
            <div className="example-row">
                <ExampleCard width={WIDTH}>
                    <Slider
                        min={0}
                        max={10}
                        stepSize={0.1}
                        labelStepSize={10}
                        onChange={this.getChangeHandler("value1")}
                        value={this.state.value1}
                        vertical={true}
                    />
                    <Slider
                        min={0}
                        max={10}
                        stepSize={0.1}
                        labelStepSize={10}
                        onChange={this.getChangeHandler("value2")}
                        value={this.state.value2}
                    />
                </ExampleCard>
                <ExampleCard width={WIDTH}>
                    <Slider
                        disabled={true}
                        min={0}
                        max={10}
                        stepSize={0.1}
                        labelStepSize={10}
                        value={5}
                        vertical={true}
                    />
                    <Slider disabled={true} min={0} max={10} stepSize={0.1} labelStepSize={10} value={5} />
                </ExampleCard>
            </div>
        );
    }
}
