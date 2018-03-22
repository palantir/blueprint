/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IDateFormatProps } from "../../src/dateFormat";

export const DATE_FORMAT: IDateFormatProps = {
    formatDate: date => [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/"),
    parseDate: str => new Date(str),
    placeholder: "M/D/YYYY",
};
