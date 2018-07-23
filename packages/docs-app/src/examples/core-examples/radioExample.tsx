/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Radio, RadioGroup } from "@blueprintjs/core";
import { Example, handleStringChange } from "@blueprintjs/docs-theme";
import { CheckboxExample } from "./checkboxExample";

export class RadioExample extends CheckboxExample {
    private handleRadioChange = handleStringChange(value => this.setState({ value }));

    // See CheckboxExample for options
    protected renderExample() {
        return (
            <Example options={false} {...this.props}>
                <RadioGroup
                    inline={this.state.inline}
                    label="Determine lunch"
                    name="group"
                    onChange={this.handleRadioChange}
                    selectedValue={this.state.value}
                >
                    <Radio {...this.state} label="Soup" value="one" />
                    <Radio {...this.state} label="Salad" value="two" />
                    <Radio {...this.state} label="Sandwich" value="three" />
                </RadioGroup>
            </Example>
        );
    }
}
