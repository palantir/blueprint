/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import { format, isValid } from "date-fns";
import * as React from "react";

import { Icon, Intent, Props, Tag } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";

const FORMAT = "EEEE, MMMM d, yyyy";
const FORMAT_WITH_TIME = "MMMM d, yyyy 'at' K:mm a";

export const DateFnsDate: React.FC<{ date: Date; formatStr?: string; withTime?: boolean }> = ({
    date,
    withTime = false,
    formatStr = withTime ? FORMAT_WITH_TIME : FORMAT,
}) => {
    if (isValid(date)) {
        return <Tag intent={Intent.PRIMARY}>{format(date, formatStr)}</Tag>;
    } else {
        return <Tag minimal={true}>no date</Tag>;
    }
};

export const DateFnsDateRange: React.FC<{ range: DateRange; formatStr?: string; withTime?: boolean } & Props> = ({
    className,
    range: [start, end],
    withTime = false,
    formatStr = withTime ? FORMAT_WITH_TIME : FORMAT,
}) => (
    <div className={classNames("docs-date-range", className)}>
        <DateFnsDate withTime={withTime} date={start} formatStr={formatStr} />
        <Icon icon="arrow-right" />
        <DateFnsDate withTime={withTime} date={end} formatStr={formatStr} />
    </div>
);
