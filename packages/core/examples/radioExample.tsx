/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Radio, RadioGroup } from "@blueprintjs/core";
import { BaseExample, handleStringChange } from "@blueprintjs/docs";

export interface IRadioExampleState {
    radioValue?: string;
}

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
