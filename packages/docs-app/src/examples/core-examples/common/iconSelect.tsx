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

import React from "react";

import { Alignment, Button, Classes, MenuItem } from "@blueprintjs/core";
import { IconName, IconNames } from "@blueprintjs/icons";
import { ItemRenderer, Select } from "@blueprintjs/select";

export interface IconSelectProps {
    iconName?: IconName;
    onChange: (iconName?: IconName) => void;
}

const NONE = "(none)";
type IconType = IconName | typeof NONE;
const ICON_NAMES = Object.keys(IconNames).map<IconType>((name: string) => IconNames[name as keyof typeof IconNames]);
ICON_NAMES.push(NONE);

const TypedSelect = Select.ofType<IconType>();

export class IconSelect extends React.PureComponent<IconSelectProps> {
    public render() {
        const { iconName } = this.props;
        return (
            <label className={Classes.LABEL}>
                Icon
                <TypedSelect
                    items={ICON_NAMES}
                    itemPredicate={this.filterIconName}
                    itemRenderer={this.renderIconItem}
                    noResults={<MenuItem disabled={true} text="No results" />}
                    onItemSelect={this.handleIconChange}
                    popoverProps={{ minimal: true }}
                >
                    <Button
                        alignText={Alignment.LEFT}
                        className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                        fill={true}
                        icon={iconName}
                        text={iconName || NONE}
                        rightIcon="caret-down"
                    />
                </TypedSelect>
            </label>
        );
    }

    private renderIconItem: ItemRenderer<IconName | typeof NONE> = (icon, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={icon === NONE ? undefined : icon}
                key={icon}
                onClick={handleClick}
                text={icon}
            />
        );
    };

    private filterIconName = (query: string, iconName: IconName | typeof NONE) => {
        if (iconName === NONE) {
            return true;
        }
        if (query === "") {
            return iconName === this.props.iconName;
        }
        return iconName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    };

    private handleIconChange = (icon: IconType) => this.props.onChange(icon === NONE ? undefined : icon);
}
