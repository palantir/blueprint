/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Boundary as PopperBoundary, Modifiers as PopperModifiers } from "popper.js";
import { Position } from "../../common/position";
import { IProps } from "../../common/props";
import { IOverlayableProps } from "../overlay/overlay";

// re-export symbols for library consumers
export { PopperBoundary, PopperModifiers };

/** `Position` with `"auto"` values, used by `Popover` and `Tooltip`. */
export const PopoverPosition = {
    ...Position,
    AUTO: "auto" as "auto",
    AUTO_END: "auto-end" as "auto-end",
    AUTO_START: "auto-start" as "auto-start",
};
export type PopoverPosition = typeof PopoverPosition[keyof typeof PopoverPosition];

/** Props shared between `Popover` and `Tooltip`. */
export interface IPopoverSharedProps extends IOverlayableProps, IProps {
    /**
     * Determines the boundary element used by Popper for its `flip` and
     * `preventOverflow` modifiers. Three shorthand keywords are supported;
     * Popper will find the correct DOM element itself.
     * @default "scrollParent"
     */
    boundary?: PopperBoundary;

    /**
     * When enabled, `preventDefault()` is invoked on `click` events that close
     * this popover, which will prevent those clicks from closing outer
     * popovers. When disabled, clicking inside a `Classes.POPOVER_DISMISS`
     * element will close the parent popover.
     *
     * See http://blueprintjs.com/docs/#core/components/popover.closing-on-click
     * @default false
     */
    captureDismiss?: boolean;

    /**
     * Initial opened state when uncontrolled.
     * @default false
     */
    defaultIsOpen?: boolean;

    /**
     * Prevents the popover from appearing when `true`.
     * @default false
     */
    disabled?: boolean;

    /**
     * The amount of time in milliseconds the popover should remain open after
     * the user hovers off the trigger. The timer is canceled if the user mouses
     * over the target before it expires.
     * @default 300
     */
    hoverCloseDelay?: number;

    /**
     * The amount of time in milliseconds the popover should wait before opening
     * after the user hovers over the trigger. The timer is canceled if the user
     * mouses away from the target before it expires.
     * @default 150
     */
    hoverOpenDelay?: number;

    /**
     * Whether a popover that uses a `Portal` should automatically inherit the
     * dark theme from its parent.
     * @default true
     */
    inheritDarkTheme?: boolean;

    /**
     * Whether the popover is visible. Passing this prop puts the popover in
     * controlled mode, where the only way to change visibility is by updating
     * this property. If `disabled={true}`, this prop will be ignored, and the
     * popover will remain closed.
     * @default undefined
     */
    isOpen?: boolean;

    /**
     * Popper modifier options, passed directly to internal Popper instance. See
     * https://popper.js.org/docs/modifiers/ for complete
     * details.
     */
    modifiers?: PopperModifiers;

    /**
     * Callback invoked in controlled mode when the popover open state *would*
     * change due to user interaction.
     */
    onInteraction?: (nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => void;

    /**
     * Whether the popover should open when its target is focused. If `true`,
     * target will render with `tabindex="0"` to make it focusable via keyboard
     * navigation.
     * @default true
     */
    openOnTargetFocus?: boolean;

    /**
     * A space-delimited string of class names applied to the popover element.
     */
    popoverClassName?: string;

    /**
     * The position (relative to the target) at which the popover should appear.
     *
     * The default value of `"auto"` will choose the best position when opened
     * and will allow the popover to reposition itself to remain onscreen as the
     * user scrolls around.
     * @default "auto"
     */
    position?: PopoverPosition;

    /**
     * Space-delimited string of class names applied to the target element.
     */
    targetClassName?: string;

    /**
     * HTML props to spread to target element. Use `targetTagName` to change
     * the type of element rendered. Note that `ref` is not supported.
     */
    targetProps?: React.HTMLAttributes<HTMLElement>;

    /**
     * HTML tag name for the target element. This must be an HTML element to
     * ensure that it supports the necessary DOM event handlers.
     *
     * By default, a `<span>` tag is used so popovers appear as inline-block
     * elements and can be nested in text. Use `<div>` tag for a block element.
     * @default "span"
     */
    targetTagName?: keyof JSX.IntrinsicElements;

    /**
     * Whether the popover should be rendered inside a `Portal` attached to
     * `portalContainer` prop.
     *
     * Rendering content inside a `Portal` allows the popover content to escape
     * the physical bounds of its parent while still being positioned correctly
     * relative to its target. Using a `Portal` is necessary if any ancestor of
     * the target hides overflow or uses very complex positioning.
     *
     * Not using a `Portal` can result in smoother performance when scrolling
     * and allows the popover content to inherit CSS styles from surrounding
     * elements, but it remains subject to the overflow bounds of its ancestors.
     * @default true
     */
    usePortal?: boolean;

    /**
     * HTML tag name for the wrapper element, which also receives the
     * `className` prop.
     * @default "span"
     */
    wrapperTagName?: keyof JSX.IntrinsicElements;
}
