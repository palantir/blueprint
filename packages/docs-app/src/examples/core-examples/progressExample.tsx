/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { H5, Intent, ProgressBar, Slider, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

export interface IProgressExampleState {
    hasValue: boolean;
    intent?: Intent;
    value: number;
}

export class ProgressExample extends React.PureComponent<IExampleProps, IProgressExampleState> {
    public state: IProgressExampleState = {
        hasValue: false,
        value: 0.7,
    };

    private handleIndeterminateChange = handleBooleanChange(hasValue => this.setState({ hasValue }));
    private handleModifierChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    public render() {
        const { hasValue, intent, value } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <IntentSelect intent={intent} onChange={this.handleModifierChange} />
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

        return (
            <Example options={options} {...this.props}>
                <ProgressBar intent={intent} value={hasValue ? value : null} />
            </Example>
        );
    }

    private renderLabel = (value: number) => value.toFixed(1);

    private handleValueChange = (value: number) => this.setState({ value });
}
