/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Placement } from "@popperjs/core";

import type { OverlayLifecycleProps } from "../overlay/overlayProps";
import type { PopoverProps } from "../popover/popover";
import { getTransformOrigin } from "../popover/popperUtils";

export type Offset = {
    left: number;
    top: number;
};

/**
 * A limited subset of props to forward along to the context menu popover overlay.
 *
 * Overriding `placement` is not recommended, as users expect context menus to open towards the bottom right
 * of their cursor, which is the default placement. However, this option is provided to help with rare cases where
 * the menu is triggered at the bottom and/or right edge of a window and the built-in popover flipping behavior does
 * not work effectively.
 *
 * N.B. As of @blueprintjs/core v5.10.x, the `rootBoundary` prop is ignored; the new behavior is equivalent to "viewport".
 */
export type ContextMenuPopoverOptions = OverlayLifecycleProps &
    Pick<PopoverProps, "placement" | "popoverClassName" | "transitionDuration" | "popoverRef" | "rootBoundary">;

export const CONTEXT_MENU_PLACEMENT: Placement = "right-start";

// compute an appropriate transform origin so the scale animation points towards target
export const CONTEXT_MENU_TRANSFORM_ORIGIN = getTransformOrigin(CONTEXT_MENU_PLACEMENT, undefined);
