/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import * as React from "react";

export interface IFileMenuProps {
    shouldDismissPopover?: boolean;
}

export const FileMenu: React.SFC<IFileMenuProps> = props => (
    <Menu>
        <MenuItem text="New" iconName="document" {...props} />
        <MenuItem text="Open" iconName="folder-shared" {...props} />
        <MenuItem text="Close" iconName="add-to-folder" {...props} />
        <MenuDivider />
        <MenuItem text="Save" iconName="floppy-disk" {...props} />
        <MenuItem text="Save as..." iconName="floppy-disk" {...props} />
        <MenuDivider />
        <MenuItem text="Exit" iconName="cross" {...props} />
    </Menu>
);
