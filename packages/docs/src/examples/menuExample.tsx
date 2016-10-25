/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Classes, Menu, MenuDivider, MenuItem } from "@blueprint/core";
import * as React from "react";

import BaseExample from "./baseExample";

export class MenuExample extends BaseExample<{}> {
    protected renderExample() {
        const submenuExample = [
            {iconName: "google", text: "Google"},
            {iconName: "facebook", text: "Facebook"},
            {iconName: "instagram", text: "Instagram"},
            {iconName: "twitter", text: "Twitter"},
            {iconName: "linkedin", text: "LinkedIn"},
        ];

        return (
            <div>
                <Menu className={`docs-inline-example ${Classes.ELEVATION_1}`}>
                    <MenuItem iconName="new-text-box" text="New text box" />
                    <MenuItem iconName="new-object" text="New object" />
                    <MenuItem iconName="new-link" text="New link" />
                    <MenuDivider />
                    <MenuItem
                        iconName="cog"
                        label={<span className="pt-icon-standard pt-icon-share" />}
                        text="Settings..."
                    />
                </Menu>
                <Menu className={`docs-inline-example ${Classes.ELEVATION_1}`}>
                    <MenuDivider title="Edit" />
                    <MenuItem iconName="cut" text="Cut" label="⌘X" />
                    <MenuItem iconName="duplicate" text="Copy" label="⌘C" />
                    <MenuItem iconName="clipboard" text="Paste" label="⌘V" disabled={true} />
                    <MenuDivider title="Text" />
                    <MenuItem iconName="align-left" text="Alignment">
                        <MenuItem iconName="align-left" text="Left" />
                        <MenuItem iconName="align-center" text="Center" />
                        <MenuItem iconName="align-right" text="Right" />
                        <MenuItem iconName="align-justify" text="Justify" />
                    </MenuItem>
                    <MenuItem iconName="style" text="Style">
                        <MenuItem iconName="bold" text="Bold" />
                        <MenuItem iconName="italic" text="Italic" />
                        <MenuItem iconName="underline" text="Underline" />
                    </MenuItem>
                    <MenuItem iconName="asterisk" text="Miscellaneous" submenuViewportMargin={{ left: 240 }}>
                        <MenuItem iconName="badge" text="Badge" />
                        <MenuItem iconName="book" text="Book" />
                        <MenuItem iconName="more" text="More">
                            <MenuItem iconName="briefcase" text="Briefcase" />
                            <MenuItem iconName="calculator" text="Calculator" />
                            <MenuItem iconName="dollar" text="Dollar" />
                            <MenuItem iconName="dot" text="Shapes">
                                <MenuItem iconName="full-circle" text="Full circle" />
                                <MenuItem iconName="heart" text="Heart" />
                                <MenuItem iconName="ring" text="Ring" />
                                <MenuItem iconName="square" text="Square" />
                                <MenuItem iconName="office" submenu={submenuExample} text="Neighbors" />
                            </MenuItem>
                        </MenuItem>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}
