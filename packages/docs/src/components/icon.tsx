/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { ContextMenuTarget, Menu, MenuItem } from "@blueprint/core";

import { ClickToCopy } from "../common/clickToCopy";

export interface IIcon {
    group: string;
    name: string;
    tags: string;
}

export interface IFontIcon extends IIcon {
    className: string;
}

export interface IIconProps {
    icon?: IFontIcon;
}

const GITHUB_PATH = "https://github.com/palantir/blueprint/blob/develop/resources/icons";

@PureRender
@ContextMenuTarget
export class Icon extends React.Component<IIconProps, {}> {
    public render() {
        const { className, name, tags } = this.props.icon;

        return (
            <ClickToCopy className="docs-icon" data-tags={tags} value={className}>
                <span className={classNames("pt-icon-large", className)} />
                <span className="docs-icon-detail">
                    <div className="docs-icon-name">{name}</div>
                    <div className="docs-icon-class-name pt-source-code">{className}</div>
                    <div
                        className="docs-clipboard-message pt-text-muted"
                        data-hover-message="Click to copy"
                    />
                </span>
            </ClickToCopy>
        );
    }

    public renderContextMenu() {
        const { className } = this.props.icon;
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

    private handleClick16 = () => window.open(`${GITHUB_PATH}/16px/${this.props.icon.className}.svg`);

    private handleClick20 = () => window.open(`${GITHUB_PATH}/20px/${this.props.icon.className}.svg`);
}
