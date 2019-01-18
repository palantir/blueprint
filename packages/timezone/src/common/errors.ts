/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const ns = "[Blueprint]";

export const TIMEZONE_PICKER_WARN_TOO_MANY_CHILDREN =
    ns +
    ` <TimezonePicker> supports up to one child; additional children are ignored.` +
    ` If a child is present, it it will be rendered in place of the default button target.`;
