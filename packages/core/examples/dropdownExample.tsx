/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Dropdown } from "@blueprintjs/core";
import BaseExample from "./common/baseExample";

export class DropdownExample extends BaseExample<{}> {
    protected renderExample() {
        const items = {
            default: [
                {
                    id: "foo",
                    text: "Bar",
                },
            ],
        };

        return (
            <Dropdown items={items} />
        );
    }
}
