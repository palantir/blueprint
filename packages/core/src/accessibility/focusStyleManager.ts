/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { InteractionModeEngine } from "../common/interactionMode";

export const FOCUS_DISABLED_CLASS = "pt-focus-disabled";

/* istanbul ignore next */
const fakeFocusEngine = {
    isActive: () => true,
    start: () => true,
    stop: () => true,
};

/* istanbul ignore next */
const focusEngine =
    typeof document !== "undefined"
        ? new InteractionModeEngine(document.documentElement, FOCUS_DISABLED_CLASS)
        : fakeFocusEngine;

// this is basically meaningless to unit test; it requires manual UI testing
/* istanbul ignore next */
export const FocusStyleManager = {
    alwaysShowFocus: () => focusEngine.stop(),
    isActive: () => focusEngine.isActive(),
    onlyShowFocusOnTabs: () => focusEngine.start(),
};
