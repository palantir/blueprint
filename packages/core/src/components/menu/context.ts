/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isFunction } from "../../common/utils";

export interface IMenuItemContext {
    getSubmenuPopperModifiers?(): Popper.Modifiers;
}

export const MenuItemContextTypes: React.ValidationMap<IMenuItemContext> = {
    getSubmenuPopperModifiers: assertFunctionProp,
};

// simple alternative to prop-types dependency
function assertFunctionProp<T>(obj: T, key: keyof T) {
    // context method is optional, so allow nulls
    if (obj[key] == null || isFunction(obj[key])) {
        return undefined;
    }
    return new Error(`[Blueprint] context ${key} must be function. received ${typeof obj[key]}.`);
}
