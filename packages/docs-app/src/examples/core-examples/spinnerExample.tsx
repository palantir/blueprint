/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Intent, Label, Slider, Spinner, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IntentSelect } from "./common/intentSelect";

const SIZES = [
    { label: "Default", value: "" },
    { label: "Small", value: Classes.SMALL },
    { label: "Large", value: Classes.LARGE },
];

export interface ISpinnerExampleState {
    hasValue: boolean;
    intent?: Intent;
    size: string;
    value: number;
}

export class SpinnerExample extends React.PureComponent<IExampleProps, ISpinnerExampleState> {
    public state: ISpinnerExampleState = {
        hasValue: false,
        size: "",
        value: 0.7,
    };

    private handleIndeterminateChange = handleBooleanChange(hasValue => this.setState({ hasValue }));
    private handleModifierChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    private handleSizeChange = handleStringChange(size => this.setState({ size }));

    public render() {
        const { size, hasValue, intent, value } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Spinner
                    intent={intent}
                    large={size === Classes.LARGE}
                    small={size === Classes.SMALL}
                    value={hasValue ? value : null}
                />
            </Example>
        );
    }

    private renderOptions() {
        const { size, hasValue, intent, value } = this.state;
        return (
            <>
                <Switch checked={hasValue} label="Known Value" onChange={this.handleIndeterminateChange} />
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
                <IntentSelect intent={intent} onChange={this.handleModifierChange} />
                <Label text="Size">
                    <div className={Classes.SELECT}>
                        <select value={size} onChange={this.handleSizeChange}>
                            {SIZES.map((opt, i) => <option key={i} {...opt} />)}
                        </select>
                    </div>
                </Label>
            </>
        );
    }

    private renderLabel = (value: number) => value.toFixed(1);

    private handleValueChange = (value: number) => this.setState({ value });
}
