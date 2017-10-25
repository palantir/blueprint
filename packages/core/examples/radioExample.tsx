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
