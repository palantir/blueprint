'use client';

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

import { useEffect } from "react";

import { Classes, NavbarHeading, Tag } from "@blueprintjs/core";

import { Logo } from "./Logo";
import { NavButton } from "./NavButton";

export interface NavHeaderProps {
    onToggleDark: (useDark: boolean) => void;
    useDarkTheme: boolean;
    version?: string;
}

export const NavHeader: React.FC<NavHeaderProps> = ({ onToggleDark, useDarkTheme, version = "6" }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "D") {
                event.preventDefault();
                onToggleDark(!useDarkTheme);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onToggleDark, useDarkTheme]);

    const handleDarkSwitchChange = () => onToggleDark(!useDarkTheme);

    return (
        <>
            <div className="docs-nav-title">
                <a className="docs-logo" href="/" aria-label="docs home">
                    <Logo />
                </a>
                <div>
                    <NavbarHeading className="docs-heading">
                        <span>Blueprint</span>{" "}
                        <Tag
                            minimal={true}
                            round={true}
                        >
                            v{version}
                        </Tag>
                    </NavbarHeading>
                    <a
                        className={Classes.TEXT_MUTED}
                        href="https://github.com/palantir/blueprint"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
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
        </>
    );
};
