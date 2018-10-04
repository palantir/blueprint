/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, HTMLSelect } from "@blueprintjs/core";
import { TimePrecision } from "@blueprintjs/datetime";

export interface IPrecisionSelectProps {
    /**
     * The precision-string option to display as selected.
     */
    value: TimePrecision | "none" | undefined;

    /**
     * The callback to fire when the selected value changes.
     */
    onChange: (event: React.FormEvent<HTMLElement>) => void;

    /**
     * Whether or not to allow a `"none"` option.
     */
    allowNone?: boolean;

    /**
     * Label to show over the dropdown of precisions.
     * @default "Precision"
     */
    label?: string;
}

export const PrecisionSelect: React.SFC<IPrecisionSelectProps> = props => (
    <label className={Classes.LABEL}>
        {props.label || "Precision"}
        <HTMLSelect value={props.value} onChange={props.onChange}>
            {props.allowNone && <option value="none">None</option>}
            <option value={TimePrecision.MINUTE}>Minute</option>
            <option value={TimePrecision.SECOND}>Second</option>
            <option value={TimePrecision.MILLISECOND}>Millisecond</option>
        </HTMLSelect>
    </label>
);
