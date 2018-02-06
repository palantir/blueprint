/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button, Classes, MenuItem } from "@blueprintjs/core";
import { IconClasses, IconName } from "@blueprintjs/icons";
import { ItemRenderer, Select } from "@blueprintjs/select";
import * as classNames from "classnames";
import * as React from "react";

export interface IIconSelectProps {
    iconName?: IconName;
    onChange: (iconName?: IconName) => void;
}

const NONE = "(none)";
type IconType = IconName | typeof NONE;
const ICON_NAMES = Object.keys(IconClasses).map<IconType>(
    (name: keyof typeof IconClasses) => IconClasses[name].replace("pt-icon-", "") as IconName,
);
ICON_NAMES.push(NONE);

const TypedSelect = Select.ofType<IconType>();

export class IconSelect extends React.PureComponent<IIconSelectProps> {
    public render() {
        const { iconName } = this.props;
        return (
            <label className={Classes.LABEL}>
                Icon name
                <TypedSelect
                    items={ICON_NAMES}
                    itemPredicate={this.filterIconName}
                    itemRenderer={this.renderIconItem}
                    noResults={<MenuItem disabled={true} text="No results" />}
                    onItemSelect={this.handleIconChange}
                    popoverProps={{ minimal: true }}
                >
                    <Button
                        className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                        icon={iconName}
                        text={iconName || NONE}
                        rightIcon="caret-down"
                    />
                </TypedSelect>
            </label>
        );
    }

    private renderIconItem: ItemRenderer<IconName> = (icon, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const classes = classNames({
            [Classes.ACTIVE]: modifiers.active,
            [Classes.INTENT_PRIMARY]: modifiers.active,
        });
        return <MenuItem className={classes} icon={icon} key={icon} onClick={handleClick} text={icon} />;
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
