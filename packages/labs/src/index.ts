/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export * from "./common";
export * from "./components";

// re-exports for 0.15.x provided as a migration path. these will be removed in 0.16.x
import { Popover, Tooltip } from "@blueprintjs/core";
export const Popover2 = Popover;
export const Tooltip2 = Tooltip;

import { Omnibar } from "@blueprintjs/select";
export const Omnibox = Omnibar;
export * from "@blueprintjs/select";

export {
    ITimezonePickerProps,
    ITimezonePickerState,
    TimezoneDisplayFormat,
    TimezonePicker,
} from "@blueprintjs/timezone";
