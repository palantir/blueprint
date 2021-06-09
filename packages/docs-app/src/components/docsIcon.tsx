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

import classNames from "classnames";
import download from "downloadjs";
import React from "react";

import { Classes, ContextMenu, ContextMenuChildrenProps, Icon, IconName, Menu, MenuItem } from "@blueprintjs/core";
import { IconSize } from "@blueprintjs/icons";

import { ClickToCopy } from "./clickToCopy";

export interface DocsIconProps {
    displayName: string;
    group: string;
    iconName: IconName;
    tags: string;
    content?: string;
}

const GITHUB_RAW_PATH = "https://raw.githubusercontent.com/palantir/blueprint/develop/resources/icons";
function downloadIconFile(iconName: IconName, iconSize: 16 | 20) {
    download(`${GITHUB_RAW_PATH}/${iconSize}px/${iconName}.svg`);
}

export class DocsIcon extends React.PureComponent<DocsIconProps> {
    public render() {
        const { iconName, displayName, tags } = this.props;
        return (
            <ContextMenu
                content={
                    <Menu>
                        <MenuItem
                            icon={<Icon icon={iconName} size={IconSize.STANDARD} />}
                            text="Download 16px SVG"
                            onClick={this.handleClick16}
                        />
                        <MenuItem
                            icon={<Icon icon={iconName} size={IconSize.LARGE} />}
                            text="Download 20px SVG"
                            onClick={this.handleClick20}
                        />
                    </Menu>
                }
            >
                {(props: ContextMenuChildrenProps) => (
                    <ClickToCopy
                        className={classNames("docs-icon", props.className)}
                        data-tags={tags}
                        onContextMenu={props.onContextMenu}
                        value={iconName}
                    >
                        {props.popover}
                        <Icon icon={iconName} size={IconSize.LARGE} />
                        <div className="docs-icon-name">{displayName}</div>
                        <div className="docs-icon-detail">
                            <p className="docs-code">{iconName}</p>
                            <div className={Classes.TEXT_MUTED}>Right-click to download</div>
                            <div
                                className={classNames("docs-clipboard-message", Classes.TEXT_MUTED)}
                                data-hover-message="Click to copy name"
                            />
                        </div>
                    </ClickToCopy>
                )}
            </ContextMenu>
        );
    }

    private handleClick16 = () => downloadIconFile(this.props.iconName, 16);

    private handleClick20 = () => downloadIconFile(this.props.iconName, 20);
}
