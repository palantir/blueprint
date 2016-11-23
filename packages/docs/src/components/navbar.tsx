/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { IPackageInfo } from "./styleguide";

export interface INavbarProps {
    onToggleDark: (useDark: boolean) => void;
    releases: IPackageInfo[];
    useDarkTheme: boolean;
    versions: IPackageInfo[];
}

@PureRender
@HotkeysTarget
export class Navbar extends React.Component<INavbarProps, {}> {
    public render() {
        return (
            <div className="pt-navbar docs-navbar docs-flex-row">
                <div className="pt-navbar-group">
                    <a className="docs-logo" href="/" />
                    <div className="pt-navbar-heading docs-heading">Blueprint</div>
                    {this.renderVersionsMenu()}
                </div>
                <div className="pt-navbar-group">
                    {this.props.children}
                </div>
                <div className="pt-navbar-group">
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
                href={version.url}
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

    private renderVersionsMenu() {
        const { versions } = this.props;
        if (versions.length === 1) {
            return <div className="pt-text-muted">v{versions[0].version}</div>;
        }

        const match = /releases\/([^\/]+)\/dist/.exec(location.href);
        // default to latest release if we can't find a tag in the URL
        const currentRelease = (match == null ? versions[0].version : match[1]);
        const releaseItems = versions.map((rel, i) => (
            <MenuItem key={i} href={rel.url} text={rel.version} />
        ));
        const menu = <Menu className="docs-version-list">{releaseItems}</Menu>;

        return (
            <Popover content={menu} position={Position.BOTTOM}>
                <button className="docs-version-selector pt-text-muted">
                    v{currentRelease} <span className="pt-icon-standard pt-icon-caret-down" />
                </button>
            </Popover>
        );
    }

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    }
}
