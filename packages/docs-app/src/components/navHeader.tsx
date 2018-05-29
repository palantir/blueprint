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
        if (versions.length === 1) {
            return (
                <div className={Classes.TEXT_MUTED} key="_versions">
                    v{versions[0].version}
                </div>
            );
        }

        const match = /docs\/v([0-9]+)/.exec(location.href);
        // default to latest release if we can't find a major version in the URL
        const currentRelease = match == null ? versions[0].version : match[1];
        const releaseItems = versions.map((rel, i) => <MenuItem key={i} href={rel.url} text={rel.version} />);
        const menu = <Menu className="docs-version-list">{releaseItems}</Menu>;

        return (
            <Popover content={menu} position={Position.BOTTOM} key="_versions">
                <Tag interactive={true} minimal={true} round={true}>
                    v{currentRelease.split(".", 1)} <Icon icon="caret-down" />
                </Tag>
            </Popover>
        );
    }

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    };
}
