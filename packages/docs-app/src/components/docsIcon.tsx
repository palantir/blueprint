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

import { Classes, ContextMenuTarget, Icon, IconName, Menu, MenuItem } from "@blueprintjs/core";
import classNames from "classnames";
import download from "downloadjs";
import * as React from "react";
import { ClickToCopy } from "./clickToCopy";

export interface IDocsIconProps {
    displayName: string;
    group: string;
    iconName: IconName;
    tags: string;
}

const GITHUB_RAW_PATH = "https://raw.githubusercontent.com/palantir/blueprint/develop/resources/icons";
function downloadIconFile(iconName: IconName, iconSize: 16 | 20) {
    download(`${GITHUB_RAW_PATH}/${iconSize}px/${iconName}.svg`);
}

@ContextMenuTarget
export class DocsIcon extends React.PureComponent<IDocsIconProps, {}> {
    public render() {
        const { iconName, displayName, tags } = this.props;
        return (
            <ClickToCopy className="docs-icon" data-tags={tags} value={iconName}>
                <Icon icon={iconName} iconSize={Icon.SIZE_LARGE} />
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
        );
    }

    public renderContextMenu() {
        const { iconName } = this.props;
        return (
            <Menu>
                <MenuItem
                    icon={<Icon icon={iconName} iconSize={Icon.SIZE_STANDARD} />}
                    text="Download 16px SVG"
                    onClick={this.handleClick16}
                />
                <MenuItem
                    icon={<Icon icon={iconName} iconSize={Icon.SIZE_LARGE} />}
                    text="Download 20px SVG"
                    onClick={this.handleClick20}
                />
            </Menu>
        );
    }

    private handleClick16 = () => downloadIconFile(this.props.iconName, 16);
    private handleClick20 = () => downloadIconFile(this.props.iconName, 20);
}
