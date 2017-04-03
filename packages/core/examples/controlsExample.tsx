/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Checkbox, Classes, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleStringChange } from "@blueprintjs/docs";

export interface IControlsExampleState {
    radioValue?: string;
}

export class ControlsExample extends BaseExample<IControlsExampleState> {
    public state: IControlsExampleState = {};

    private handleRadioChange = handleStringChange((radioValue) => this.setState({ radioValue }));

    protected renderExample() {
        return <div className="docs-react-example-row">
            <div className="docs-react-example-column">
                <label className={Classes.LABEL}>Checkboxes</label>
                <Checkbox label="Gilad Gray" defaultIndeterminate />
                <Checkbox label="Jason Killian" />
                <Checkbox label="Antoine Llorca" />
            </div>
            <div className="docs-react-example-column">
                <label className={Classes.LABEL}>Switches</label>
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
