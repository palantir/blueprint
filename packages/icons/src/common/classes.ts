/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Intent } from "./intent";

export const ICON = "pt-icon";
export const ICON_STANDARD = "pt-icon-standard";
export const ICON_LARGE = "pt-icon-large";

/** Return CSS class for intent. */
export function intentClass(intent: Intent = "none") {
    return intent == null || intent === "none" ? undefined : `pt-intent-${intent}`;
}
