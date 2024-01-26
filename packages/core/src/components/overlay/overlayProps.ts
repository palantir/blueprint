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

import type { Props } from "../../common/props";

export interface OverlayableProps extends OverlayLifecycleProps {
    /**
     * Whether the overlay should acquire application focus when it first opens.
     *
     * @default true
     */
    autoFocus?: boolean;

    /**
     * Whether pressing the `esc` key should invoke `onClose`.
     *
     * @default true
     */
    canEscapeKeyClose?: boolean;

    /**
     * Whether the overlay should prevent focus from leaving itself. That is, if the user attempts
     * to focus an element outside the overlay and this prop is enabled, then the overlay will
     * immediately bring focus back to itself. If you are nesting overlay components, either disable
     * this prop on the "outermost" overlays or mark the nested ones `usePortal={false}`.
     *
     * @default true
     */
    enforceFocus?: boolean;

    /**
     * If `true` and `usePortal={true}`, the `Portal` containing the children is created and attached
     * to the DOM when the overlay is opened for the first time; otherwise this happens when the
     * component mounts. Lazy mounting provides noticeable performance improvements if you have lots
     * of overlays at once, such as on each row of a table.
     *
     * @default true
     */
    lazy?: boolean;

    /**
     * Whether the application should return focus to the last active element in the
     * document after this overlay closes.
     *
     * @default true
     */
    shouldReturnFocusOnClose?: boolean;

    /**
     * Indicates how long (in milliseconds) the overlay's enter/leave transition takes.
     * This is used by React `CSSTransition` to know when a transition completes and must match
     * the duration of the animation in CSS. Only set this prop if you override Blueprint's default
     * transitions with new transitions of a different length.
     *
     * @default 300
     */
    transitionDuration?: number;

    /**
     * Whether the overlay should be wrapped in a `Portal`, which renders its contents in a new
     * element attached to `portalContainer` prop.
     *
     * This prop essentially determines which element is covered by the backdrop: if `false`,
     * then only its parent is covered; otherwise, the entire page is covered (because the parent
     * of the `Portal` is the `<body>` itself).
     *
     * Set this prop to `false` on nested overlays (such as `Dialog` or `Popover`) to ensure that they
     * are rendered above their parents.
     *
     * @default true
     */
    usePortal?: boolean;

    /**
     * Space-delimited string of class names applied to the `Portal` element if
     * `usePortal={true}`.
     */
    portalClassName?: string;

    /**
     * The container element into which the overlay renders its contents, when `usePortal` is `true`.
     * This prop is ignored if `usePortal` is `false`.
     *
     * @default document.body
     */
    portalContainer?: HTMLElement;

    /**
     * A list of DOM events which should be stopped from propagating through the Portal.
     * This prop is ignored if `usePortal` is `false`.
     *
     * @deprecated this prop's implementation no longer works in React v17+
     * @see https://legacy.reactjs.org/docs/portals.html#event-bubbling-through-portals
     * @see https://github.com/palantir/blueprint/issues/6124
     * @see https://github.com/palantir/blueprint/issues/6580
     */
    portalStopPropagationEvents?: Array<keyof HTMLElementEventMap>;

    /**
     * A callback that is invoked when user interaction causes the overlay to close, such as
     * clicking on the overlay or pressing the `esc` key (if enabled).
     *
     * Receives the event from the user's interaction, if there was an event (generally either a
     * mouse or key event). Note that, since this component is controlled by the `isOpen` prop, it
     * will not actually close itself until that prop becomes `false`.
     */
    onClose?: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export interface OverlayLifecycleProps {
    /**
     * Lifecycle method invoked just before the CSS _close_ transition begins on
     * a child. Receives the DOM element of the child being closed.
     */
    onClosing?: (node: HTMLElement) => void;

    /**
     * Lifecycle method invoked just after the CSS _close_ transition ends but
     * before the child has been removed from the DOM. Receives the DOM element
     * of the child being closed.
     */
    onClosed?: (node: HTMLElement) => void;

    /**
     * Lifecycle method invoked just after mounting the child in the DOM but
     * just before the CSS _open_ transition begins. Receives the DOM element of
     * the child being opened.
     */
    onOpening?: (node: HTMLElement) => void;

    /**
     * Lifecycle method invoked just after the CSS _open_ transition ends.
     * Receives the DOM element of the child being opened.
     */
    onOpened?: (node: HTMLElement) => void;
}

export interface BackdropProps {
    /** CSS class names to apply to backdrop element. */
    backdropClassName?: string;

    /** HTML props for the backdrop element. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * Whether clicking outside the overlay element (either on backdrop when present or on document)
     * should invoke `onClose`.
     *
     * @default true
     */
    canOutsideClickClose?: boolean;

    /**
     * Whether a container-spanning backdrop element should be rendered behind the contents.
     * When `false`, users will be able to scroll through and interact with overlaid content.
     *
     * @default true
     */
    hasBackdrop?: boolean;
}

export interface OverlayProps extends OverlayableProps, BackdropProps, Props {
    /** Element to overlay. */
    children?: React.ReactNode;

    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * Name of the transition for internal `CSSTransition`.
     * Providing your own name here will require defining new CSS transition properties.
     *
     * @default Classes.OVERLAY
     */
    transitionName?: string;
}
