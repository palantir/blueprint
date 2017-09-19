/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Checkbox, Classes, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleStringChange } from "@blueprintjs/docs";

export class CheckboxExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <label className={Classes.LABEL}>Assign responsibility</label>
                <Checkbox label="Gilad Gray" defaultIndeterminate={true} />
                <Checkbox label="Jason Killian" />
                <Checkbox label="Antoine Llorca" />
            </div>
        );
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SwitchExample extends BaseExample<IRadioExampleState> {
    protected renderExample() {
        return (
            <div>
                <label className={Classes.LABEL}>Privacy setting</label>
                <Switch labelElement={<strong>Enabled</strong>} />
                <Switch labelElement={<em>Public</em>} />
                <Switch labelElement={<u>Cooperative</u>} defaultChecked={true} />
                <small>
                    This example uses <code>labelElement</code> to demonstrate JSX labels.
                </small>
            </div>
        );
    }
}

export interface IRadioExampleState {
    radioValue?: string;
}

// tslint:disable-next-line:max-classes-per-file
export class RadioExample extends BaseExample<IRadioExampleState> {
    public state: IRadioExampleState = {};

    private handleRadioChange = handleStringChange(radioValue => this.setState({ radioValue }));

    protected renderExample() {
        return (
            <RadioGroup
                label="Determine lunch"
                name="group"
                onChange={this.handleRadioChange}
                selectedValue={this.state.radioValue}
            >
                <Radio label="Soup" value="one" />
                <Radio label="Salad" value="two" />
                <Radio label="Sandwich" value="three" />
            </RadioGroup>
        );
    }
}
