/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Dropdown } from "@blueprintjs/core";
import * as React from "react";
import BaseExample from "./common/baseExample";
import * as mocks from "./mocks/mockDropdownItems";

export class DropdownExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <Dropdown items={mocks.simple()} placeholder="Chart type" />
                <Dropdown items={mocks.groups()} placeholder="Ramen" />
            </div>
        );
    }
}
