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
