/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
