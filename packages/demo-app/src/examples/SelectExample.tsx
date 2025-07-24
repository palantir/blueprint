/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import * as React from "react";

import { Button, Classes, H4, MenuItem, type MenuItemProps } from "@blueprintjs/core";
import { type ItemPredicate, type ItemRenderer, type ItemRendererProps, Select } from "@blueprintjs/select";

const fruits = [
    "apple",
    "banana",
    "cherry",
    "date",
    "elderberry",
    "fig",
    "grape",
    "honeydew",
    "kiwi",
    "lemon",
    "mango",
    "nectarine",
    "orange",
    "pear",
    "pineapple",
    "plum",
    "raspberry",
    "strawberry",
    "tangerine",
    "watermelon",
];

export const SelectExample = React.memo(() => {
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const [selectedItemFloating, setSelectedItemFloating] = React.useState<string | undefined>(undefined);

    const handleItemSelect = React.useCallback((item: string) => {
        setSelectedItem(item);
    }, []);

    const handleItemSelectFloating = React.useCallback((item: string) => {
        setSelectedItemFloating(item);
    }, []);

    const itemRenderer = React.useCallback<ItemRenderer<string>>(
        (item, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem {...getItemProps(item, props)} roleStructure="listoption" selected={item === selectedItem} />
            );
        },
        [selectedItem],
    );

    const itemRendererFloating = React.useCallback<ItemRenderer<string>>(
        (item, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    {...getItemProps(item, props)}
                    roleStructure="listoption"
                    selected={item === selectedItemFloating}
                />
            );
        },
        [selectedItemFloating],
    );

    return (
        <div className="demo-example">
            <div className="demo-example-content">
                <H4>Select</H4>
                <Select
                    itemPredicate={filterItem}
                    itemRenderer={itemRenderer}
                    items={fruits}
                    onItemSelect={handleItemSelect}
                >
                    <Button
                        alignText="start"
                        endIcon="caret-down"
                        text={maybeRenderSelection(selectedItem) ?? "(No selection)"}
                        textClassName={classNames({
                            [Classes.TEXT_MUTED]: selectedItem === undefined,
                        })}
                    />
                </Select>
            </div>
            <div className="demo-example-content">
                <H4>Select with floating UI</H4>
                <Select
                    floating={true}
                    itemPredicate={filterItem}
                    itemRenderer={itemRendererFloating}
                    items={fruits}
                    onItemSelect={handleItemSelectFloating}
                >
                    <Button
                        alignText="start"
                        endIcon="caret-down"
                        text={maybeRenderSelection(selectedItemFloating) ?? "(No selection)"}
                        textClassName={classNames({
                            [Classes.TEXT_MUTED]: selectedItemFloating === undefined,
                        })}
                    />
                </Select>
            </div>
        </div>
    );
});

function maybeRenderSelection(selectedItem: string | undefined) {
    return selectedItem ? `${selectedItem}` : undefined;
}

export const filterItem: ItemPredicate<string> = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${item}`.indexOf(normalizedQuery) >= 0;
    }
};

export function getItemProps(
    item: string,
    { handleClick, handleFocus, modifiers, query, ref }: ItemRendererProps,
): MenuItemProps & React.Attributes {
    return {
        active: modifiers.active,
        disabled: modifiers.disabled,
        key: item,
        onClick: handleClick,
        onFocus: handleFocus,
        ref,
        text: highlightText(item, query),
    };
}

function highlightText(text: string, query: string) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

SelectExample.displayName = "DemoApp.SelectExample";
