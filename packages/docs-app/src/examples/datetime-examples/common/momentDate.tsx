/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Icon, Intent, IProps, Tag } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";
import classNames from "classnames";
import moment from "moment";
import * as React from "react";

const FORMAT = "dddd, LL";
const FORMAT_TIME = "dddd, LL LT";

export const MomentDate: React.SFC<{ date: Date; format?: string; withTime?: boolean }> = ({
    date,
    withTime = false,
    format = withTime ? FORMAT_TIME : FORMAT,
}) => {
    const m = moment(date);
    if (m.isValid()) {
        return <Tag intent={Intent.PRIMARY}>{m.format(format)}</Tag>;
    } else {
        return <Tag minimal={true}>no date</Tag>;
    }
};

export const MomentDateRange: React.SFC<{ range: DateRange; format?: string; withTime?: boolean } & IProps> = ({
    className,
    range: [start, end],
    withTime = false,
    format = withTime ? FORMAT_TIME : FORMAT,
}) => (
    <div className={classNames("docs-date-range", className)}>
        <MomentDate withTime={withTime} date={start} format={format} />
        <Icon icon="arrow-right" />
        <MomentDate withTime={withTime} date={end} format={format} />
    </div>
);
