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

import { PropCodeTooltip } from "../../../common/propCodeTooltip";
import { RadioSelect, RadioSelectProps } from "../../../common/RadioSelect";

export const DATE_FNS_FORMAT_OPTIONS: string[] = [
    "MM/dd/yyyy",
    "yyyy-MM-dd",
    "yyyy-MM-dd HH:mm:ss",
    "LLL do, yyyy 'at' K:mm a",
];

export type DateFnsFormatSelectProps = Omit<RadioSelectProps, "label" | "options">;

export const DateFnsFormatSelect: React.FC<DateFnsFormatSelectProps> = props => (
    <RadioSelect
        options={DATE_FNS_FORMAT_OPTIONS}
        label={
            <PropCodeTooltip snippet={`dateFnsFormat="${props.value}"`}>
                <span>
                    <a href="https://date-fns.org/">date-fns</a> format
                </span>
            </PropCodeTooltip>
        }
        {...props}
    />
);
