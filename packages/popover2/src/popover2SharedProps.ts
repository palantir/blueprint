/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Boundary, Placement, placements, RootBoundary, StrictModifiers } from "@popperjs/core";
import { StrictModifier } from "react-popper";

import { OverlayableProps, Props } from "@blueprintjs/core";

export { Boundary as PopperBoundary, Placement, placements as PlacementOptions };
// copied from @popperjs/core, where it is not exported as public
export type StrictModifierNames = NonNullable<StrictModifiers["name"]>;

/**
 * E: target element interface, defaults to HTMLElement in Popover2 component props interface.
 */
export interface Popover2TargetProps {
    ref: React.Ref<any>;

    /** Whether the popover or tooltip is currently open. */
    isOpen: boolean;
}

/**
 * Props shared between `Popover2` and `Tooltip2`.
 *
 * @template TProps HTML props interface for target element,
 *                  defaults to props for HTMLElement in Popover2Props and Tooltip2Props
 */
export interface Popover2SharedProps<TProps> extends OverlayableProps, Props {
    /**
     * A boundary element supplied to the "flip" and "preventOverflow" modifiers.
     * This is a shorthand for overriding Popper.js modifier options with the `modifiers` prop.
     *
     * @see https://popper.js.org/docs/v2/utils/detect-overflow/#boundary
     */
    boundary?: Boundary;

    /**
     * When enabled, clicks inside a `Classes.POPOVER_DISMISS` element
     * will only close the current popover and not outer popovers.
     * When disabled, the current popover and any ancestor popovers will be closed.
     *
     * @see http://blueprintjs.com/docs/#core/components/popover.closing-on-click
     * @default false
     */
    captureDismiss?: boolean;

    /**
     * Initial opened state when uncontrolled.
     *
     * @default false
     */
    defaultIsOpen?: boolean;

    /**
     * Prevents the popover from appearing when `true`.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * The amount of time in milliseconds the popover should remain open after
     * the user hovers off the trigger. The timer is canceled if the user mouses
     * over the target before it expires.
     *
     * @default 300
     */
    hoverCloseDelay?: number;

    /**
     * The amount of time in milliseconds the popover should wait before opening
     * after the user hovers over the trigger. The timer is canceled if the user
     * mouses away from the target before it expires.
     *
     * @default 150
     */
    hoverOpenDelay?: number;

    /**
     * Whether a popover that uses a `Portal` should automatically inherit the
     * dark theme from its parent.
     *
     * @default true
     */
    inheritDarkTheme?: boolean;

    /**
     * Whether the popover is visible. Passing this prop puts the popover in
     * controlled mode, where the only way to change visibility is by updating
     * this property. If `disabled={true}`, this prop will be ignored, and the
     * popover will remain closed.
     *
     * @default undefined
     */
    isOpen?: boolean;

    /**
     * Whether to apply minimal styling to this popover or tooltip. Minimal popovers
     * do not have an arrow pointing to their target and use a subtler animation.
     *
     * @default false
     */
    minimal?: boolean;

    /**
     * Overrides for Popper.js built-in modifiers.
     * Each override is is a full modifier object (omitting its name), keyed by its modifier name.
     *
     * For example, the arrow modifier can be disabled by providing `{ arrow: { enabled: false } }`.
     *
     * @see https://popper.js.org/docs/v2/modifiers/
     */
    modifiers?: Partial<
        {
            [M in StrictModifierNames]: Partial<Omit<StrictModifier<M>, "name">>;
        }
    >;

    /**
     * Callback invoked in controlled mode when the popover open state *would*
     * change due to user interaction.
     */
    onInteraction?: (nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => void;

    /**
     * Whether the popover should open when its target is focused. If `true`,
     * target will render with `tabindex="0"` to make it focusable via keyboard
     * navigation.
     *
     * @default true
     */
    openOnTargetFocus?: boolean;

    /**
     * Target renderer which receives props injected by Popover2 which should be spread onto
     * the rendered element. This function should return a single React node.
     *
     * Mutually exclusive with children, targetClassName, and targetTagName.
     */
    renderTarget?: (props: Popover2TargetProps & TProps) => JSX.Element;

    /**
     * A root boundary element supplied to the "flip" and "preventOverflow" modifiers.
     * This is a shorthand for overriding Popper.js modifier options with the `modifiers` prop.
     *
     * @see https://popper.js.org/docs/v2/utils/detect-overflow/#rootboundary
     */
    rootBoundary?: RootBoundary;

    /**
     * A space-delimited string of class names applied to the popover element.
     */
    popoverClassName?: string;

    /**
     * The placement (relative to the target) at which the popover should appear.
     *
     * The default value of `"auto"` will choose the best placement when opened
     * and will allow the popover to reposition itself to remain onscreen as the
     * user scrolls around.
     *
     * @default "auto"
     */
    placement?: Placement;

    /**
     * HTML tag name for the target element. This must be an HTML element to
     * ensure that it supports the necessary DOM event handlers.
     *
     * By default, a `<span>` tag is used so popovers appear as inline-block
     * elements and can be nested in text. Use `<div>` tag for a block element.
     *
     * Mutually exclusive with renderTarget.
     *
     * @default "span" ("div" if fill={true})
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
     *
     * @default true
     */
    usePortal?: boolean;
}
