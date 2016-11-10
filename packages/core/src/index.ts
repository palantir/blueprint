/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

export * from "./common"
export * from "./components";
export { IconClasses } from "./generated/iconClasses";
export { IconContents } from "./generated/iconStrings";

import { InteractionModeEngine } from "./common/interactionMode";

export const FOCUS_DISABLED_CLASS = "pt-focus-disabled";

const focusEngine = new InteractionModeEngine(document.documentElement, FOCUS_DISABLED_CLASS);

export const FocusStyleManager = {
    alwaysShowFocus: () => focusEngine.stop(),
    isActive: () => focusEngine.isActive(),
    onlyShowFocusOnTabs: () => focusEngine.start(),
};
