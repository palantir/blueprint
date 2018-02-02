/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export class MenuExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <Menu className={`docs-inline-example ${Classes.ELEVATION_1}`}>
                    <MenuItem icon="new-text-box" text="New text box" />
                    <MenuItem icon="new-object" text="New object" />
                    <MenuItem icon="new-link" text="New link" />
                    <MenuDivider />
                    <MenuItem icon="cog" label={<Icon icon="share" />} text="Settings..." />
                </Menu>
                <Menu className={`docs-inline-example ${Classes.ELEVATION_1}`}>
                    <MenuDivider title="Edit" />
                    <MenuItem icon="cut" text="Cut" label="⌘X" />
                    <MenuItem icon="duplicate" text="Copy" label="⌘C" />
                    <MenuItem icon="clipboard" text="Paste" label="⌘V" disabled={true} />
                    <MenuDivider title="Text" />
                    <MenuItem disabled={true} icon="align-left" text="Alignment">
                        <MenuItem icon="align-left" text="Left" />
                        <MenuItem icon="align-center" text="Center" />
                        <MenuItem icon="align-right" text="Right" />
                        <MenuItem icon="align-justify" text="Justify" />
                    </MenuItem>
                    <MenuItem icon="style" text="Style">
                        <MenuItem icon="bold" text="Bold" />
                        <MenuItem icon="italic" text="Italic" />
                        <MenuItem icon="underline" text="Underline" />
                    </MenuItem>
                    <MenuItem icon="asterisk" text="Miscellaneous">
                        <MenuItem icon="badge" text="Badge" />
                        <MenuItem icon="book" text="Book" />
                        <MenuItem icon="more" text="More">
                            <MenuItem icon="briefcase" text="Briefcase" />
                            <MenuItem icon="calculator" text="Calculator" />
                            <MenuItem icon="dollar" text="Dollar" />
                            <MenuItem icon="dot" text="Shapes">
                                <MenuItem icon="full-circle" text="Full circle" />
                                <MenuItem icon="heart" text="Heart" />
                                <MenuItem icon="ring" text="Ring" />
                                <MenuItem icon="square" text="Square" />
                            </MenuItem>
                        </MenuItem>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}
