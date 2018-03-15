/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Hotkey, Hotkeys, HotkeysTarget, NavbarHeading } from "@blueprintjs/core";
import { NavButton } from "@blueprintjs/docs-theme";
import * as React from "react";

export interface INavHeaderProps {
    onToggleDark: (useDark: boolean) => void;
    useDarkTheme: boolean;
}

@HotkeysTarget
export class NavHeader extends React.PureComponent<INavHeaderProps, {}> {
    public render() {
        const { useDarkTheme } = this.props;
        return (
            <>
                <div className="docs-nav-title">
                    <a className="docs-logo" href="/" />
                    <div>
                        <NavbarHeading className="docs-heading">Blueprint</NavbarHeading>
                        <a className={Classes.TEXT_MUTED} href="https://github.com/palantir/blueprint" target="_blank">
                            <small>View on GitHub</small>
                        </a>
                    </div>
                </div>
                <div className="docs-nav-divider" />
                <NavButton
                    icon={useDarkTheme ? "flash" : "moon"}
                    hotkey="D"
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

    private handleDarkSwitchChange = () => {
        this.props.onToggleDark(!this.props.useDarkTheme);
    };
}
