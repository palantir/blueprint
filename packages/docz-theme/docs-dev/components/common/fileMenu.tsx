/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import * as React from "react";

export interface IFileMenuProps extends IProps {
    shouldDismissPopover?: boolean;
}

export const FileMenu: React.SFC<IFileMenuProps> = props => (
    <Menu className={props.className}>
        <MenuItem text="New" icon="document" {...props} />
        <MenuItem text="Open" icon="folder-shared" {...props} />
        <MenuItem text="Close" icon="add-to-folder" {...props} />
        <MenuDivider />
        <MenuItem text="Save" icon="floppy-disk" {...props} />
        <MenuItem text="Save as..." icon="floppy-disk" {...props} />
        <MenuDivider />
        <MenuItem text="Exit" icon="cross" {...props} />
    </Menu>
);
