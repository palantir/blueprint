/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import type { PopoverNextRef, PopoverProps } from "@blueprintjs/core";

/**
 * Reusable collection of props for components in this package which render a popover
 * and need to provide some degree of customization for that popover.
 */
export interface DatetimePopoverProps {
    /**
     * Props to spread to `Popover`.
     */
    popoverProps?: Partial<
        Omit<
            PopoverProps,
            "autoFocus" | "content" | "defaultIsOpen" | "disabled" | "enforceFocus" | "fill" | "renderTarget"
        >
    >;

    /**
     * Optional ref to the popover. `popoverRef.current?.reposition()` re-runs position
     * calculation — useful when the target moves in a way the popover doesn't observe
     * automatically (e.g. a parent layout change that doesn't trigger a resize).
     *
     * For a ref to the popover's floating DOM element, use `popoverProps.popoverRef`.
     */
    popoverRef?: React.RefObject<PopoverNextRef>;
}
