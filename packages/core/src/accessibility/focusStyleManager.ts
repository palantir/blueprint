/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
/* istanbul ignore next */

import { InteractionModeEngine } from "../common/interactionMode";

export const FOCUS_DISABLED_CLASS = "pt-focus-disabled";

const fakeFocusEngine = {
    isActive: () => true,
    start: () => true,
    stop: () => true,
};
const focusEngine = typeof document !== "undefined"
    ? new InteractionModeEngine(document.documentElement, FOCUS_DISABLED_CLASS)
    : fakeFocusEngine;

// this is basically meaningless to unit test; it requires manual UI testing
/* istanbul ignore next */
export const FocusStyleManager = {
    alwaysShowFocus: () => focusEngine.stop(),
    isActive: () => focusEngine.isActive(),
    onlyShowFocusOnTabs: () => focusEngine.start(),
};
