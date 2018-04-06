/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const ns = "[Blueprint]";

export const ICON_STRING_NAMES_NOT_SUPPORTED =
    ns +
    ` Specifying icon by string name is not supported because the BLUEPRINT_ICONS_TREE_SHAKING flag has been set.` +
    ` Icons must be imported as individual modules from the @blueprintjs/icons package.`;
