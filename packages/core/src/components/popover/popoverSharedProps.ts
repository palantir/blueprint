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

import type { Boundary, Modifier, Placement, RootBoundary, StrictModifiers } from "@popperjs/core";
import type * as React from "react";
import type { StrictModifier } from "react-popper";

import type { Props } from "../../common";
import type { OverlayableProps } from "../overlay/overlay";
import type { PopoverPosition } from "./popoverPosition";

export type { Boundary as PopperBoundary, Placement };
// copied from @popperjs/core, where it is not exported as public
export type StrictModifierNames = NonNullable<StrictModifiers["name"]>;

/**
 * Configuration object for customizing popper.js v2 modifiers in Popover and Tooltip.
 *
 * @see https://popper.js.org/docs/v2/modifiers/
 */
export type PopperModifierOverrides = Partial<{
    [M in StrictModifierNames]: Partial<Omit<StrictModifier<M>, "name">>;
}>;

/**
 * Custom popper.js v2 modifier for Popover and Tooltip.
 *
 * @see https://popper.js.org/docs/v2/modifiers/#custom-modifiers
 */
export type PopperCustomModifier = Partial<Modifier<any, object>>;

/**
 * Default props interface for the Popover target element.
 *
 * These props are applied to the generated target element (whose tag name is customizable via `targetTagName`)
 * or, when the `renderTarget` API is used, sent as props to that render function.
 *
 * This interface is generic enough to be compatible with the various HTML attributes Popover needs in
 * order to function properly, including things like event handlers and ARIA accessibility attributes.
 */
export type DefaultPopoverTargetHTMLProps = React.HTMLProps<HTMLElement>;

/**
 * Properties injected by Popover when rendering custom targets via the `renderTarget` API.
 *
 * @see https://blueprintjs.com/docs/#core/components/popover.structure
 */
export interface PopoverTargetProps
    extends Pick<React.HTMLAttributes<HTMLElement>, "aria-haspopup" | "className" | "tabIndex"> {
    /** Target ref. */
    ref: React.Ref<any>;

    /** Whether the popover or tooltip is currently open. */
    isOpen: boolean;
}

/**
 * Event handlers injected by Popover for hover interaction popovers.
 */
export type PopoverHoverTargetHandlers<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps> =
    Pick<TProps, "onBlur" | "onContextMenu" | "onFocus" | "onMouseEnter" | "onMouseLeave">;

/**
 * Event handlers injected by Popover for click interaction popovers.
 */
export type PopoverClickTargetHandlers<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps> =
    Pick<TProps, "onClick" | "onKeyDown">;

/**
 * Props shared between `Popover` and `Tooltip`.
 *
 * @template TProps HTML props interface for target element,
 *                  defaults to props for HTMLElement in IPopoverProps and ITooltipProps
 */
export interface PopoverSharedProps<TProps extends DefaultPopoverTargetHTMLProps> extends OverlayableProps, Props {
    /** Interactive element which will trigger the popover. */
    children?: React.ReactNode;

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
     * Whether the wrapper and target should take up the full width of their container.
     * Note that supplying `true` for this prop will force  `targetTagName="div"`.
     */
    fill?: boolean;

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
     * Whether the popover content should be sized to match the width of the target.
     * This is sometimes useful for dropdown menus. This prop is implemented using
     * a Popper.js custom modifier.
     *
     * @default false
     */
    matchTargetWidth?: boolean;

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
     * Some of Popover's default modifiers may get disabled under certain circumstances, but you may
     * choose to re-enable and customize them. For example, "offset" is disabled when `minimal={true}`,
     * but you can re-enable it with `{ offset: { enabled: true } }`.
     *
     * @see https://popper.js.org/docs/v2/modifiers/
     */
    modifiers?: PopperModifierOverrides;

    /**
     * Custom modifiers to add to the popper instance.
     *
     * @see https://popper.js.org/docs/v2/modifiers/#custom-modifiers
     */
    modifiersCustom?: readonly PopperCustomModifier[];

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
     * Note that this functionality is only enabled for hover interaction
     * popovers/tooltips.
     *
     * @default true
     */
    openOnTargetFocus?: boolean;

    /**
     * Ref supplied to the `Classes.POPOVER` element.
     */
    popoverRef?: React.Ref<HTMLElement>;

    /**
     * Target renderer which receives props injected by Popover which should be spread onto
     * the rendered element. This function should return a single React node.
     *
     * Mutually exclusive with `children` and `targetTagName` props.
     */
    renderTarget?: (
        // N.B. we would like to discriminate between "hover" and "click" popovers here, so that we can be clear
        // about exactly which event handlers are passed here to be rendered on the target element, but unfortunately
        // we can't do that without breaking backwards-compatibility in the renderTarget API. Besides, that kind of
        // improvement would be better implemented if we added another type param to Popover, something like
        // Popover<TProps, "click" | "hover">. Instead of discriminating, we union the different possible event handlers
        // that may be passed (they are all optional properties anyway).
        props: PopoverTargetProps & PopoverHoverTargetHandlers<TProps> & PopoverClickTargetHandlers<TProps>,
    ) => JSX.Element;

    /**
     * A root boundary element supplied to the "flip" and "preventOverflow" modifiers.
     * This is a shorthand for overriding Popper.js modifier options with the `modifiers` prop.
     *
     * @see https://popper.js.org/docs/v2/utils/detect-overflow/#rootboundary
     */
    rootBoundary?: RootBoundary;

    /**
     * The placement (relative to the target) at which the popover should appear.
     * Mutually exclusive with `position` prop. Prefer using this over `position`,
     * as it more closely aligns with Popper.js semantics.
     *
     * The default value of `"auto"` will choose the best placement when opened
     * and will allow the popover to reposition itself to remain onscreen as the
     * user scrolls around.
     *
     * @default "auto"
     */
    placement?: Placement;

    /**
     * A space-delimited string of class names applied to the popover element.
     */
    popoverClassName?: string;

    /**
     * The position (relative to the target) at which the popover should appear.
     * Mutually exclusive with `placement` prop.
     *
     * The default value of `"auto"` will choose the best position when opened
     * and will allow the popover to reposition itself to remain onscreen as the
     * user scrolls around.
     *
     * @default "auto"
     */
    position?: PopoverPosition;

    /**
     * HTML tag name for the target element. This must be an HTML element to
     * ensure that it supports the necessary DOM event handlers.
     *
     * By default, a `<span>` tag is used so popovers appear as inline-block
     * elements and can be nested in text. Use `<div>` tag for a block element.
     *
     * If `fill` is set to `true`, this prop's default value will become `"div"`
     * instead of `"span"`.
     *
     * Note that _not all HTML tags are supported_; you will need to make sure
     * the tag you choose supports the HTML attributes Popover applies to the
     * target element.
     *
     * This prop is mutually exclusive with the `renderTarget` API.
     *
     * @default "span" ("div" if `fill={true}`)
     */
    targetTagName?: keyof JSX.IntrinsicElements;

    /**
     * HTML props for the target element. This is useful in some cases where you
     * need to render some simple attributes on the generated target element.
     *
     * For more complex use cases, consider using the `renderTarget` API instead.
     * This prop will be ignored if `renderTarget` is used.
     */
    targetProps?: TProps;

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
