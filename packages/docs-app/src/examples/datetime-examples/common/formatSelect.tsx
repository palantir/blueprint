/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Radio, RadioGroup } from "@blueprintjs/core";
import { IDateFormatProps } from "@blueprintjs/datetime";
import { handleNumberChange } from "@blueprintjs/docs-theme";
import * as moment from "moment";
import * as React from "react";

export interface IFormatSelectProps {
    /** Selected formatter. */
    format: IDateFormatProps;

    /** The callback to fire when a new formatter is chosen. */
    onChange: (format: IDateFormatProps) => void;
}

export class FormatSelect extends React.PureComponent<IFormatSelectProps> {
    private handleChange = handleNumberChange(index => this.props.onChange(FORMATS[index]));

    public render() {
        const value = FORMATS.indexOf(this.props.format);
        return (
            <RadioGroup label="Date format" onChange={this.handleChange} selectedValue={value}>
                {FORMATS.map((format, index) => <Radio key={index} label={format.placeholder} value={index} />)}
            </RadioGroup>
        );
    }
}

export const FORMATS: IDateFormatProps[] = [
    {
        formatDate: date => (date == null ? "" : date.toLocaleDateString()),
        parseDate: str => new Date(Date.parse(str)),
        placeholder: "JS Date",
    },
    momentFormatter("MM/DD/YYYY"),
    momentFormatter("YYYY-MM-DD"),
    momentFormatter("YYYY-MM-DD HH:mm:ss"),
    {
        formatDate: date => moment(date).fromNow(),
        parseDate: str => moment(str).toDate(),
        placeholder: "from now (moment)",
    },
];

function momentFormatter(format: string): IDateFormatProps {
    return {
        format,
        formatDate: (date, fmt, locale) =>
            moment(date)
                .locale(locale)
                .format(fmt),
        parseDate: (str, fmt, locale) =>
            moment(str, fmt)
                .locale(locale)
                .toDate(),
        placeholder: `${format} (moment)`,
    };
}
