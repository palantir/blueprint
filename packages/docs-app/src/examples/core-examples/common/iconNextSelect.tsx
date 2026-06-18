/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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
import { PureComponent } from "react";

import { Alignment, Button, Classes, IconNext, MenuItem } from "@blueprintjs/core";
import { type BlueprintIconsNext, nextIconManifest } from "@blueprintjs/icons/next";
import { type ItemRenderer, Select } from "@blueprintjs/select";

const ICON_NAMES = nextIconManifest.map(entry => entry.name);

export interface IconNextSelectProps {
    disabled?: boolean;
    iconName?: BlueprintIconsNext;
    onChange: (iconName?: BlueprintIconsNext) => void;
}

export class IconNextSelect extends PureComponent<IconNextSelectProps> {
    public render() {
        const { disabled, iconName } = this.props;
        return (
            <label
                className={classNames("icon-select", Classes.LABEL, {
                    [Classes.DISABLED]: disabled,
                })}
            >
                Icon
                <Select<BlueprintIconsNext>
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
                        alignText={Alignment.START}
                        textClassName={Classes.TEXT_OVERFLOW_ELLIPSIS}
                        disabled={disabled}
                        fill={true}
                        icon={iconName == null ? undefined : <IconNext icon={iconName} />}
                        text={iconName ?? "None"}
                        endIcon="caret-down"
                    />
                </Select>
            </label>
        );
    }

    private renderIconItem: ItemRenderer<BlueprintIconsNext> = (
        icon,
        { handleClick, handleFocus, modifiers },
    ) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                roleStructure="listoption"
                active={modifiers.active}
                selected={this.props.iconName === icon}
                icon={<IconNext icon={icon} />}
                key={icon}
                onClick={handleClick}
                onFocus={handleFocus}
                text={icon}
            />
        );
    };

    private filterIconName = (query: string, iconName: BlueprintIconsNext) => {
        if (query === "") {
            return iconName === this.props.iconName;
        }
        return iconName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    };

    private handleIconChange = (icon: BlueprintIconsNext) => {
        this.props.onChange(icon === this.props.iconName ? undefined : icon);
    };
}
