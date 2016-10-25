/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprint/core";
import * as React from "react";

import BaseExample from "./baseExample";

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
