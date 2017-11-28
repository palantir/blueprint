/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Radio, RadioGroup } from "@blueprintjs/core";
import { DateFormat } from "@blueprintjs/datetime";
import { keyBy, keys } from "lodash";
import * as moment from "moment";
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

export const FORMATS = keyBy(
    [
        "MM/DD/YYYY",
        "YYYY-MM-DD",
        "YYYY-MM-DD HH:mm:ss",
        {
            dateToString(date: Date) {
                const durationMillis = new Date().getTime() - date.getTime();
                const days = Math.floor(moment.duration(durationMillis).asDays());
                return Math.abs(days) + (days >= 0 ? " days ago" : " days from now");
            },
            stringToDate(str: string) {
                const parts = str.split(/\s+/);
                if (parts.length < 3) {
                    return undefined;
                }
                if (parts[1].toLowerCase() !== "days") {
                    return undefined;
                }
                const numDays = +parts[0];
                if (isNaN(numDays)) {
                    return undefined;
                }

                if (parts[2].toLowerCase() === "ago") {
                    return moment()
                        .subtract(numDays, "days")
                        .toDate();
                } else if (
                    parts.length === 4 &&
                    parts[2].toLowerCase() === "from" &&
                    parts[3].toLowerCase() === "now"
                ) {
                    return moment()
                        .add(numDays, "days")
                        .toDate();
                }
                return undefined;
            },
            placeholder: "custom",
        },
    ],
    asString,
);

function asString(format: DateFormat) {
    return typeof format === "string" ? format : format.placeholder || "unnamed";
}

export const FormatSelect: React.SFC<IFormatSelectProps> = props => (
    <RadioGroup label="Date format" onChange={props.onChange} selectedValue={props.selectedValue}>
        {keys(FORMATS).map(value => <Radio key={value} label={value} value={value} />)}
    </RadioGroup>
);
