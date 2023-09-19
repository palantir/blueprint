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

import { Tag } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";
import { ArrowRight } from "@blueprintjs/icons";
import { FormattedDateTag } from "./formattedDateTag";

export interface FormattedDateRange {
    range: DateRange | null;
    showTime?: boolean;
}

export const FormattedDateRange: React.FC<FormattedDateRange> = ({ range, showTime = false }) => {
    if (range == null) {
        return <Tag minimal={true}>No range</Tag>;
    }

    const [start, end] = range;

    return (
        <div className="docs-date-range">
            <FormattedDateTag date={start} showTime={showTime} />
            <ArrowRight />
            <FormattedDateTag date={end} showTime={showTime} />
        </div>
    );
};
