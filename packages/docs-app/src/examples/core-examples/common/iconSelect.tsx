/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import { useCallback } from "react";

import { Alignment, Button, Classes, MenuItem } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";
import { type ItemRenderer, Select } from "@blueprintjs/select";

import { getIconNames } from "./iconNames";

const ICON_NAMES = getIconNames();

export interface IconSelectProps {
    disabled?: boolean;
    iconName?: IconName;
    onChange: (iconName?: IconName) => void;
}

export const IconSelect: React.FC<IconSelectProps> = ({ disabled, iconName, onChange }) => {
    const renderIconItem: ItemRenderer<IconName> = useCallback(
        (icon, { handleClick, handleFocus, modifiers }) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    roleStructure="listoption"
                    active={modifiers.active}
                    selected={iconName === icon}
                    icon={icon}
                    key={icon}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    text={icon}
                />
            );
        },
        [iconName],
    );

    const filterIconName = useCallback(
        (query: string, name: IconName | undefined) => {
            if (query === "") {
                return name === iconName;
            }
            return name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        },
        [iconName],
    );

    const handleIconChange = useCallback(
        (icon: IconName) => {
            onChange(icon === iconName ? undefined : icon);
        },
        [iconName, onChange],
    );

    return (
        <label
            className={classNames("icon-select", Classes.LABEL, {
                [Classes.DISABLED]: disabled,
            })}
        >
            Icon
            <Select
                disabled={disabled}
                items={ICON_NAMES}
                itemPredicate={filterIconName}
                itemRenderer={renderIconItem}
                noResults={<MenuItem disabled={true} text="No results" />}
                placeholder="Start typing to search…"
                onItemSelect={handleIconChange}
                popoverProps={{ minimal: true }}
            >
                <Button
                    alignText={Alignment.START}
                    textClassName={Classes.TEXT_OVERFLOW_ELLIPSIS}
                    disabled={disabled}
                    fill={true}
                    icon={iconName}
                    text={iconName || "None"}
                    endIcon="caret-down"
                />
            </Select>
        </label>
    );
};
