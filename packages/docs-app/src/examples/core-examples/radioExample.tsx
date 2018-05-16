/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Radio, RadioGroup } from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IRadioExampleState {
    radioValue?: string;
}

export class RadioExample extends React.PureComponent<IExampleProps, IRadioExampleState> {
    public state: IRadioExampleState = {};

    private handleRadioChange = handleStringChange(radioValue => this.setState({ radioValue }));

    public render() {
        return (
            <Example options={false} {...this.props}>
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
            </Example>
        );
    }
}
