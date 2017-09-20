/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const ns = "[Blueprint]";
const deprec = `${ns} DEPRECATION:`;

export const POPOVER_WARN_DEPRECATED_IS_DISABLED = `${deprec} <Popover2> isDisabled is deprecated. Use disabled.`;
export const POPOVER_WARN_DEPRECATED_IS_MODAL = `${deprec} <Popover2> isModal is deprecated. Use hasBackdrop.`;
export const POPOVER_WARN_DEPRECATED_POSITION = `${deprec} <Popover2> position is deprecated. Use placement.`;
