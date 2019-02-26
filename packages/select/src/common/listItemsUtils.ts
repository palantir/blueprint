/*!
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * The reserved type of the "Create Item" option in item lists. This is intended
 * not to conflict with any custom item type `T` that might be used in  item
 * list.
 */
export interface ICreateNewItem {
    __blueprintBrand: "blueprint-create-item";
}

/** Returns an instance of a "Create Item" object. */
export function getCreateNewItem(): ICreateNewItem {
    return { __blueprintBrand: "blueprint-create-item" };
}

/**
 * Type guard returning `true` if the provided item (e.g. the current
 * `activeItem`) is a "Create Item" option.
 */
export function isCreateNewItem<T>(item: T | ICreateNewItem | null | undefined): item is ICreateNewItem {
    return item != null && (item as ICreateNewItem).__blueprintBrand === "blueprint-create-item";
}

/**
 * Returns the type of the the current active item. This will be a no-op unless
 * the `activeItem` is `undefined` or a "Create Item" option, in which case
 * `null` will be returned instead.
 */
export function getActiveItem<T>(activeItem: T | ICreateNewItem | null | undefined): T | null {
    return activeItem == null || isCreateNewItem(activeItem) ? null : activeItem;
}
