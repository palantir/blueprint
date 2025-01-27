/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { OVERLAY_END_FOCUS_TRAP, OVERLAY_START_FOCUS_TRAP } from "../../common/classes";
import { getRef } from "../../common/refs";
import { getFocusableElements } from "../../common/utils/domUtils";

/**
 * Returns the keyboard-focusable elements inside a given container element, ignoring focus traps
 * rendered by Overlay/Overlay2.
 */
export function getKeyboardFocusableElements(container: HTMLElement | React.RefObject<HTMLElement>): HTMLElement[] {
    const containerElement = getRef(container);

    const focusableElements =
        containerElement != null
            ? // Note: Order may not be correct if children elements use tabindex values > 0.
              getFocusableElements(containerElement)
            : [];

    return focusableElements.filter(
        el => !el.classList.contains(OVERLAY_START_FOCUS_TRAP) && !el.classList.contains(OVERLAY_END_FOCUS_TRAP),
    );
}
