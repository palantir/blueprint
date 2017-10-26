/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "../";

export function isDarkTheme(element: Element): boolean {
    return element.closest(`.${Classes.DARK}`) != null;
}
