/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Checkbox, Radio, RadioGroup, Switch } from "@blueprint/core";
import * as React from "react";

import BaseExample, { handleStringChange } from "./baseExample";

interface IControlsExampleState {
    radioValue?: string;
}

export class ControlsExample extends BaseExample<IControlsExampleState> {
    public state: IControlsExampleState = {};

    private handleRadioChange = handleStringChange((radioValue) => this.setState({ radioValue }));

    protected renderExample() {
        return <div className="docs-react-example-row">
            <div className="docs-react-example-column">
                <label className="pt-label">Checkboxes</label>
                <Checkbox label="Gilad Gray" defaultIndeterminate />
                <Checkbox label="Jason Killian" />
                <Checkbox label="Antoine Llorca" />
            </div>
            <div className="docs-react-example-column">
                <label className="pt-label">Switches</label>
                <Switch label="Enabled" />
                <Switch label="Public" />
                <Switch label="Cooperative" defaultChecked />
            </div>
            <div className="docs-react-example-column">
                <RadioGroup
                    label="Radio Group"
                    name="group"
                    onChange={this.handleRadioChange}
                    selectedValue={this.state.radioValue}
                >
                    <Radio label="Soup" value="one" />
                    <Radio label="Salad" value="two" />
                    <Radio label="Sandwich" value="three" />
                </RadioGroup>
            </div>
        </div>;
    }
}
