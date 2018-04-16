/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { InteractionModeEngine } from "../common/interactionMode";

const fakeFocusEngine = {
    isActive: () => true,
    start: () => true,
    stop: () => true,
};

const focusEngine =
    typeof document !== "undefined"
        ? new InteractionModeEngine(document.documentElement, "pt-focus-disabled")
        : fakeFocusEngine;

export const FocusStyleManager = {
    alwaysShowFocus: () => focusEngine.stop(),
    isActive: () => focusEngine.isActive(),
    onlyShowFocusOnTabs: () => focusEngine.start(),
};
