/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Radio, RadioGroup } from "@blueprintjs/core";
import { IDateFormatter } from "@blueprintjs/datetime";
import { handleNumberChange } from "@blueprintjs/docs-theme";
import * as moment from "moment";
import * as React from "react";

export interface IFormatSelectProps {
    /** Selected formatter. */
    format: IDateFormatter;

    /** The callback to fire when a new formatter is chosen. */
    onChange: (formatter: IDateFormatter) => void;
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

export const FORMATS: IDateFormatter[] = [
    {
        dateToString: date => (date == null ? "" : date.toLocaleDateString()),
        placeholder: "JS Date",
        stringToDate: str => new Date(Date.parse(str)),
    },
    momentFormatter("MM/DD/YYYY"),
    momentFormatter("YYYY-MM-DD"),
    momentFormatter("YYYY-MM-DD HH:mm:ss"),
    {
        dateToString: date => moment(date).fromNow(),
        placeholder: "from now (moment)",
        stringToDate: str => moment(str).toDate(),
    },
];

function momentFormatter(format: string): IDateFormatter {
    return {
        dateToString: date => moment(date).format(format),
        placeholder: `${format} (moment)`,
        stringToDate: str => moment(str, format).toDate(),
    };
}
