/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IconName } from "@blueprintjs/core";

/** Timezone-specific QueryList item */
export interface ITimezoneItem {
    /**
     * The actual timezone name, like `Europe/Paris`.
     *
     * This property is used as the identifier for a timezone item, so it should be unique.
     * If you can't guarantee uniqueness, the `key` property can override it.
     */
    timezone: string;

    /** Display name for this timezone. Defaults to `timezone` property. */
    displayName?: string;

    /** Optional icon for the timezone. */
    iconName?: IconName;

    /** React key to use for the rendered element. Defaults to `timezone` property. */
    key?: string;

    /** Label for the timezone. */
    label?: string;
}
