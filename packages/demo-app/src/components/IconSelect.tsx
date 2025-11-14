/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { useCallback } from "react";

import { Button, Classes, Icon, MenuItem } from "@blueprintjs/core";
import { type IconName } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";
import { type ItemRenderer, Select, type SelectProps } from "@blueprintjs/select";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const iconDataRaw = require("@blueprintjs/icons/icons.json") as IconMetadata[];

interface IconMetadata {
    codepoint: number;
    displayName: string;
    group: string;
    iconName: IconName;
    tags: string;
}

// Sort icons alphabetically by display name
const iconData = [...iconDataRaw].sort((a, b) => a.displayName.localeCompare(b.displayName));

// Smart search implementation
function smartSearch(query: string, ...content: string[]) {
    const terms = query.toLowerCase().split(" ");
    const dataToSearch = content.map(s => s.toLowerCase());
    return terms.every(term => dataToSearch.some(d => d.indexOf(term) >= 0));
}

function filterIcon(query: string, icon: IconMetadata): boolean {
    return smartSearch(query, icon.displayName, icon.iconName, icon.tags, icon.group);
}

function areIconsEqual(iconA: IconMetadata, iconB: IconMetadata): boolean {
    return iconA.iconName === iconB.iconName;
}

type IconSelectProps = Omit<
    SelectProps<IconMetadata>,
    "itemPredicate" | "itemRenderer" | "items" | "itemsEqual" | "noResults" | "onItemSelect"
> & {
    /** The currently selected icon name */
    value?: IconName;
    /** Callback when an icon is selected */
    onIconSelect: (iconName: IconName) => void;
};

export function IconSelect({ fill, value, onIconSelect, ...restProps }: IconSelectProps) {
    const selectedIcon = iconData.find(icon => icon.iconName === value);

    const handleItemSelect = useCallback(
        (icon: IconMetadata) => {
            onIconSelect(icon.iconName);
        },
        [onIconSelect],
    );

    const itemRenderer = useCallback<ItemRenderer<IconMetadata>>(
        (icon, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    active={props.modifiers.active}
                    disabled={props.modifiers.disabled}
                    key={icon.iconName}
                    onClick={props.handleClick}
                    onFocus={props.handleFocus}
                    roleStructure="listoption"
                    selected={icon.iconName === value}
                    text={
                        <Flex alignItems="center" gap={2}>
                            <Icon icon={icon.iconName} />
                            <span>{icon.displayName}</span>
                        </Flex>
                    }
                />
            );
        },
        [value],
    );

    return (
        <Flex>
            <Select<IconMetadata>
                fill={fill}
                itemPredicate={filterIcon}
                itemRenderer={itemRenderer}
                items={iconData}
                itemsEqual={areIconsEqual}
                menuProps={{ "aria-label": "icons" }}
                noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
                onItemSelect={handleItemSelect}
                popoverProps={{ minimal: true }}
                {...restProps}
            >
                <Button
                    alignText="start"
                    disabled={restProps.disabled}
                    endIcon="caret-down"
                    fill={fill}
                    icon={selectedIcon?.iconName}
                    text={selectedIcon?.displayName ?? "(No selection)"}
                    textClassName={classNames({
                        [Classes.TEXT_MUTED]: selectedIcon === undefined,
                    })}
                    style={{ minWidth: "200px" }}
                />
            </Select>
        </Flex>
    );
}
