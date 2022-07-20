/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import { DateFormatProps } from "@blueprintjs/datetime";
import { handleNumberChange } from "@blueprintjs/docs-theme";

export interface DateFormatSelectorProps {
    /** Format options */
    formatOptions: DateFormatProps[];

    /** Selected formatter. */
    format: DateFormatProps;

    /**
     * Optional label for the RadioGroup
     *
     * @default "Date format"
     */
    label?: React.ReactNode;

    /** The callback to fire when a new formatter is chosen. */
    onChange: (format: DateFormatProps) => void;
}

export const DateFormatSelector: React.FC<DateFormatSelectorProps> = props => {
    const handleChange = handleNumberChange(index => {
        props.onChange(props.formatOptions[index]);
    });
    const value = props.formatOptions.indexOf(props.format);

    return (
        <RadioGroup label={props.label ?? "Date format"} onChange={handleChange} selectedValue={value}>
            {props.formatOptions.map((format, index) => (
                <Radio key={index} label={format.placeholder} value={index} />
            ))}
        </RadioGroup>
    );
};
