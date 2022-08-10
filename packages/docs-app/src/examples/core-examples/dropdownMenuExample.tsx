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

import { Button, Menu, MenuDivider } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { MenuItem2, Popover2 } from "@blueprintjs/popover2";

export class DropdownMenuExample extends React.PureComponent<IExampleProps> {
    public render() {
        const exampleMenu = (
            <Menu>
                <MenuItem2 icon="graph" text="Graph" />
                <MenuItem2 icon="map" text="Map" />
                <MenuItem2 icon="th" text="Table" shouldDismissPopover={false} />
                <MenuItem2 icon="zoom-to-fit" text="Nucleus" disabled={true} />
                <MenuDivider />
                <MenuItem2 icon="cog" text="Settings...">
                    <MenuItem2 icon="add" text="Add new application" disabled={true} />
                    <MenuItem2 icon="remove" text="Remove application" />
                </MenuItem2>
            </Menu>
        );
        return (
            <Example options={false} {...this.props}>
                <Popover2 content={exampleMenu} placement="right-end">
                    <Button icon="share" text="Open in..." />
                </Popover2>
            </Example>
        );
    }
}
