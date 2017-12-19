/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    AnchorButton,
    Classes,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    Menu,
    MenuDivider,
    MenuItem,
    Popover,
    Position,
} from "@blueprintjs/core";
import { IPackageInfo } from "@blueprintjs/docs-data";

import * as classNames from "classnames";
import * as React from "react";

export interface INavbarActionsProps {
    onToggleDark: (useDark: boolean) => void;
    releases: IPackageInfo[];
    useDarkTheme: boolean;
}

@HotkeysTarget
export class NavbarActions extends React.PureComponent<INavbarActionsProps, {}> {
    public render() {
        return (
            <div className={classNames(Classes.BUTTON_GROUP, Classes.MINIMAL)}>
                <AnchorButton href="https://github.com/palantir/blueprint" target="_blank" text="GitHub" />
                <Popover inline={true} content={this.renderReleasesMenu()} position={Position.BOTTOM_RIGHT}>
                    <AnchorButton rightIconName="caret-down" text="Releases" />
                </Popover>
                <AnchorButton
                    className="docs-dark-switch"
                    onClick={this.handleDarkSwitchChange}
                    iconName={this.props.useDarkTheme ? "flash" : "moon"}
                />
            </div>
        );
    }

    public renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey
                    global={true}
                    combo="shift + d"
                    label="Toggle dark theme"
                    onKeyDown={this.handleDarkSwitchChange}
                />
            </Hotkeys>
        );
    }

    /**
     * Render a list of the latest artifacts versions.
     * Also include a link to the GitHub release notes.
     */
    private renderReleasesMenu() {
        const menuItems = this.props.releases.map((version: IPackageInfo, index: number) => (
            <MenuItem href={version.url} key={index} label={version.version} target="_blank" text={version.name} />
        ));
        return (
            <Menu>
                <MenuItem
                    href="https://github.com/palantir/blueprint/releases"
                    iconName="book"
                    target="_blank"
                    text="Release notes"
                />
                <MenuDivider />
                {menuItems}
            </Menu>
        );
    }

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    };
}
