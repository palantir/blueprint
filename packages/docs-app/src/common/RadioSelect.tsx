/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import { handleNumberChange } from "@blueprintjs/docs-theme";

export interface RadioSelectProps {
    label?: React.ReactNode;
    onChange: (newValue: string) => void;
    options: string[];
    value: string;
}

export const RadioSelect: React.FC<RadioSelectProps> = props => {
    const handleChange = handleNumberChange(index => {
        props.onChange(props.options[index]);
    });
    const value = props.options.indexOf(props.value);

    return (
        <RadioGroup label={props.label ?? "Date format"} onChange={handleChange} selectedValue={value}>
            {props.options.map((option, index) => (
                <Radio key={index} label={option} value={index} />
            ))}
        </RadioGroup>
    );
};
