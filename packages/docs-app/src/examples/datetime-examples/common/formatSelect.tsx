/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Radio, RadioGroup } from "@blueprintjs/core";
import { IDateFormatProps } from "@blueprintjs/datetime";
import { handleNumberChange } from "@blueprintjs/docs-theme";
import moment from "moment";
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
];

function momentFormatter(format: string): IDateFormatProps {
    return {
        formatDate: date => moment(date).format(format),
        parseDate: str => moment(str, format).toDate(),
        placeholder: `${format} (moment)`,
    };
}
