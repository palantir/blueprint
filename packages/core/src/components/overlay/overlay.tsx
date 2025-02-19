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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to Overlay2 instead.
 */

/* eslint-disable @typescript-eslint/no-deprecated */

import classNames from "classnames";
import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { AbstractPureComponent, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps } from "../../common/props";
import { getActiveElement, isFunction } from "../../common/utils";
import { Portal } from "../portal/portal";

import type { OverlayProps } from "./overlayProps";
import { getKeyboardFocusableElements } from "./overlayUtils";

export interface OverlayState {
    hasEverOpened?: boolean;
}

/**
 * Overlay component.
 *
 * @deprecated use `Overlay2` instead
 * @see https://blueprintjs.com/docs/#core/components/overlay
 */
export class Overlay extends AbstractPureComponent<OverlayProps, OverlayState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Overlay`;

    public static defaultProps: OverlayProps = {
        autoFocus: true,
        backdropProps: {},
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        isOpen: false,
        lazy: true,
        shouldReturnFocusOnClose: true,
        transitionDuration: 300,
        transitionName: Classes.OVERLAY,
        usePortal: true,
    };

    public static getDerivedStateFromProps({ isOpen: hasEverOpened }: OverlayProps) {
        if (hasEverOpened) {
            return { hasEverOpened };
        }
        return null;
    }

    private static openStack: Overlay[] = [];

    private static getLastOpened = () => Overlay.openStack[Overlay.openStack.length - 1];

    private isAutoFocusing = false;

    private lastActiveElementBeforeOpened: Element | null | undefined;

    public state: OverlayState = {
        hasEverOpened: this.props.isOpen,
    };

    /** Ref for container element, containing all children and the backdrop */
    public containerElement = React.createRef<HTMLDivElement>();

    // An empty, keyboard-focusable div at the beginning of the Overlay content
    private startFocusTrapElement = React.createRef<HTMLDivElement>();

    // An empty, keyboard-focusable div at the end of the Overlay content
    private endFocusTrapElement = React.createRef<HTMLDivElement>();

    public render() {
        // oh snap! no reason to render anything at all if we're being truly lazy
        if (this.props.lazy && !this.state.hasEverOpened) {
            return null;
        }

        const { autoFocus, children, className, enforceFocus, usePortal, isOpen } = this.props;

        // TransitionGroup types require single array of children; does not support nested arrays.
        // So we must collapse backdrop and children into one array, and every item must be wrapped in a
        // Transition element (no ReactText allowed).
        const childrenWithTransitions = isOpen ? React.Children.map(children, this.maybeRenderChild) ?? [] : [];

        const maybeBackdrop = this.maybeRenderBackdrop();
        if (maybeBackdrop !== null) {
            childrenWithTransitions.unshift(maybeBackdrop);
        }
        if (isOpen && (autoFocus || enforceFocus) && childrenWithTransitions.length > 0) {
            childrenWithTransitions.unshift(
                this.renderDummyElement("__start", {
                    className: Classes.OVERLAY_START_FOCUS_TRAP,
                    onFocus: this.handleStartFocusTrapElementFocus,
                    onKeyDown: this.handleStartFocusTrapElementKeyDown,
                    ref: this.startFocusTrapElement,
                }),
            );
            if (enforceFocus) {
                childrenWithTransitions.push(
                    this.renderDummyElement("__end", {
                        className: Classes.OVERLAY_END_FOCUS_TRAP,
                        onFocus: this.handleEndFocusTrapElementFocus,
                        ref: this.endFocusTrapElement,
                    }),
                );
            }
        }

        const containerClasses = classNames(
            Classes.OVERLAY,
            {
                [Classes.OVERLAY_OPEN]: isOpen,
                [Classes.OVERLAY_INLINE]: !usePortal,
            },
            className,
        );

        const transitionGroup = (
            <div
                aria-live="polite"
                className={containerClasses}
                onKeyDown={this.handleKeyDown}
                ref={this.containerElement}
            >
                <TransitionGroup appear={true} component={null}>
                    {childrenWithTransitions}
                </TransitionGroup>
            </div>
        );
        if (usePortal) {
            return (
                <Portal
                    className={this.props.portalClassName}
                    container={this.props.portalContainer}
                    stopPropagationEvents={this.props.portalStopPropagationEvents}
                >
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

    public componentDidUpdate(prevProps: OverlayProps) {
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
        return this.requestAnimationFrame(() => {
            // container element may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            const activeElement = getActiveElement(this.containerElement.current);

            if (this.containerElement.current == null || activeElement == null || !this.props.isOpen) {
                return;
            }

            const container = this.containerElement.current;
            const isFocusOutsideModal = !container.contains(activeElement);
            if (isFocusOutsideModal) {
                this.startFocusTrapElement.current?.focus({ preventScroll: true });
                this.isAutoFocusing = false;
            }
        });
    }

    private maybeRenderChild = (child?: React.ReactNode | (() => React.ReactNode)) => {
        if (isFunction(child)) {
            child = child();
        }

        if (child == null) {
            return null;
        }

        // decorate the child with a few injected props
        const tabIndex = this.props.enforceFocus || this.props.autoFocus ? 0 : undefined;
        const decoratedChild =
            typeof child === "object" ? (
                React.cloneElement(child as React.ReactElement, {
                    className: classNames((child as React.ReactElement).props.className, Classes.OVERLAY_CONTENT),
                    tabIndex,
                })
            ) : (
                <span className={Classes.OVERLAY_CONTENT} tabIndex={tabIndex}>
                    {child}
                </span>
            );

        const { onOpening, onOpened, onClosing, transitionDuration, transitionName } = this.props;

        return (
            <CSSTransition
                classNames={transitionName}
                onEntering={onOpening}
                onEntered={onOpened}
                onExiting={onClosing}
                onExited={this.handleTransitionExited}
                timeout={transitionDuration}
                addEndListener={this.handleTransitionAddEnd}
            >
                {decoratedChild}
            </CSSTransition>
        );
    };

    private maybeRenderBackdrop() {
        const { backdropClassName, backdropProps, hasBackdrop, isOpen, transitionDuration, transitionName } =
            this.props;

        if (hasBackdrop && isOpen) {
            return (
                <CSSTransition
                    classNames={transitionName}
                    key="__backdrop"
                    timeout={transitionDuration}
                    addEndListener={this.handleTransitionAddEnd}
                >
                    <div
                        {...backdropProps}
                        className={classNames(Classes.OVERLAY_BACKDROP, backdropClassName, backdropProps?.className)}
                        onMouseDown={this.handleBackdropMouseDown}
                    />
                </CSSTransition>
            );
        } else {
            return null;
        }
    }

    private renderDummyElement(key: string, props: HTMLDivProps & { ref?: React.Ref<HTMLDivElement> }) {
        const { transitionDuration, transitionName } = this.props;
        return (
            <CSSTransition
                classNames={transitionName}
                key={key}
                addEndListener={this.handleTransitionAddEnd}
                timeout={transitionDuration}
                unmountOnExit={true}
            >
                <div tabIndex={0} {...props} />
            </CSSTransition>
        );
    }

    /**
     * Ensures repeatedly pressing shift+tab keeps focus inside the Overlay. Moves focus to
     * the `endFocusTrapElement` or the first keyboard-focusable element in the Overlay (excluding
     * the `startFocusTrapElement`), depending on whether the element losing focus is inside the
     * Overlay.
     */
    private handleStartFocusTrapElementFocus = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!this.props.enforceFocus || this.isAutoFocusing) {
            return;
        }
        // e.relatedTarget will not be defined if this was a programmatic focus event, as is the
        // case when we call this.bringFocusInsideOverlay() after a user clicked on the backdrop.
        // Otherwise, we're handling a user interaction, and we should wrap around to the last
        // element in this transition group.
        if (
            e.relatedTarget != null &&
            this.containerElement.current?.contains(e.relatedTarget as Element) &&
            e.relatedTarget !== this.endFocusTrapElement.current
        ) {
            this.endFocusTrapElement.current?.focus({ preventScroll: true });
        }
    };

    /**
     * Wrap around to the end of the dialog if `enforceFocus` is enabled.
     */
    private handleStartFocusTrapElementKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!this.props.enforceFocus) {
            return;
        }
        if (e.shiftKey && e.key === "Tab") {
            const lastFocusableElement = getKeyboardFocusableElements(this.containerElement).pop();
            if (lastFocusableElement != null) {
                lastFocusableElement.focus();
            } else {
                this.endFocusTrapElement.current?.focus({ preventScroll: true });
            }
        }
    };

    /**
     * Ensures repeatedly pressing tab keeps focus inside the Overlay. Moves focus to the
     * `startFocusTrapElement` or the last keyboard-focusable element in the Overlay (excluding the
     * `startFocusTrapElement`), depending on whether the element losing focus is inside the
     * Overlay.
     */
    private handleEndFocusTrapElementFocus = (e: React.FocusEvent<HTMLDivElement>) => {
        // No need for this.props.enforceFocus check here because this element is only rendered
        // when that prop is true.
        // During user interactions, e.relatedTarget will be defined, and we should wrap around to the
        // "start focus trap" element.
        // Otherwise, we're handling a programmatic focus event, which can only happen after a user
        // presses shift+tab from the first focusable element in the overlay.
        if (
            e.relatedTarget != null &&
            this.containerElement.current?.contains(e.relatedTarget as Element) &&
            e.relatedTarget !== this.startFocusTrapElement.current
        ) {
            const firstFocusableElement = getKeyboardFocusableElements(this.containerElement).shift();
            // ensure we don't re-focus an already active element by comparing against e.relatedTarget
            if (!this.isAutoFocusing && firstFocusableElement != null && firstFocusableElement !== e.relatedTarget) {
                firstFocusableElement.focus();
            } else {
                this.startFocusTrapElement.current?.focus({ preventScroll: true });
            }
        } else {
            const lastFocusableElement = getKeyboardFocusableElements(this.containerElement).pop();
            if (lastFocusableElement != null) {
                lastFocusableElement.focus();
            } else {
                // Keeps focus within Overlay even if there are no keyboard-focusable children
                this.startFocusTrapElement.current?.focus({ preventScroll: true });
            }
        }
    };

    private overlayWillClose() {
        document.removeEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", this.handleDocumentClick);

        const { openStack } = Overlay;
        const stackIndex = openStack.indexOf(this);
        if (stackIndex !== -1) {
            openStack.splice(stackIndex, 1);
            if (openStack.length > 0) {
                const lastOpenedOverlay = Overlay.getLastOpened();
                // Only bring focus back to last overlay if it had autoFocus _and_ enforceFocus enabled.
                // If `autoFocus={false}`, it's likely that the overlay never received focus in the first place,
                // so it would be surprising for us to send it there. See https://github.com/palantir/blueprint/issues/4921
                if (lastOpenedOverlay.props.autoFocus && lastOpenedOverlay.props.enforceFocus) {
                    lastOpenedOverlay.bringFocusInsideOverlay();
                    document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
                }
            }

            if (openStack.filter(o => o.props.usePortal && o.props.hasBackdrop).length === 0) {
                document.body.classList.remove(Classes.OVERLAY_OPEN);
            }
        }
    }

    private overlayWillOpen() {
        const { getLastOpened, openStack } = Overlay;
        if (openStack.length > 0) {
            document.removeEventListener("focus", getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(this);

        if (this.props.autoFocus) {
            this.isAutoFocusing = true;
            this.bringFocusInsideOverlay();
        }

        if (this.props.enforceFocus) {
            // Focus events do not bubble, but setting useCapture allows us to listen in and execute
            // our handler before all others
            document.addEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        }

        if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
            document.addEventListener("mousedown", this.handleDocumentClick);
        }

        if (this.props.hasBackdrop && this.props.usePortal) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }

        this.lastActiveElementBeforeOpened = getActiveElement(this.containerElement.current);
    }

    private handleTransitionExited = (node: HTMLElement) => {
        if (this.props.shouldReturnFocusOnClose && this.lastActiveElementBeforeOpened instanceof HTMLElement) {
            this.lastActiveElementBeforeOpened.focus();
        }
        this.props.onClosed?.(node);
    };

    private handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const { backdropProps, canOutsideClickClose, enforceFocus, onClose } = this.props;
        if (canOutsideClickClose) {
            onClose?.(e);
        }
        if (enforceFocus) {
            this.bringFocusInsideOverlay();
        }
        backdropProps?.onMouseDown?.(e);
    };

    private handleDocumentClick = (e: MouseEvent) => {
        const { canOutsideClickClose, isOpen, onClose } = this.props;
        // get the actual target even in the Shadow DOM
        // see https://github.com/palantir/blueprint/issues/4220
        const eventTarget = (e.composed ? e.composedPath()[0] : e.target) as HTMLElement;

        const stackIndex = Overlay.openStack.indexOf(this);
        const isClickInThisOverlayOrDescendant = Overlay.openStack
            .slice(stackIndex)
            .some(({ containerElement: elem }) => {
                // `elem` is the container of backdrop & content, so clicking directly on that container
                // should not count as being "inside" the overlay.
                return elem.current?.contains(eventTarget) && !elem.current.isSameNode(eventTarget);
            });

        if (isOpen && !isClickInThisOverlayOrDescendant && canOutsideClickClose) {
            // casting to any because this is a native event
            onClose?.(e as any);
        }
    };

    /**
     * When multiple Overlays are open, this event handler is only active for the most recently
     * opened one to avoid Overlays competing with each other for focus.
     */
    private handleDocumentFocus = (e: FocusEvent) => {
        // get the actual target even in the Shadow DOM
        // see https://github.com/palantir/blueprint/issues/4220
        const eventTarget = e.composed ? e.composedPath()[0] : e.target;
        if (
            this.props.enforceFocus &&
            this.containerElement.current != null &&
            eventTarget instanceof Node &&
            !this.containerElement.current.contains(eventTarget as HTMLElement)
        ) {
            // prevent default focus behavior (sometimes auto-scrolls the page)
            e.preventDefault();
            e.stopImmediatePropagation();
            this.bringFocusInsideOverlay();
        }
    };

    private handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        const { canEscapeKeyClose, onClose } = this.props;
        if (e.key === "Escape" && canEscapeKeyClose) {
            onClose?.(e);
            // prevent other overlays from closing
            e.stopPropagation();
            // prevent browser-specific escape key behavior (Safari exits fullscreen)
            e.preventDefault();
        }
    };

    private handleTransitionAddEnd = () => {
        // no-op
    };
}
