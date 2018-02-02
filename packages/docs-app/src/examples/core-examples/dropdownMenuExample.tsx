/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

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
                <Button iconName="share" text="Open in..." />
            </Popover>
        );
    }
}
