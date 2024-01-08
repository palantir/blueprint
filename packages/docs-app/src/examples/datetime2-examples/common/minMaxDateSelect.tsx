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

import { add } from "date-fns";
import * as React from "react";

import { FormGroup, HTMLSelect } from "@blueprintjs/core";
import { handleNumberChange } from "@blueprintjs/docs-theme";

interface DateOption {
    label: string;
    value: Date | undefined;
}

const today = new Date();

export interface DateSelectProps {
    label: string;
    onChange: (newDate: Date) => void;
    options: DateOption[];
}

const DateSelect: React.FC<DateSelectProps> = ({ label, onChange, options }) => {
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSelectChange = React.useCallback(
        handleNumberChange(optionIndex => {
            setSelectedOptionIndex(optionIndex);
            onChange(options[optionIndex].value);
        }),
        [onChange, options],
    );

    return (
        <FormGroup label={label}>
            <HTMLSelect value={selectedOptionIndex} onChange={handleSelectChange}>
                {options.map((opt, i) => (
                    <option key={i} value={i} label={opt.label} />
                ))}
            </HTMLSelect>
        </FormGroup>
    );
};

const MIN_DATE_OPTIONS: DateOption[] = [
    { label: "Default (20 years ago)", value: undefined },
    {
        label: "1 week ago",
        value: add(today, { weeks: -1 }),
    },
    {
        label: "4 months ago",
        value: add(today, { months: -4 }),
    },
    {
        label: "1 year ago",
        value: add(today, { years: -1 }),
    },
];

export type MinDateSelectProps = Pick<DateSelectProps, "onChange">;

export const MinDateSelect: React.FC<MinDateSelectProps> = props => (
    <DateSelect label="Minimum date" onChange={props.onChange} options={MIN_DATE_OPTIONS} />
);

const MAX_DATE_OPTIONS: DateOption[] = [
    { label: "Default (6 months from now)", value: undefined },
    {
        label: "Today",
        value: today,
    },
    {
        label: "1 week from now",
        value: add(today, { weeks: 1 }),
    },
    {
        label: "4 months from now",
        value: add(today, { months: 4 }),
    },
    {
        label: "1 year from now",
        value: add(today, { years: 1 }),
    },
];

export const MaxDateSelect: React.FC<MinDateSelectProps> = props => (
    <DateSelect label="Maximum date" onChange={props.onChange} options={MAX_DATE_OPTIONS} />
);
