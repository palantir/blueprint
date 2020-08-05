/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// tslint:disable-next-line no-submodule-imports
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

import { findDOMNode } from "react-dom";
import { AbstractPureComponent2, Classes, Keys } from "../../common";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Portal } from "../portal/portal";

export interface IOverlayableProps extends IOverlayLifecycleProps {
    /**
     * Whether the overlay should acquire application focus when it first opens.
     * @default true
     */
    autoFocus?: boolean;

    /**
     * Whether pressing the `esc` key should invoke `onClose`.
     * @default true
     */
    canEscapeKeyClose?: boolean;

    /**
     * Whether the overlay should prevent focus from leaving itself. That is, if the user attempts
     * to focus an element outside the overlay and this prop is enabled, then the overlay will
     * immediately bring focus back to itself. If you are nesting overlay components, either disable
     * this prop on the "outermost" overlays or mark the nested ones `usePortal={false}`.
     * @default true
     */
    enforceFocus?: boolean;

    /**
     * If `true` and `usePortal={true}`, the `Portal` containing the children is created and attached
     * to the DOM when the overlay is opened for the first time; otherwise this happens when the
     * component mounts. Lazy mounting provides noticeable performance improvements if you have lots
     * of overlays at once, such as on each row of a table.
     * @default true
     */
    lazy?: boolean;

    /**
     * Indicates how long (in milliseconds) the overlay's enter/leave transition takes.
     * This is used by React `CSSTransition` to know when a transition completes and must match
     * the duration of the animation in CSS. Only set this prop if you override Blueprint's default
     * transitions with new transitions of a different length.
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
     * @default document.body
     */
    portalContainer?: HTMLElement;

    /**
     * A callback that is invoked when user interaction causes the overlay to close, such as
     * clicking on the overlay or pressing the `esc` key (if enabled).
     *
     * Receives the event from the user's interaction, if there was an event (generally either a
     * mouse or key event). Note that, since this component is controlled by the `isOpen` prop, it
     * will not actually close itself until that prop becomes `false`.
     */
    onClose?: (event?: React.SyntheticEvent<HTMLElement>) => void;
}

export interface IOverlayLifecycleProps {
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

export interface IBackdropProps {
    /** CSS class names to apply to backdrop element. */
    backdropClassName?: string;

    /** HTML props for the backdrop element. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * Whether clicking outside the overlay element (either on backdrop when present or on document)
     * should invoke `onClose`.
     * @default true
     */
    canOutsideClickClose?: boolean;

    /**
     * Whether a container-spanning backdrop element should be rendered behind the contents.
     * @default true
     */
    hasBackdrop?: boolean;
}

export interface IOverlayProps extends IOverlayableProps, IBackdropProps, IProps {
    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * Name of the transition for internal `CSSTransition`.
     * Providing your own name here will require defining new CSS transition properties.
     * @default Classes.OVERLAY
     */
    transitionName?: string;
}

export interface IOverlayState {
    hasEverOpened?: boolean;
}

@polyfill
export class Overlay extends AbstractPureComponent2<IOverlayProps, IOverlayState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Overlay`;

    public static defaultProps: IOverlayProps = {
        autoFocus: true,
        backdropProps: {},
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        isOpen: false,
        lazy: true,
        transitionDuration: 300,
        transitionName: Classes.OVERLAY,
        usePortal: true,
    };

    public static getDerivedStateFromProps({ isOpen: hasEverOpened }: IOverlayProps) {
        if (hasEverOpened) {
            return { hasEverOpened };
        }
        return null;
    }

    private static openStack: Overlay[] = [];
    private static getLastOpened = () => Overlay.openStack[Overlay.openStack.length - 1];

    // an HTMLElement that contains the backdrop and any children, to query for focus target
    public containerElement: HTMLElement;
    private refHandlers = {
        container: (ref: React.ReactInstance) => (this.containerElement = findDOMNode(ref) as HTMLElement),
    };

    public constructor(props?: IOverlayProps, context?: any) {
        super(props, context);
        this.state = { hasEverOpened: props.isOpen };
    }

    public render() {
        // oh snap! no reason to render anything at all if we're being truly lazy
        if (this.props.lazy && !this.state.hasEverOpened) {
            return null;
        }

        const { children, className, usePortal, isOpen } = this.props;

        // TransitionGroup types require single array of children; does not support nested arrays.
        // So we must collapse backdrop and children into one array, and every item must be wrapped in a
        // Transition element (no ReactText allowed).
        const childrenWithTransitions = isOpen ? React.Children.map(children, this.maybeRenderChild) : [];
        childrenWithTransitions.unshift(this.maybeRenderBackdrop());

        const containerClasses = classNames(
            Classes.OVERLAY,
            {
                [Classes.OVERLAY_OPEN]: isOpen,
                [Classes.OVERLAY_INLINE]: !usePortal,
            },
            className,
        );

        const transitionGroup = (
            <TransitionGroup
                appear={true}
                className={containerClasses}
                component="div"
                onKeyDown={this.handleKeyDown}
                ref={this.refHandlers.container}
            >
                {childrenWithTransitions}
            </TransitionGroup>
        );
        if (usePortal) {
            return (
                <Portal className={this.props.portalClassName} container={this.props.portalContainer}>
                    {transitionGroup}
                </Portal>
            );
        } else {
            return transitionGroup;
        }
    }

    public componentDidMount() {
        if (this.props.isOpen) {
            this.overlayWillOpen();
        }
    }

    public componentDidUpdate(prevProps: IOverlayProps) {
        if (prevProps.isOpen && !this.props.isOpen) {
            this.overlayWillClose();
        } else if (!prevProps.isOpen && this.props.isOpen) {
            this.overlayWillOpen();
        }
    }

    public componentWillUnmount() {
        this.overlayWillClose();
    }

    /**
     * @public for testing
     * @internal
     */
    public bringFocusInsideOverlay() {
        // always delay focus manipulation to just before repaint to prevent scroll jumping
        return requestAnimationFrame(() => {
            // container ref may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            if (this.containerElement == null || document.activeElement == null || !this.props.isOpen) {
                return;
            }

            const isFocusOutsideModal = !this.containerElement.contains(document.activeElement);
            if (isFocusOutsideModal) {
                // element marked autofocus has higher priority than the other clowns
                const autofocusElement = this.containerElement.querySelector("[autofocus]") as HTMLElement;
                const wrapperElement = this.containerElement.querySelector("[tabindex]") as HTMLElement;
                if (autofocusElement != null) {
                    autofocusElement.focus();
                } else if (wrapperElement != null) {
                    wrapperElement.focus();
                }
            }
        });
    }

    private maybeRenderChild = (child?: React.ReactChild) => {
        if (child == null) {
            return null;
        }
        // add a special class to each child element that will automatically set the appropriate
        // CSS position mode under the hood. also, make the container focusable so we can
        // trap focus inside it (via `enforceFocus`).
        const decoratedChild =
            typeof child === "object" ? (
                React.cloneElement(child, {
                    className: classNames(child.props.className, Classes.OVERLAY_CONTENT),
                    tabIndex: 0,
                })
            ) : (
                <span className={Classes.OVERLAY_CONTENT}>{child}</span>
            );
        const { onOpening, onOpened, onClosing, onClosed, transitionDuration, transitionName } = this.props;

        // a breaking change in react-transition-group types requires us to be explicit about the type overload here,
        // using a technique similar to Select.ofType() in @blueprintjs/select
        const CSSTransitionImplicit = CSSTransition as new (props: CSSTransitionProps<undefined>) => CSSTransition<
            undefined
        >;

        return (
            <CSSTransitionImplicit
                classNames={transitionName}
                onEntering={onOpening}
                onEntered={onOpened}
                onExiting={onClosing}
                onExited={onClosed}
                timeout={transitionDuration}
            >
                {decoratedChild}
            </CSSTransitionImplicit>
        );
    };

    private maybeRenderBackdrop() {
        const {
            backdropClassName,
            backdropProps,
            hasBackdrop,
            isOpen,
            transitionDuration,
            transitionName,
        } = this.props;

        if (hasBackdrop && isOpen) {
            return (
                <CSSTransition classNames={transitionName} key="__backdrop" timeout={transitionDuration}>
                    <div
                        {...backdropProps}
                        className={classNames(Classes.OVERLAY_BACKDROP, backdropClassName, backdropProps.className)}
                        onMouseDown={this.handleBackdropMouseDown}
                        tabIndex={this.props.canOutsideClickClose ? 0 : null}
                    />
                </CSSTransition>
            );
        } else {
            return null;
        }
    }

    private overlayWillClose() {
        document.removeEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", this.handleDocumentClick);

        const { openStack } = Overlay;
        const stackIndex = openStack.indexOf(this);
        if (stackIndex !== -1) {
            openStack.splice(stackIndex, 1);
            if (openStack.length > 0) {
                const lastOpenedOverlay = Overlay.getLastOpened();
                if (lastOpenedOverlay.props.enforceFocus) {
                    document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
                }
            }

            if (openStack.filter(o => o.props.usePortal && o.props.hasBackdrop).length === 0) {
                document.body.classList.remove(Classes.OVERLAY_OPEN);
            }
        }
    }

    private overlayWillOpen() {
        const { openStack } = Overlay;
        if (openStack.length > 0) {
            document.removeEventListener("focus", Overlay.getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(this);

        if (this.props.autoFocus) {
            this.bringFocusInsideOverlay();
        }
        if (this.props.enforceFocus) {
            document.addEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        }

        if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
            document.addEventListener("mousedown", this.handleDocumentClick);
        }

        if (this.props.hasBackdrop && this.props.usePortal) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }
    }

    private handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const { backdropProps, canOutsideClickClose, enforceFocus, onClose } = this.props;
        if (canOutsideClickClose) {
            safeInvoke(onClose, e);
        }
        if (enforceFocus) {
            // make sure document.activeElement is updated before bringing the focus back
            this.bringFocusInsideOverlay();
        }
        safeInvoke(backdropProps.onMouseDown, e);
    };

    private handleDocumentClick = (e: MouseEvent) => {
        const { canOutsideClickClose, isOpen, onClose } = this.props;
        // get the actually target even if we are in an open mode Shadow DOM
        const eventTarget = (e.composed ? e.composedPath()[0] : e.target) as HTMLElement;

        const stackIndex = Overlay.openStack.indexOf(this);
        const isClickInThisOverlayOrDescendant = Overlay.openStack
            .slice(stackIndex)
            .some(({ containerElement: elem }) => {
                // `elem` is the container of backdrop & content, so clicking on that container
                // should not count as being "inside" the overlay.
                return elem && elem.contains(eventTarget) && !elem.isSameNode(eventTarget);
            });

        if (isOpen && canOutsideClickClose && !isClickInThisOverlayOrDescendant) {
            // casting to any because this is a native event
            safeInvoke(onClose, e as any);
        }
    };

    private handleDocumentFocus = (e: FocusEvent) => {
        // get the actually target even if we are in an open mode Shadow DOM
        const eventTarget = e.composed ? e.composedPath()[0] : e.target;
        if (
            this.props.enforceFocus &&
            this.containerElement != null &&
            eventTarget instanceof Node &&
            !this.containerElement.contains(eventTarget as HTMLElement)
        ) {
            // prevent default focus behavior (sometimes auto-scrolls the page)
            e.preventDefault();
            e.stopImmediatePropagation();
            this.bringFocusInsideOverlay();
        }
    };

    private handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        const { canEscapeKeyClose, onClose } = this.props;
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable-next-line deprecation/deprecation */
        if (e.which === Keys.ESCAPE && canEscapeKeyClose) {
            safeInvoke(onClose, e);
            // prevent browser-specific escape key behavior (Safari exits fullscreen)
            e.preventDefault();
        }
    };
}
