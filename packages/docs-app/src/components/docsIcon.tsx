/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { ContextMenuTarget, Icon, IconName, Menu, MenuItem } from "@blueprintjs/core";

import { ClickToCopy } from "./clickToCopy";

export interface IDocsIconProps {
    displayName: string;
    group: string;
    iconName: IconName;
    tags: string;
}

const GITHUB_PATH = "https://github.com/palantir/blueprint/blob/develop/resources/icons";
function openIconFile(iconName: IconName, iconSize: 16 | 20) {
    window.open(`${GITHUB_PATH}/${iconSize}px/${iconName}.svg`);
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
                    <div className="pt-text-muted">Right-click to download</div>
                    <div className="docs-clipboard-message pt-text-muted" data-hover-message="Click to copy name" />
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

    private handleClick16 = () => openIconFile(this.props.iconName, 16);
    private handleClick20 = () => openIconFile(this.props.iconName, 20);
}
