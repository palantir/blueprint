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

/* eslint-disable deprecation/deprecation, @blueprintjs/no-deprecated-components */

import * as React from "react";

import { Classes, Icon, Menu, MenuDivider, MenuItem, MenuSection } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

export class MenuExample extends React.PureComponent<ExampleProps> {
    public render() {
        return (
            <Example className="docs-menu-example" options={false} {...this.props}>
                <Menu className={Classes.ELEVATION_1}>
                    <MenuItem icon={<PalantirLogo />} text="Custom SVG icon" />
                    <MenuDivider />
                    <MenuItem icon="new-text-box" text="New text box" />
                    <MenuItem icon="new-object" text="New object" />
                    <MenuItem icon="new-link" text="New link" />
                    <MenuDivider />
                    <MenuItem icon="cog" labelElement={<Icon icon="share" />} text="Settings..." intent="primary" />
                </Menu>
                <Menu className={Classes.ELEVATION_1} noPadding={true}>
                    <MenuSection sectionTitle="Edit" items={[
                        {
                            id: "cut",
                            icon: "cut",
                            text: "Cut",
                            label:"⌘X"
                        },
                        {
                            id: "duplicate",
                            icon: "duplicate",
                            text: "Copy",
                            label:"⌘C"
                        },
                        {
                            id: "clipboard",
                            icon: "clipboard",
                            text: "Paste",
                            label:"⌘V",
                            disabled: true,
                        }
                    ]} />
                    <MenuSection sectionTitle="Text" items={[
                        {
                            id: "align-left",
                            icon: "align-left",
                            text: "Left",
                            indent: true
                        },
                        {
                            id: "align-center",
                            icon: "align-center",
                            text: "Center",
                            indent: true
                        },
                        {
                            id: "align-right",
                            icon: "align-right",
                            text: "Right",
                            showTick: true
                        },
                        {
                            id: "align-justify",
                            icon: "align-justify",
                            text: "Justify",
                            disabled: true,
                            indent: true
                        }
                    ]} />
                    <MenuSection sectionTitle="Style" items={[
                        {
                            id: "style",
                            icon: "style",
                            text: "Style",
                            children: (
                                <>
                                    <MenuItem showTick={true} icon="bold" text="Bold" />
                                    <MenuItem indent={true} icon="italic" text="Italic" />
                                    <MenuItem indent={true} icon="underline" text="Underline" />
                                </>
                            )
                        },
                        {
                            id: "asterisk",
                            icon: "asterisk",
                            text: "Miscellaneous",
                            children: (
                                <>
                                    <MenuItem icon="badge" text="Badge" />
                                    <MenuItem icon="book" text="Long items will truncate when they reach max-width" />
                                    <MenuItem icon="more" text="Look in here for even more items">
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
                                </>
                            )
                        },
                    ]} />
                </Menu>
            </Example>
        );
    }
}

const PalantirLogo: React.FC = () => (
    <svg className={Classes.ICON} width="16" height="16" viewBox="0 0 18 23" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.718 16.653L9 20.013l-7.718-3.36L0 19.133 9 23l9-3.868-1.282-2.48zM9 14.738c-3.297 0-5.97-2.696-5.97-6.02C3.03 5.39 5.703 2.695 9 2.695c3.297 0 5.97 2.696 5.97 6.02 0 3.326-2.673 6.022-5.97 6.022zM9 0C4.23 0 .366 3.9.366 8.708c0 4.81 3.865 8.71 8.634 8.71 4.77 0 8.635-3.9 8.635-8.71C17.635 3.898 13.77 0 9 0z"
            fillRule="evenodd"
        />
    </svg>
);
