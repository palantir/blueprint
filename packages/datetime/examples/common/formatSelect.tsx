/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
