/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import BaseExample from "@blueprintjs/core/examples/common/baseExample";
import * as React from "react";

import { DateRangeInput } from "../src";

export class DateRangeInputExample extends BaseExample<{}> {
    protected renderExample() {
        return <DateRangeInput />;
    }
}
