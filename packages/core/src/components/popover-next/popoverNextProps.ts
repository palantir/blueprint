/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { PopoverAnimation, PopoverInteractionKind } from "../popover/popoverProps";
import type {
    DefaultPopoverTargetHTMLProps,
    PopoverClickTargetHandlers,
    PopoverHoverTargetHandlers,
} from "../popover/popoverSharedProps";
import type { PopupKind } from "../popover/popupKind";

import type {
    MiddlewareConfig,
    PopoverNextBoundary,
    PopoverNextPlacement,
    PopoverNextPositioningStrategy,
    PopoverNextRootBoundary,
} from "./middlewareTypes";
import { type usePopover } from "./usePopover";

// Re-export Blueprint-owned types for public API
export type {
    MiddlewareConfig,
    PopoverNextBoundary,
    PopoverNextPlacement,
    PopoverNextPositioningStrategy,
    PopoverNextRootBoundary,
} from "./middlewareTypes";

/**
 * Props interface for PopoverNext component.
 */
export interface PopoverNextProps<T extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps> {
    /**
     * The animation style to use for the popover.
     *
     * @default "scale"
     */
    animation?: PopoverAnimation;

    /**
     * Whether to show the arrow pointing to the target.
     *
     * @default true
     */
    arrow?: boolean;

    /**
     * Whether the popover/tooltip should acquire application focus when it first opens.
     *
     * @default true for click interactions, false for hover interactions
     */
    autoFocus?: boolean;

    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * A boundary element supplied to the positioning middleware.
     * This is a shorthand for overriding Floating UI middleware options with the `middleware` prop.
     */
    boundary?: PopoverNextBoundary;

    /**
     * When enabled, clicks inside a `Classes.POPOVER_DISMISS` element
     * will only close the current popover and not outer popovers.
     * When disabled, the current popover and any ancestor popovers will be closed.
     *
     * @default false
     */
    captureDismiss?: boolean;

    /** Whether the popover can be closed by pressing the Escape key. */
    canEscapeKeyClose?: boolean;

    /**
     * A space-delimited string of class names applied to the popover's target wrapper element.
     */
    className?: string;

    /** Interactive element which will trigger the popover. */
    children?: React.ReactNode;

    /** The content displayed inside the popover. */
    content?: string | React.JSX.Element;

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

    /** Whether the popover should enforce focus within itself. */
    enforceFocus?: boolean;

    /**
     * Whether the wrapper and target should take up the full width of their container.
     * Note that supplying `true` for this prop will force `targetTagName="div"`.
     */
    fill?: boolean;

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
     * The kind of interaction that triggers the display of the popover.
     *
     * @default "click"
     */
    interactionKind?: PopoverInteractionKind;

    /**
     * Whether the popover is visible. Passing this prop puts the popover in
     * controlled mode, where the only way to change visibility is by updating
     * this property. If `disabled={true}`, this prop will be ignored, and the
     * popover will remain closed.
     *
     * @default undefined
     */
    isOpen?: boolean;

    /** Whether the popover should be rendered lazily. */
    lazy?: boolean;

    /**
     * Whether the popover content should be sized to match the width of the target.
     * This is sometimes useful for dropdown menus.
     *
     * @default false
     */
    matchTargetWidth?: boolean;

    /**
     * Config for Floating UI middlewares.
     * Each config is a partial options object, keyed by its middleware name.
     *
     * For example, the arrow middleware can be configured by providing
     * `{ arrow: { element: arrowRef.current, padding: 5 } }`.
     *
     * Some of PopoverNext's default middlewares may get disabled under certain circumstances,
     * but you can re-enable and customize them. For example, "offset" is disabled when `minimal={true}`,
     * but you can re-enable it with `{ offset: { mainAxis: 10 } }`.
     *
     * @see https://floating-ui.com/docs/middleware
     */
    middleware?: MiddlewareConfig;

    /** Callback invoked when the popover is closed. */
    onClose?: (event?: React.SyntheticEvent<HTMLElement>) => void;

    /** Callback invoked when the popover has finished closing. */
    onClosed?: (node: HTMLElement) => void;

    /** Callback invoked when the popover is closing. */
    onClosing?: (node: HTMLElement) => void;

    /**
     * Callback invoked in controlled mode when the popover open state *would*
     * change due to user interaction.
     */
    onInteraction?: (nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => void;

    /** Callback invoked when the popover has finished opening. */
    onOpened?: (node: HTMLElement) => void;

    /** Callback invoked when the popover is opening. */
    onOpening?: (node: HTMLElement) => void;

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
     * The placement (relative to the target) at which the popover should appear.
     * Mutually exclusive with `position` prop. Prefer using this over `position`,
     * as it more closely aligns with Floating UI semantics.
     *
     * The default value of `undefined` will use automatic placement to choose the best placement when opened
     * and will allow the popover to reposition itself to remain onscreen as the
     * user scrolls around.
     */
    placement?: PopoverNextPlacement;

    /**
     * A space-delimited string of class names applied to the popover element.
     */
    popoverClassName?: string;

    /**
     * The CSS `position` strategy for the floating popover element.
     *
     * - `"absolute"` - The popover is positioned relative to its nearest positioned ancestor.
     *   Most common option, works well in most cases.
     * - `"fixed"` - The popover is positioned relative to the viewport. Useful when the reference
     *   element is in a fixed container or when you want to avoid issues with scroll containers.
     *
     * @see https://floating-ui.com/docs/usefloating#strategy
     * @default "absolute"
     */
    positioningStrategy?: PopoverNextPositioningStrategy;

    /**
     * The kind of popup displayed by the popover. Gets directly applied to the
     * `aria-haspopup` attribute of the target element. This property is
     * ignored if `interactionKind` is {@link PopoverInteractionKind.HOVER_TARGET_ONLY}.
     *
     * @default "menu" or undefined
     */
    popupKind?: PopupKind;

    /**
     * A space-delimited string of class names applied to the portal element.
     */
    portalClassName?: string;

    /**
     * The container element into which the popover content is rendered.
     */
    portalContainer?: HTMLElement;

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
        props: PopoverRenderTargetProps & PopoverHoverTargetHandlers<T> & PopoverClickTargetHandlers<T>,
    ) => React.JSX.Element;

    /**
     * A root boundary element supplied to the positioning middleware.
     * This is a shorthand for overriding Floating UI middleware options with the `middleware` prop.
     */
    rootBoundary?: PopoverNextRootBoundary;

    /**
     * Whether the application should return focus to the last active element in the
     * document after this popover closes.
     *
     * This is automatically overridden to `false` for hover interaction popovers,
     * since focus should remain on the trigger element per WCAG tooltip guidelines.
     *
     * If you are attaching a popover _and_ a tooltip to the same target, you must take
     * care to either disable this prop for the popover _or_ disable the tooltip's
     * `openOnTargetFocus` prop.
     *
     * **Note:** This default differs from the legacy `Popover` component, which defaults
     * to `false`. When migrating from `Popover` to `PopoverNext`, you may need to explicitly
     * set `shouldReturnFocusOnClose={false}` to preserve the previous behavior.
     *
     * @default true
     */
    shouldReturnFocusOnClose?: boolean;

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
    targetTagName?: keyof React.JSX.IntrinsicElements;

    /**
     * HTML props for the target element. This is useful in some cases where you
     * need to render some simple attributes on the generated target element.
     *
     * For more complex use cases, consider using the `renderTarget` API instead.
     * This prop will be ignored if `renderTarget` is used.
     */
    targetProps?: T;

    /**
     * The duration of the popover's transition in milliseconds.
     */
    transitionDuration?: number;

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

/**
 * Props interface for the PopoverTarget component.
 */
export interface PopoverTargetProps
    extends Pick<
        PopoverNextProps,
        | "children"
        | "disabled"
        | "fill"
        | "interactionKind"
        | "openOnTargetFocus"
        | "popupKind"
        | "renderTarget"
        | "targetProps"
        | "targetTagName"
    > {
    className?: string;
    floatingData: ReturnType<typeof usePopover>;
    handleMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
    handleMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
    handleTargetBlur: (event: React.FocusEvent<HTMLElement>) => void;
    handleTargetContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleTargetFocus: (event: React.FocusEvent<HTMLElement>) => void;
    isContentEmpty: boolean;
    isControlled: boolean;
    isHoverInteractionKind: boolean;
}

/**
 * Props interface for the PopoverPopup component.
 */
export interface PopoverPopupProps
    extends Pick<
        PopoverNextProps,
        | "arrow"
        | "animation"
        | "autoFocus"
        | "backdropProps"
        | "canEscapeKeyClose"
        | "captureDismiss"
        | "content"
        | "enforceFocus"
        | "hasBackdrop"
        | "inheritDarkTheme"
        | "interactionKind"
        | "lazy"
        | "matchTargetWidth"
        | "onClosed"
        | "onClosing"
        | "onOpened"
        | "onOpening"
        | "popoverClassName"
        | "portalClassName"
        | "portalContainer"
        | "shouldReturnFocusOnClose"
        | "transitionDuration"
        | "usePortal"
    > {
    arrowRef: React.MutableRefObject<null>;
    floatingData: ReturnType<typeof usePopover>;
    handleMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
    handleMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
    handleOverlayClose: (event?: React.SyntheticEvent<HTMLElement>) => void;
    handlePopoverClick: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    hasDarkParent: boolean;
    isClosingViaEscapeKeypress: boolean;
    isHoverInteractionKind: boolean;
}

/**
 * Properties injected by PopoverNext when rendering custom targets via the `renderTarget` API.
 */
export interface PopoverRenderTargetProps
    extends Pick<React.HTMLAttributes<HTMLElement>, "aria-haspopup" | "aria-expanded" | "className" | "tabIndex"> {
    /** Target ref. */
    ref: React.Ref<any>;

    /** Whether the popover or tooltip is currently open. */
    isOpen: boolean;
}
