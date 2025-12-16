/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { PositioningStrategy } from "@popperjs/core";
import type * as React from "react";

import type { DefaultPopoverTargetHTMLProps, PopoverSharedProps } from "./popoverSharedProps";
import type { PopupKind } from "./popupKind";

export const PopoverInteractionKind = {
    CLICK: "click" as const,
    CLICK_TARGET_ONLY: "click-target" as const,
    HOVER: "hover" as const,
    HOVER_TARGET_ONLY: "hover-target" as const,
};
export type PopoverInteractionKind = (typeof PopoverInteractionKind)[keyof typeof PopoverInteractionKind];

export interface PopoverProps<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps>
    extends PopoverSharedProps<TProps> {
    /**
     * Whether the popover/tooltip should acquire application focus when it first opens.
     *
     * @default true for click interactions, false for hover interactions
     */
    autoFocus?: boolean;

    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * The kind of interaction that triggers the display of the popover.
     *
     * @default "click"
     */
    interactionKind?: PopoverInteractionKind;

    /**
     * The kind of popup displayed by the popover. Gets directly applied to the
     * `aria-haspopup` attribute of the target element. This property is
     * ignored if `interactionKind` is {@link PopoverInteractionKind.HOVER_TARGET_ONLY}.
     *
     * @default "menu" or undefined
     */
    popupKind?: PopupKind;

    /**
     * Enables an invisible overlay beneath the popover that captures clicks and
     * prevents interaction with the rest of the document until the popover is
     * closed. This prop is only available when `interactionKind` is
     * `PopoverInteractionKind.CLICK`. When popovers with backdrop are opened,
     * they become focused.
     *
     * @default false
     */
    hasBackdrop?: boolean;

    /**
     * Whether the application should return focus to the last active element in the
     * document after this popover closes.
     *
     * This is automatically set (overridden) to:
     *  - `false` for hover interaction popovers
     *  - `true` when a popover closes due to an ESC keypress
     *
     * If you are attaching a popover _and_ a tooltip to the same target, you must take
     * care to either disable this prop for the popover _or_ disable the tooltip's
     * `openOnTargetFocus` prop.
     *
     * @default false
     */
    shouldReturnFocusOnClose?: boolean;

    /**
     * Popper.js positioning strategy.
     *
     * @see https://popper.js.org/docs/v2/constructors/#strategy
     * @default "absolute"
     */
    positioningStrategy?: PositioningStrategy;
}
