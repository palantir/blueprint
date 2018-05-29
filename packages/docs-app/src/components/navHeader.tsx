/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Classes,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    Icon,
    Menu,
    MenuItem,
    NavbarHeading,
    Popover,
    Position,
    Tag,
} from "@blueprintjs/core";
import { IPackageInfo } from "@blueprintjs/docs-data";
import { NavButton } from "@blueprintjs/docs-theme";
import * as React from "react";
import { Logo } from "./logo";

export interface INavHeaderProps {
    onToggleDark: (useDark: boolean) => void;
    useDarkTheme: boolean;
    versions: IPackageInfo[];
}

@HotkeysTarget
export class NavHeader extends React.PureComponent<INavHeaderProps, {}> {
    public render() {
        const { useDarkTheme } = this.props;
        return (
            <>
                <div className="docs-nav-title">
                    <a className="docs-logo" href="/">
                        <Logo />
                    </a>
                    <div>
                        <NavbarHeading className="docs-heading">
                            <span>Blueprint</span> {this.renderVersionsMenu()}
                        </NavbarHeading>
                        <a className={Classes.TEXT_MUTED} href="https://github.com/palantir/blueprint" target="_blank">
                            <small>View on GitHub</small>
                        </a>
                    </div>
                </div>
                <div className="docs-nav-divider" />
                <NavButton
                    icon={useDarkTheme ? "flash" : "moon"}
                    hotkey="shift + d"
                    text={useDarkTheme ? "Light theme" : "Dark theme"}
                    onClick={this.handleDarkSwitchChange}
                />
            </>
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

    private renderVersionsMenu() {
        const { versions } = this.props;
        return (
            <Popover position={Position.BOTTOM} key="_versions">
                <Tag interactive={true} minimal={true} round={true}>
                    v{versions[0].version.split(".", 1)} <Icon icon="caret-down" />
                </Tag>
                <Menu className="docs-version-list">
                    <MenuItem text="View latest version" href="/docs" />
                </Menu>
            </Popover>
        );
    }

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    };
}
