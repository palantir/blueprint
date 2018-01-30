/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { func } from "prop-types";

export interface IMenuItemContext {
    getSubmenuPopperModifiers?(): Popper.Modifiers;
}

export const MenuItemContextTypes: React.ValidationMap<IMenuItemContext> = {
    getSubmenuPopperModifiers: func,
};
