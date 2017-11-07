/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes } from "@blueprintjs/core";
import { TimePickerPrecision } from "@blueprintjs/datetime";

export interface IPrecisionSelectProps {
    /**
     * The precision-string option to display as selected.
     */
    value: TimePickerPrecision;

    /**
     * The callback to fire when the selected value changes.
     */
    onChange: (event: React.FormEvent<HTMLElement>) => void;

    /**
     * Whether or not to allow an empty option.
     */
    allowEmpty?: boolean;

    /**
     * Label to show over the dropdown of precisions.
     * @default "Precision"
     */
    label?: string;
}

export const PrecisionSelect: React.SFC<IPrecisionSelectProps> = props => (
    <label className={Classes.LABEL}>
        {props.label == null ? props.label : "Precision"}
        <div className={Classes.SELECT}>
            <select value={props.value} onChange={props.onChange}>
                {props.allowEmpty ? <option value="-1">None</option> : undefined}
                <option value={TimePickerPrecision.MINUTE.toString()}>Minute</option>
                <option value={TimePickerPrecision.SECOND.toString()}>Second</option>
                <option value={TimePickerPrecision.MILLISECOND.toString()}>Millisecond</option>
            </select>
        </div>
    </label>
);
