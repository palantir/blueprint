/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
