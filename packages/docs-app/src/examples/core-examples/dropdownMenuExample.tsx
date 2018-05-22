/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export class DropdownMenuExample extends React.PureComponent<IExampleProps> {
    public render() {
        const exampleMenu = (
            <Menu>
                <MenuItem icon="graph" text="Graph" />
                <MenuItem icon="map" text="Map" />
                <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
                <MenuItem icon="zoom-to-fit" text="Nucleus" disabled={true} />
                <MenuDivider />
                <MenuItem icon="cog" text="Settings...">
                    <MenuItem icon="add" text="Add new application" disabled={true} />
                    <MenuItem icon="remove" text="Remove application" />
                </MenuItem>
            </Menu>
        );
        return (
            <Example options={false} {...this.props}>
                <Popover content={exampleMenu} position={Position.RIGHT_BOTTOM}>
                    <Button icon="share" text="Open in..." />
                </Popover>
            </Example>
        );
    }
}
