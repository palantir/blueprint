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

import type { DefaultPopoverTargetHTMLProps, Popover, PopoverProps } from "@blueprintjs/core";

/**
 * Reusable collection of props for components in this package which render a `Popover`
 * and need to provide some degree of customization for that popover.
 */
export interface SelectPopoverProps {
    /**
     * HTML attributes to spread to the popover content container element.
     */
    popoverContentProps?: React.HTMLAttributes<HTMLDivElement>;

    /**
     * Props to spread to the popover.
     *
     * Note that `content` cannot be changed, but you may apply some props to the content wrapper element
     * with `popoverContentProps`. Likewise, `targetProps` is no longer supported as it was in Blueprint v4, but you
     * may use `popoverTargetProps` instead.
     *
     * N.B. `disabled` is supported here, as this can be distinct from disabling the entire select button / input
     * control element. There are some cases where we only want to disable the popover interaction.
     */
    popoverProps?: Partial<Omit<PopoverProps, "content" | "defaultIsOpen" | "fill" | "renderTarget">>;

    /**
     * Optional ref for the Popover component instance.
     * This is sometimes useful to reposition the popover.
     *
     * Note that this is defined as a specific kind of Popover instance which should be compatible with
     * most use cases, since it uses the default target props interface.
     */
    popoverRef?: React.RefObject<Popover<DefaultPopoverTargetHTMLProps>>;

    /**
     * HTML attributes to add to the popover target element.
     */
    popoverTargetProps?: React.HTMLAttributes<HTMLElement>;
}
