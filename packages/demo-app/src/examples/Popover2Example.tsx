/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";

import { ExampleCard } from "./ExampleCard";

const textEditorMenu = (
    <Menu>
        <MenuDivider title="Edit" />
        <MenuItem icon="cut" text="Cut" label="⌘X" />
        <MenuItem icon="duplicate" text="Copy" label="⌘C" />
        <MenuItem icon="clipboard" text="Paste" label="⌘V" />
        <MenuDivider title="Text" />
        <MenuItem icon="align-left" text="Alignment">
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
    </Menu>
);

const PopoverExample = function () {
    return (
        <div className="example-row">
            <ExampleCard label="Popover2" subLabel="Text content" width={200}>
                <Popover2
                    content={
                        <div style={{ minWidth: 100 }}>
                            <em>This popover is always open.</em>
                        </div>
                    }
                    fill={true}
                    isOpen={true}
                    placement="right"
                    popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                >
                    <Button fill={true} text="Always open" rightIcon="caret-right" />
                </Popover2>
            </ExampleCard>
            <ExampleCard label="Popover2" subLabel="Dropdown menu" width={200}>
                <Popover2 content={textEditorMenu} fill={true} placement="bottom-start" minimal={true}>
                    <Button fill={true} text="Click to open" rightIcon="caret-down" />
                </Popover2>
            </ExampleCard>
        </div>
    );
};
PopoverExample.displayName = "DemoApp.PopoverExample";

export { PopoverExample };
