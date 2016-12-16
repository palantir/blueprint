/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Dropdown, Position } from "@blueprintjs/core";
import * as React from "react";
import BaseExample from "./common/baseExample";
import * as mocks from "./mocks/mockDropdownItems";

export class DropdownExample extends BaseExample<{}> {
    protected renderExample() {
        const optionGroupsPopoverProps = {
            popoverClassName: "docs-dropdown-ramen-popover",
            position: Position.RIGHT_TOP,
        };

        return (
            <div>
                <label className="pt-label">
                    <h5>Simple options</h5>
                    <Dropdown
                        items={mocks.simple()}
                        placeholder="Chart type"
                        popoverProps={{ position: Position.RIGHT_TOP }}
                    />
                </label>
                <label className="pt-label">
                    <h5>Option groups</h5>
                    <Dropdown
                        items={mocks.groups()}
                        placeholder="Ramen joint"
                        popoverProps={optionGroupsPopoverProps}
                    />
                </label>
            </div>
        );
    }
}
