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
import { NavButton } from "@blueprintjs/docs-theme";
import { INpmPackage } from "documentalist/dist/client";
import * as React from "react";
import { Logo } from "./logo";

export interface INavHeaderProps {
    onToggleDark: (useDark: boolean) => void;
    useDarkTheme: boolean;
    useNextVersion: boolean;
    packageData: INpmPackage;
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
        const { version, nextVersion, versions } = this.props.packageData;
        if (versions.length === 1) {
            return <div className={Classes.TEXT_MUTED}>v{versions[0]}</div>;
        }

        // default to latest release if we can't find a major version in the URL
        const [currentRelease] = /\/versions\/([0-9]+)/.exec(location.href) || [
            this.props.useNextVersion ? nextVersion : version,
        ];
        const releaseItems = versions.map(v => (
            <MenuItem href={v === currentRelease ? "/docs" : `/docs/versions/${major(v)}`} key={v} text={v} />
        ));
        return (
            <Popover position={Position.BOTTOM}>
                <Tag interactive={true} minimal={true} round={true}>
                    v{major(currentRelease)} <Icon icon="caret-down" />
                </Tag>
                <Menu className="docs-version-list">{releaseItems}</Menu>
            </Popover>
        );
    }

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    };
}

/** Get major component of semver string. */
function major(version: string) {
    return version.split(".", 1)[0];
}
