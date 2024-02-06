/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { NpmPackageInfo } from "@documentalist/client";
import * as React from "react";

import { Classes, HotkeysTarget2, type Intent, Menu, MenuItem, NavbarHeading, Popover, Tag } from "@blueprintjs/core";
import { NavButton } from "@blueprintjs/docs-theme";

import { Logo } from "./logo";

export interface NavHeaderProps {
    onToggleStrictMode: (useStrictMode: boolean) => void;
    onToggleDark: (useDark: boolean) => void;
    useDarkTheme: boolean;
    useNextVersion: boolean;
    useStrictMode: boolean;
    packageInfo: NpmPackageInfo;
}

/**
 * Docs sidebar navigation header
 */
export const NavHeader: React.FC<NavHeaderProps> = ({
    useDarkTheme,
    useNextVersion,
    useStrictMode,
    onToggleStrictMode,
    onToggleDark,
    packageInfo,
}) => {
    const versionsMenu = React.useMemo(() => {
        const { version, nextVersion, versions } = packageInfo;
        if (versions.length === 1) {
            return <div className={Classes.TEXT_MUTED}>v{versions[0]}</div>;
        }

        const versionFromUrl = getVersionFromUrl();
        // default to latest release if we can't find a major version in the URL
        const currentVersion = versionFromUrl ?? (useNextVersion ? nextVersion : version);
        const releaseItems = versions
            .filter(v => +major(v) > 0)
            .map(v => {
                let href;
                let intent: Intent | undefined;
                // pre-release versions are not served as the default docs, they are inside the /versions/ folder
                if (useNextVersion) {
                    const isLatestStableMajor = +major(v) === +major(currentVersion) - 1;
                    href = isLatestStableMajor ? "/docs" : `/docs/versions/${major(v)}`;
                    if (isLatestStableMajor) {
                        intent = "primary";
                    }
                } else {
                    href = v === currentVersion ? "/docs" : `/docs/versions/${major(v)}`;
                }
                return <MenuItem href={href} intent={intent} key={v} text={v} />;
            });
        return (
            <Popover content={<Menu className="docs-version-list">{releaseItems}</Menu>} placement="bottom">
                <Tag interactive={true} minimal={true} round={true} rightIcon="caret-down">
                    v{major(currentVersion)}
                </Tag>
            </Popover>
        );
    }, [packageInfo, useNextVersion]);

    const handleStrictModeChange = React.useCallback(
        () => onToggleStrictMode(!useStrictMode),
        [onToggleStrictMode, useStrictMode],
    );

    const handleDarkSwitchChange = React.useCallback(() => onToggleDark(!useDarkTheme), [onToggleDark, useDarkTheme]);

    const hotkeys = React.useMemo(
        () => [
            {
                combo: "shift + d",
                global: true,
                label: "Toggle dark theme",
                onKeyDown: handleDarkSwitchChange,
            },
            {
                combo: "shift + t",
                global: true,
                label: "Toggle React strict mode",
                onKeyDown: handleStrictModeChange,
            },
        ],
        [handleDarkSwitchChange, handleStrictModeChange],
    );

    return (
        <HotkeysTarget2 hotkeys={hotkeys}>
            <>
                <div className="docs-nav-title">
                    <a className="docs-logo" href="/" aria-label="docs home">
                        <Logo />
                    </a>
                    <div>
                        <NavbarHeading className="docs-heading">
                            <span>Blueprint</span> {versionsMenu}
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
                    onClick={handleDarkSwitchChange}
                />
                <div className="docs-nav-divider" />
                <NavButton
                    icon={useStrictMode ? "issue-closed" : "issue"}
                    hotkey="shift + t"
                    text={useStrictMode ? "Strict mode enabled" : "Strict mode disabled"}
                    onClick={handleStrictModeChange}
                />
            </>
        </HotkeysTarget2>
    );
};

/** Get major component of semver string. */
function major(version: string) {
    return version.split(".", 1)[0];
}

function getVersionFromUrl() {
    const urlMatch = /\/versions\/([0-9]+)/.exec(location.href);
    // if matched, we'll get ["/versions/4", "4"]
    return urlMatch?.[1];
}
