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
import * as React from "react";

import { Alignment, Button, Classes, MenuItem } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";
import { type ItemRenderer, Select } from "@blueprintjs/select";

import { getIconNames, type IconNameOrNone, NONE } from "./iconNames";

const ICON_NAMES = getIconNames();

export interface IconSelectProps {
    disabled?: boolean;
    iconName?: IconName;
    onChange: (iconName?: IconName) => void;
}

export class IconSelect extends React.PureComponent<IconSelectProps> {
    public render() {
        const { disabled, iconName } = this.props;
        return (
            <label className={classNames(Classes.LABEL, { [Classes.DISABLED]: disabled })}>
                Icon
                <Select<IconNameOrNone>
                    disabled={disabled}
                    items={ICON_NAMES}
                    itemPredicate={this.filterIconName}
                    itemRenderer={this.renderIconItem}
                    noResults={<MenuItem disabled={true} text="No results" />}
                    placeholder="Start typing to search…"
                    onItemSelect={this.handleIconChange}
                    popoverProps={{ minimal: true }}
                >
                    <Button
                        alignText={Alignment.LEFT}
                        className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                        disabled={disabled}
                        fill={true}
                        icon={iconName}
                        text={iconName || NONE}
                        rightIcon="caret-down"
                    />
                </Select>
            </label>
        );
    }

    private renderIconItem: ItemRenderer<IconName | typeof NONE> = (icon, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                roleStructure="listoption"
                active={modifiers.active}
                selected={this.props.iconName === icon}
                icon={icon === NONE ? undefined : icon}
                key={icon}
                onClick={handleClick}
                onFocus={handleFocus}
                text={icon}
            />
        );
    };

    private filterIconName = (query: string, iconName: IconName | typeof NONE) => {
        if (query === "") {
            return iconName === this.props.iconName;
        }
        return iconName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    };

    private handleIconChange = (icon: IconNameOrNone) => this.props.onChange(icon === NONE ? undefined : icon);
}
