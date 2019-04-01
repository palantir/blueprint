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
                {FORMATS.map((format, index) => (
                    <Radio key={index} label={format.placeholder} value={index} />
                ))}
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
