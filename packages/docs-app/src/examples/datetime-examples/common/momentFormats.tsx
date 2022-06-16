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

import moment from "moment";
import * as React from "react";

import { DateFormatProps } from "@blueprintjs/datetime";

import { DateFormatSelector, DateFormatSelectorProps } from "../../../common/dateFormatSelector";

export const MomentFormatSelector: React.FC<Omit<DateFormatSelectorProps, "formatOptions">> = props => {
    return (
        <DateFormatSelector
            formatOptions={MOMENT_FORMATS}
            label={
                <span>
                    <a href="https://momentjs.com/">Moment.js</a> format
                </span>
            }
            {...props}
        />
    );
};

export const MOMENT_FORMATS: DateFormatProps[] = [
    {
        formatDate: date => date?.toLocaleDateString() ?? "",
        parseDate: str => new Date(Date.parse(str)),
        placeholder: "JS Date",
    },
    getMomentFormatter("MM/DD/YYYY"),
    getMomentFormatter("YYYY-MM-DD"),
    getMomentFormatter("YYYY-MM-DD HH:mm:ss"),
];

function getMomentFormatter(format: string): DateFormatProps {
    return {
        formatDate: date => moment(date).format(format),
        parseDate: str => moment(str, format).toDate(),
        placeholder: `${format}`,
    };
}
