/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { H5, Intent, Label, Slider, Spinner, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IntentSelect } from "./common/intentSelect";

export interface ISpinnerExampleState {
    hasValue: boolean;
    intent?: Intent;
    size: number;
    value: number;
}

export class SpinnerExample extends React.PureComponent<IExampleProps, ISpinnerExampleState> {
    public state: ISpinnerExampleState = {
        hasValue: false,
        size: Spinner.SIZE_STANDARD,
        value: 0.7,
    };

    private handleIndeterminateChange = handleBooleanChange(hasValue => this.setState({ hasValue }));
    private handleModifierChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    public render() {
        const { size, hasValue, intent, value } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Spinner intent={intent} size={size} value={hasValue ? value : null} />
            </Example>
        );
    }

    private renderOptions() {
        const { size, hasValue, intent, value } = this.state;
        return (
            <>
                <H5>Props</H5>
                <IntentSelect intent={intent} onChange={this.handleModifierChange} />
                <Label>Size</Label>
                <Slider
                    labelStepSize={50}
                    min={0}
                    max={Spinner.SIZE_LARGE * 2}
                    showTrackFill={false}
                    stepSize={5}
                    value={size}
                    onChange={this.handleSizeChange}
                />
                <Switch checked={hasValue} label="Known value" onChange={this.handleIndeterminateChange} />
                <Slider
                    disabled={!hasValue}
                    labelStepSize={1}
                    min={0}
                    max={1}
                    onChange={this.handleValueChange}
                    labelRenderer={this.renderLabel}
                    stepSize={0.1}
                    showTrackFill={false}
                    value={value}
                />
            </>
        );
    }

    private renderLabel = (value: number) => value.toFixed(1);

    private handleValueChange = (value: number) => this.setState({ value });
    private handleSizeChange = (size: number) => this.setState({ size });
}
