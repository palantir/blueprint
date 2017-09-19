/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { ContextMenuTarget, Icon, IconName, Menu, MenuItem } from "@blueprintjs/core";

import { ClickToCopy } from "./clickToCopy";

export interface IDocsIconProps {
    group: string;
    name: string;
    tags: string;
    className: IconName;
}

const GITHUB_PATH = "https://github.com/palantir/blueprint/blob/master/resources/icons";

@ContextMenuTarget
export class DocsIcon extends React.PureComponent<IDocsIconProps, {}> {
    public render() {
        const { className, name, tags } = this.props;
        return (
            <ClickToCopy className="docs-icon" data-tags={tags} value={className}>
                <Icon iconName={className} iconSize={Icon.SIZE_LARGE} />
                <span className="docs-icon-detail">
                    <div className="docs-icon-name">{name}</div>
                    <div className="docs-icon-class-name pt-monospace-text">{className}</div>
                    <div className="docs-clipboard-message pt-text-muted" data-hover-message="Click to copy" />
                </span>
            </ClickToCopy>
        );
    }

    public renderContextMenu() {
        const { className } = this.props;
        return (
            <Menu>
                <MenuItem
                    className="docs-icon-16"
                    iconName={className}
                    text="Download 16px SVG"
                    onClick={this.handleClick16}
                />
                <MenuItem
                    className="docs-icon-20"
                    iconName={className}
                    text="Download 20px SVG"
                    onClick={this.handleClick20}
                />
            </Menu>
        );
    }

    private handleClick16 = () => window.open(`${GITHUB_PATH}/16px/${this.props.className}.svg`);

    private handleClick20 = () => window.open(`${GITHUB_PATH}/20px/${this.props.className}.svg`);
}
