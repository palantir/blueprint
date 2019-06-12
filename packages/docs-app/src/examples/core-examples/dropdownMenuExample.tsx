/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
