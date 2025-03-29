/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, Button, Card, Menu, MenuDivider, MenuItem, Popover } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export const DropdownMenuExample: React.FC<ExampleProps> = props => {
    return (
        <Example options={false} {...props}>
            <Card style={{ width: 250 }}>
                <Popover content={<ExampleMenu />} fill={true} placement="bottom">
                    <Button
                        alignText={Alignment.START}
                        endIcon={IconNames.CARET_DOWN}
                        fill={true}
                        icon={IconNames.APPLICATION}
                        text="Open with..."
                    />
                </Popover>
            </Card>
        </Example>
    );
};

const ExampleMenu: React.FC = () => (
    <Menu>
        <MenuItem icon={IconNames.GRAPH} text="Graph" />
        <MenuItem icon={IconNames.MAP} text="Map" />
        <MenuItem icon={IconNames.TH} shouldDismissPopover={false} text="Table" />
        <MenuItem disabled={true} icon={IconNames.ZOOM_TO_FIT} text="Browser" />
        <MenuDivider />
        <MenuItem icon={IconNames.COG} text="Settings...">
            <MenuItem disabled={true} icon={IconNames.ADD} text="Add new application" />
            <MenuItem icon={IconNames.REMOVE} text="Remove application" />
        </MenuItem>
    </Menu>
);
