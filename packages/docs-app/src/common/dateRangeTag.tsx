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

import { format } from "date-fns";
import * as React from "react";

import { Tag } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";
import { ArrowRight } from "@blueprintjs/icons";

export interface DateRangeTagProps {
    range: DateRange | null;
    showTime?: boolean;
}

export const DateRangeTag: React.FC<DateRangeTagProps> = ({ range, showTime = false }) => {
    const className = "docs-date-range";

    if (range == null) {
        return <Tag className={className}>No range</Tag>;
    }

    const [start, end] = range;
    const dateFnsFormat = showTime ? "PPPppp" : "PPP";
    const formattedStart = start == null ? "No date" : format(start, dateFnsFormat);
    const formattedEnd = end == null ? "No date" : format(end, dateFnsFormat);

    return (
        <div className="docs-date-range">
            <Tag intent={start == null ? "none" : "primary"}>{formattedStart}</Tag>
            <ArrowRight />
            <Tag intent={end == null ? "none" : "primary"}>{formattedEnd}</Tag>
        </div>
    );
};
