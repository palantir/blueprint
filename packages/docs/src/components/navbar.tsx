/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
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
} from "@blueprint/core";

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { IPackageInfo } from "./styleguide";

export interface INavbarProps {
    onToggleDark: (useDark: boolean) => void;
    releases: IPackageInfo[];
    useDarkTheme: boolean;
}

/* tslint:disable-next-line:max-line-length */
const NPM_URL_BASE = "https://www.npmjs.com/package";

@PureRender
@HotkeysTarget
export class Navbar extends React.Component<INavbarProps, {}> {
    public render() {
        return (
            <div className="docs-navbar">
                <div className="pt-navbar-group pt-align-left">
                    {this.props.children}
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <div className={classNames(Classes.BUTTON_GROUP, Classes.MINIMAL)}>
                        <AnchorButton
                            href="https://github.com/palantir/blueprint"
                            target="_blank"
                            text="GitHub"
                        />
                        <Popover content={this.renderReleasesMenu()} position={Position.BOTTOM_RIGHT}>
                            <AnchorButton rightIconName="caret-down" text="Releases" />
                        </Popover>
                        <AnchorButton
                            className="docs-dark-switch"
                            onClick={this.handleDarkSwitchChange}
                            iconName={this.props.useDarkTheme ? "flash" : "moon"}
                        />
                    </div>
                </div>
            </div>
        );
    }

    public renderHotkeys() {
        return <Hotkeys>
            <Hotkey
                global={true}
                combo="shift + d"
                label="Toggle dark theme"
                onKeyDown={this.handleDarkSwitchChange}
            />
        </Hotkeys>;
    }

    /**
     * Render a list of the latest artifacts versions, including links to them on Stash and Artifactory.
     * Also include a link to the GitHub release notes.
     */
    private renderReleasesMenu() {
        const menuItems = this.props.releases.map((version: IPackageInfo, index: number) => (
            <MenuItem
                href={`${NPM_URL_BASE}/${version.name}`}
                key={index}
                label={version.version}
                target="_blank"
                text={version.name}
            />
        ));
        return (
            <Menu>
                <MenuItem
                    href="https://github.com/palantir/blueprint/releases"
                    iconName="book"
                    target="_blank"
                    text="Release Notes"
                />
                <MenuDivider />
                {menuItems}
            </Menu>
        );
    }

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    }
}

function handleVersionChange(release: string) {
    return () => location.href = `https://palantir.github.io/blueprint/${release}`;
}

export const NavbarLeft: React.SFC<{ versions: string[] }> = ({ versions }) => {
    const match = /releases\/([^\/]+)\/build/.exec(location.href);
    // default to latest release if we can't find a tag in the URL
    const currentRelease = (match == null ? versions[0] : match[1]);
    const releaseItems = versions.map((rel, i) => (
        <MenuItem key={i} onClick={handleVersionChange(rel)} text={rel} />
    ));
    const menu = <Menu className="docs-version-list">{releaseItems}</Menu>;

    return (
        <div className="pt-navbar-group">
            <div className="docs-logo" />
            <div className="pt-navbar-heading">
                Blueprint
                <Popover content={menu} position={Position.BOTTOM}>
                    <button className="docs-version-selector pt-text-muted">
                        v{currentRelease} <span className="pt-icon-standard pt-icon-caret-down" />
                    </button>
                </Popover>
            </div>
        </div>
    );
};
