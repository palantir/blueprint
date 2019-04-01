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
