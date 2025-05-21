/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import {
    Button,
    type ButtonProps,
    DISPLAYNAME_PREFIX,
    type IconName,
    type MaybeElement,
    MenuItem,
    type PopoverProps,
    type Props,
} from "@blueprintjs/core";

import { type ItemRenderer } from "../../common";
import { Select } from "../select/select";

type KeysOfType<T, U> = Extract<
    keyof T,
    keyof {
        [K in keyof T as[T[K]] extends [U] ? K : never]: 1;
    }
>;

type ItemProperty<T, U> = KeysOfType<T, U> | ((item: T) => U);

interface DropdownBaseProps<T> extends Props {
    buttonProps?: ButtonProps;
    disabled?: boolean;
    fill?: boolean;
    itemDisabled?: ItemProperty<T, boolean>;
    itemIcon?: ItemProperty<T, IconName | MaybeElement>;
    items: T[];
    onItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
    placeholder?: React.ReactNode;
    popoverProps?: PopoverProps;
    selectedItem: T;
}

interface RequiredNonSerializableProps<T> {
    itemLabel: ItemProperty<T, React.ReactNode>;
    itemKey: ItemProperty<T, React.Key>;
}

interface SerializableDropdownProps<T> extends DropdownBaseProps<T>, Partial<RequiredNonSerializableProps<T>> { }
interface NonSerializableDropdownProps<T> extends DropdownBaseProps<T>, RequiredNonSerializableProps<T> { }

type SerializableType = string | number;

export type DropdownProps<T> = DropdownBaseProps<T> &
    ([T] extends [SerializableType] ? SerializableDropdownProps<T> : NonSerializableDropdownProps<T>);

interface DropdownComponent {
    <T>(props: DropdownProps<T>): React.JSX.Element | null;
    displayName: string;
}

/**
 * Dropdown component.
 *
 * @see https://blueprintjs.com/docs/#select/dropdown
 */
export const Dropdown: DropdownComponent = <T,>(props: DropdownProps<T>) => {
    const {
        className,
        buttonProps,
        disabled,
        fill,
        itemDisabled,
        itemIcon,
        itemKey = String,
        itemLabel = String,
        items,
        onItemSelect,
        popoverProps,
        selectedItem,
    } = props as SerializableDropdownProps<T>;
    const itemRenderer: ItemRenderer<T> = React.useCallback(
        (item, { handleClick, handleFocus, modifiers }) => (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                icon={getProperty(item, itemIcon)}
                key={getProperty(item, itemKey)}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                selected={selectedItem === item}
                text={getProperty(item, itemLabel)}
            />
        ),
        [itemIcon, itemKey, itemLabel, selectedItem],
    );

    const handleSelect = React.useCallback(
        (newValue: T, event: React.SyntheticEvent<HTMLElement> | undefined) => {
            onItemSelect?.(newValue, event);
        },
        [onItemSelect],
    );

    const resolvedPopoverProps = React.useMemo(
        (): PopoverProps => ({
            matchTargetWidth: fill,
            minimal: true,
            ...popoverProps,
        }),
        [fill, popoverProps],
    );

    return (
        <Select
            className={className}
            disabled={disabled}
            fill={fill}
            filterable={false}
            itemDisabled={itemDisabled}
            itemRenderer={itemRenderer}
            items={items}
            onItemSelect={handleSelect}
            popoverProps={resolvedPopoverProps}
        >
            <Button
                alignText="start"
                disabled={disabled}
                endIcon="caret-down"
                fill={true}
                icon={getProperty(selectedItem, itemIcon)}
                text={getProperty(selectedItem, itemLabel)}
                {...buttonProps}
            />
        </Select>
    );
};

Dropdown.displayName = `${DISPLAYNAME_PREFIX}.PanelStack`;

function getProperty<T, U>(item: T, itemProperty: ItemProperty<T, U> | undefined): U | undefined {
    if (typeof itemProperty === "function") {
        return itemProperty(item);
    } else if (itemProperty != null) {
        return item[itemProperty as keyof T] as U;
    } else {
        return undefined;
    }
}
