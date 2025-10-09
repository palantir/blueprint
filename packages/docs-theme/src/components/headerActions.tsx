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

import React from "react";

import { AnchorButton, Button, Classes, HotkeysTarget, InputGroup } from "@blueprintjs/core";

export const HeaderSearch: React.FC<{
    placeholder?: string;
    shortcut?: string;
    onClick?: () => void;
}> = ({ onClick, placeholder = "Search blueprint docs...", shortcut = "⇧S" }) => (
    <InputGroup
        name="docs-header-search"
        inputClassName="docs-header-search"
        leftIcon={"search"}
        placeholder={placeholder}
        readOnly={true}
        rightElement={<div className="docs-header-search-kbd">{shortcut}</div>}
        onClick={onClick}
    />
);

export const HeaderThemeToggle: React.FC<{
    isDarkThemeEnabled?: boolean;
    onToggle?: (useDark: boolean) => void;
}> = ({ isDarkThemeEnabled, onToggle }) => {
    const handleToggle = React.useCallback(() => {
        onToggle?.(!isDarkThemeEnabled);
    }, [onToggle, isDarkThemeEnabled]);

    if (onToggle == null) {
        return null;
    }

    return (
        <HotkeysTarget
            hotkeys={[
                {
                    combo: "shift + d",
                    global: true,
                    label: "Toggle dark theme",
                    onKeyDown: handleToggle,
                },
            ]}
        >
            <Button
                icon={isDarkThemeEnabled ? "flash" : "moon"}
                onClick={handleToggle}
                variant="minimal"
                title={`Switch to ${isDarkThemeEnabled ? "light" : "dark"} theme (Shift+D)`}
                text={<span className={Classes.TEXT_DISABLED}>⇧D</span>}
            />
        </HotkeysTarget>
    );
};

export const HeaderGitHubLink = () => (
    <AnchorButton href={"https://github.com/palantir/blueprint"} icon="git-repo" text="GitHub" target="_blank" />
);
