/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Icon, Intent, IProps, Tag } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";
import classNames from "classnames";
import moment from "moment";
import * as React from "react";

const FORMAT = "dddd, LL";

export const MomentDate: React.SFC<{ date: Date; format?: string }> = ({ date, format = FORMAT }) => {
    const m = moment(date);
    if (m.isValid()) {
        return <Tag intent={Intent.PRIMARY}>{m.format(format)}</Tag>;
    } else {
        return <Tag className={Classes.MINIMAL}>no date</Tag>;
    }
};

export const MomentDateRange: React.SFC<{ range: DateRange; format?: string } & IProps> = ({
    className,
    range: [start, end],
    format = FORMAT,
}) => (
    <div className={classNames("docs-date-range", className)}>
        <MomentDate date={start} format={format} />
        <Icon icon="arrow-right" />
        <MomentDate date={end} format={format} />
    </div>
);
