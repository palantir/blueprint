/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Menu, MenuDivider, MenuItem, Popover, Position } from "../src";
import BaseExample from "./common/baseExample";

export class DropdownMenuExample extends BaseExample<{}> {
    protected renderExample() {
        const compassMenu = (
            <Menu>
                <MenuItem iconName="graph" text="Graph" />
                <MenuItem iconName="map" text="Map" />
                <MenuItem iconName="th" text="Table" shouldDismissPopover={false} />
                <MenuItem iconName="zoom-to-fit" text="Nucleus" disabled={true} />
                <MenuDivider />
                <MenuItem iconName="cog" text="Settings...">
                    <MenuItem iconName="add" text="Add new application" disabled={true} />
                    <MenuItem iconName="remove" text="Remove application" />
                </MenuItem>
            </Menu>
        );
        return (
            <Popover content={compassMenu} position={Position.RIGHT_BOTTOM}>
                <button className="pt-button pt-icon-share" type="button">Open in...</button>
            </Popover>
        );
    }
}
