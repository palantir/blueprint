/*!
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const CREATE_NEW_ITEM_BRAND = "blueprint-create-item";

/** The reserved type of the "Create Item" option in item lists. */
export interface ICreateNewItem {
    __blueprintBrand: typeof CREATE_NEW_ITEM_BRAND;
}

export function getCreateNewItem(): ICreateNewItem {
    return { __blueprintBrand: CREATE_NEW_ITEM_BRAND };
}

export function isCreateNewItem<T>(item: T | ICreateNewItem | null | undefined): item is ICreateNewItem {
    return item != null && (item as ICreateNewItem).__blueprintBrand === CREATE_NEW_ITEM_BRAND;
}

export function getActiveItem<T>(activeItem: T | ICreateNewItem | null | undefined): T | null {
    if (activeItem != null && !isCreateNewItem(activeItem)) {
        return activeItem;
    }
    return null;
}
