/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Radio, RadioGroup } from "@blueprintjs/core";
import * as React from "react";

export interface IFormatSelectProps {
    /**
     * The format-string option to display as selected.
     */
    selectedValue: string;

    /**
     * The callback to fire when the selected value changes.
     */
    onChange: (event: React.FormEvent<HTMLElement>) => void;
}

export const FORMATS = ["MM/DD/YYYY", "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss"];

export const FormatSelect: React.SFC<IFormatSelectProps> = props => (
    <RadioGroup label="Date format" onChange={props.onChange} selectedValue={props.selectedValue}>
        {FORMATS.map(value => <Radio key={value} label={value} value={value} />)}
    </RadioGroup>
);
