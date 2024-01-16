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

import classNames from "classnames";
import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps } from "../../common/props";
import { getActiveElement, isFunction } from "../../common/utils";
import type { OverlayProps } from "../overlay/overlayProps";
import { Portal } from "../portal/portal";

// HACKHACK: move global state to context
const openStack: OverlayInstance[] = [];
const getLastOpened = () => openStack[openStack.length - 1];

export interface OverlayInstance {
    bringFocusInsideOverlay: () => void;
    containerElement: React.RefObject<HTMLDivElement>;
    handleDocumentFocus: (e: FocusEvent) => void;
    isAutoFocusing: boolean;
    lastActiveElementBeforeOpened: Element | null | undefined;
    props: Pick<OverlayProps, "autoFocus" | "enforceFocus" | "usePortal" | "hasBackdrop">;
}

export interface Overlay2Props extends OverlayProps {
    ref?: React.MutableRefObject<OverlayInstance>;
}

export const Overlay2: React.FC<Overlay2Props> = ({
    autoFocus,
    backdropClassName,
    backdropProps,
    canEscapeKeyClose,
    canOutsideClickClose,
    children,
    className,
    enforceFocus,
    hasBackdrop,
    isOpen,
    lazy,
    onClose,
    onClosed,
    onClosing,
    onOpened,
    onOpening,
    portalClassName,
    portalContainer,
    ref,
    shouldReturnFocusOnClose,
    transitionDuration,
    transitionName,
    usePortal,
}) => {
    const [isAutoFocusing, setIsAutoFocusing] = React.useState(false);
    const [lastActiveElementBeforeOpened, setLastActiveElementBeforeOpened] = React.useState<Element | null>(null);
    const [hasEverOpened, setHasEverOpened] = React.useState(false);

    /** Ref for container element, containing all children and the backdrop */
    const containerElement = React.useRef<HTMLDivElement>(null);

    /** Ref for backdrop element */
    const backdropElement = React.useRef<HTMLDivElement>(null);

    /* An empty, keyboard-focusable div at the beginning of the Overlay content */
    const startFocusTrapElement = React.useRef<HTMLDivElement>(null);

    /* An empty, keyboard-focusable div at the end of the Overlay content */
    const endFocusTrapElement = React.useRef<HTMLDivElement>(null);

    /** Child element refs, necessary to forward to `<CSSTransition nodeRef>` */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const childElements = React.Children.map(children, () => React.useRef<HTMLElement>(null));

    const bringFocusInsideOverlay = React.useCallback(() => {
        // always delay focus manipulation to just before repaint to prevent scroll jumping
        return requestAnimationFrame(() => {
            // container element may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            const activeElement = getActiveElement(containerElement.current);

            if (containerElement.current == null || activeElement == null || !isOpen) {
                return;
            }

            const container = containerElement.current;
            const isFocusOutsideModal = !container.contains(activeElement);
            if (isFocusOutsideModal) {
                startFocusTrapElement.current?.focus({ preventScroll: true });
                setIsAutoFocusing(false);
            }
        });
    }, [isOpen]);

    /**
     * When multiple Overlays are open, this event handler is only active for the most recently
     * opened one to avoid Overlays competing with each other for focus.
     */
    const handleDocumentFocus = React.useCallback(
        (e: FocusEvent) => {
            // get the actual target even in the Shadow DOM
            // see https://github.com/palantir/blueprint/issues/4220
            const eventTarget = e.composed ? e.composedPath()[0] : e.target;
            if (
                enforceFocus &&
                containerElement.current != null &&
                eventTarget instanceof Node &&
                !containerElement.current.contains(eventTarget as HTMLElement)
            ) {
                // prevent default focus behavior (sometimes auto-scrolls the page)
                e.preventDefault();
                e.stopImmediatePropagation();
                bringFocusInsideOverlay();
            }
        },
        [bringFocusInsideOverlay, enforceFocus],
    );

    const instance: OverlayInstance = React.useMemo(
        () => ({
            bringFocusInsideOverlay,
            containerElement,
            handleDocumentFocus,
            isAutoFocusing,
            lastActiveElementBeforeOpened,
            props: {
                autoFocus,
                enforceFocus,
                hasBackdrop,
                usePortal,
            },
        }),
        [
            autoFocus,
            bringFocusInsideOverlay,
            enforceFocus,
            handleDocumentFocus,
            hasBackdrop,
            isAutoFocusing,
            lastActiveElementBeforeOpened,
            usePortal,
        ],
    );

    React.useEffect(() => {
        if (ref) {
            ref.current = instance;
        }
    }, [instance, ref]);

    const handleDocumentClick = React.useCallback(
        (e: MouseEvent) => {
            // get the actual target even in the Shadow DOM
            // see https://github.com/palantir/blueprint/issues/4220
            const eventTarget = (e.composed ? e.composedPath()[0] : e.target) as HTMLElement;

            const stackIndex = openStack.indexOf(instance);
            const isClickInThisOverlayOrDescendant = openStack.slice(stackIndex).some(({ containerElement: elem }) => {
                // `elem` is the container of backdrop & content, so clicking directly on that container
                // should not count as being "inside" the overlay.
                return elem.current?.contains(eventTarget) && !elem.current.isSameNode(eventTarget);
            });

            if (isOpen && !isClickInThisOverlayOrDescendant && canOutsideClickClose) {
                // casting to any because this is a native event
                onClose?.(e as any);
            }
        },
        [canOutsideClickClose, instance, isOpen, onClose],
    );

    const handleContainerKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLElement>) => {
            if (e.key === "Escape" && canEscapeKeyClose) {
                onClose?.(e);
                // prevent other overlays from closing
                e.stopPropagation();
                // prevent browser-specific escape key behavior (Safari exits fullscreen)
                e.preventDefault();
            }
        },
        [canEscapeKeyClose, onClose],
    );

    const overlayWillOpen = React.useCallback(() => {
        if (openStack.length > 0) {
            document.removeEventListener("focus", getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(instance);

        if (autoFocus) {
            setIsAutoFocusing(true);
            bringFocusInsideOverlay();
        }

        if (enforceFocus) {
            // Focus events do not bubble, but setting useCapture allows us to listen in and execute
            // our handler before all others
            document.addEventListener("focus", instance.handleDocumentFocus, /* useCapture */ true);
        }

        if (canOutsideClickClose && !hasBackdrop) {
            document.addEventListener("mousedown", handleDocumentClick);
        }

        if (hasBackdrop && usePortal) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }

        setLastActiveElementBeforeOpened(getActiveElement(containerElement.current));
    }, [
        instance,
        autoFocus,
        enforceFocus,
        canOutsideClickClose,
        hasBackdrop,
        usePortal,
        bringFocusInsideOverlay,
        handleDocumentClick,
    ]);

    const overlayWillClose = React.useCallback(() => {
        document.removeEventListener("focus", handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", handleDocumentClick);

        const stackIndex = openStack.indexOf(instance);
        if (stackIndex !== -1) {
            openStack.splice(stackIndex, 1);
            if (openStack.length > 0) {
                const lastOpenedOverlay = getLastOpened();
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
    }, [handleDocumentClick, handleDocumentFocus, instance]);

    React.useEffect(() => {
        if (isOpen) {
            setHasEverOpened(true);
            overlayWillOpen();
        } else {
            // TODO: call overlayWillClose when isOpen toggles to false
        }
        return () => {
            overlayWillClose();
        };
    }, [isOpen, overlayWillOpen, overlayWillClose]);

    const handleTransitionExited = React.useCallback(
        (node: HTMLElement) => {
            if (shouldReturnFocusOnClose && lastActiveElementBeforeOpened instanceof HTMLElement) {
                lastActiveElementBeforeOpened.focus();
            }
            onClosed?.(node);
        },
        [lastActiveElementBeforeOpened, onClosed, shouldReturnFocusOnClose],
    );

    const handleTransitionAddEnd = React.useCallback(() => {
        // no-op
    }, []);

    const maybeRenderChild = React.useCallback(
        (child: React.ReactNode | undefined, index: number) => {
            if (isFunction(child)) {
                child = child();
            }

            if (child == null || childElements == null || childElements[index] == null) {
                return null;
            }

            // decorate the child with a few injected props
            const tabIndex = enforceFocus || autoFocus ? 0 : undefined;
            const childRef = childElements[index];
            const decoratedChild =
                typeof child === "object" ? (
                    React.cloneElement(child as React.ReactElement, {
                        className: classNames((child as React.ReactElement).props.className, Classes.OVERLAY_CONTENT),
                        ref: childRef,
                        tabIndex,
                    })
                ) : (
                    <span className={Classes.OVERLAY_CONTENT} ref={childRef} tabIndex={tabIndex}>
                        {child}
                    </span>
                );

            return (
                <CSSTransition
                    addEndListener={handleTransitionAddEnd}
                    classNames={transitionName}
                    // HACKHACK: CSSTransition types are slightly incompatible with React types here.
                    // React prefers `| null` but not `| undefined` for the ref value, while
                    // CSSTransition _demands_ that `| undefined` be part of the element type, for some reason.
                    nodeRef={childRef as React.RefObject<HTMLElement | undefined>}
                    onEntered={onOpened}
                    onEntering={onOpening}
                    onExited={handleTransitionExited}
                    onExiting={onClosing}
                    timeout={transitionDuration}
                >
                    {decoratedChild}
                </CSSTransition>
            );
        },
        [
            autoFocus,
            childElements,
            enforceFocus,
            handleTransitionAddEnd,
            handleTransitionExited,
            onClosing,
            onOpened,
            onOpening,
            transitionDuration,
            transitionName,
        ],
    );

    const handleBackdropMouseDown = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (canOutsideClickClose) {
                onClose?.(e);
            }
            if (enforceFocus) {
                bringFocusInsideOverlay();
            }
            backdropProps?.onMouseDown?.(e);
        },
        [backdropProps, bringFocusInsideOverlay, canOutsideClickClose, enforceFocus, onClose],
    );

    const maybeRenderBackdrop = React.useCallback(() => {
        if (hasBackdrop && isOpen) {
            return (
                <CSSTransition
                    classNames={transitionName}
                    key="__backdrop"
                    nodeRef={backdropElement}
                    timeout={transitionDuration}
                    addEndListener={handleTransitionAddEnd}
                >
                    <div
                        {...backdropProps}
                        className={classNames(Classes.OVERLAY_BACKDROP, backdropClassName, backdropProps?.className)}
                        onMouseDown={handleBackdropMouseDown}
                        ref={backdropElement}
                    />
                </CSSTransition>
            );
        } else {
            return null;
        }
    }, [
        backdropClassName,
        backdropProps,
        handleBackdropMouseDown,
        handleTransitionAddEnd,
        hasBackdrop,
        isOpen,
        transitionDuration,
        transitionName,
    ]);

    const renderDummyElement = React.useCallback(
        (key: string, dummyElementProps: HTMLDivProps & { ref?: React.Ref<HTMLDivElement> }) => {
            return (
                <CSSTransition
                    addEndListener={handleTransitionAddEnd}
                    classNames={transitionName}
                    key={key}
                    nodeRef={dummyElementProps.ref}
                    timeout={transitionDuration}
                    unmountOnExit={true}
                >
                    <div tabIndex={0} {...dummyElementProps} />
                </CSSTransition>
            );
        },
        [handleTransitionAddEnd, transitionDuration, transitionName],
    );

    /**
     * Ensures repeatedly pressing shift+tab keeps focus inside the Overlay. Moves focus to
     * the `endFocusTrapElement` or the first keyboard-focusable element in the Overlay (excluding
     * the `startFocusTrapElement`), depending on whether the element losing focus is inside the
     * Overlay.
     */
    const handleStartFocusTrapElementFocus = React.useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            if (!enforceFocus || instance.isAutoFocusing) {
                return;
            }
            // e.relatedTarget will not be defined if this was a programmatic focus event, as is the
            // case when we call this.bringFocusInsideOverlay() after a user clicked on the backdrop.
            // Otherwise, we're handling a user interaction, and we should wrap around to the last
            // element in this transition group.
            if (
                e.relatedTarget != null &&
                containerElement.current?.contains(e.relatedTarget as Element) &&
                e.relatedTarget !== endFocusTrapElement.current
            ) {
                endFocusTrapElement.current?.focus({ preventScroll: true });
            }
        },
        [enforceFocus, instance.isAutoFocusing],
    );

    /**
     * Wrap around to the end of the dialog if `enforceFocus` is enabled.
     */
    const handleStartFocusTrapElementKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!enforceFocus) {
                return;
            }
            if (e.shiftKey && e.key === "Tab") {
                const lastFocusableElement = getKeyboardFocusableElements(containerElement).pop();
                if (lastFocusableElement != null) {
                    lastFocusableElement.focus();
                } else {
                    endFocusTrapElement.current?.focus({ preventScroll: true });
                }
            }
        },
        [enforceFocus],
    );

    /**
     * Ensures repeatedly pressing tab keeps focus inside the Overlay. Moves focus to the
     * `startFocusTrapElement` or the last keyboard-focusable element in the Overlay (excluding the
     * `startFocusTrapElement`), depending on whether the element losing focus is inside the
     * Overlay.
     */
    const handleEndFocusTrapElementFocus = React.useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            // No need for this.props.enforceFocus check here because this element is only rendered
            // when that prop is true.
            // During user interactions, e.relatedTarget will be defined, and we should wrap around to the
            // "start focus trap" element.
            // Otherwise, we're handling a programmatic focus event, which can only happen after a user
            // presses shift+tab from the first focusable element in the overlay.
            if (
                e.relatedTarget != null &&
                containerElement.current?.contains(e.relatedTarget as Element) &&
                e.relatedTarget !== startFocusTrapElement.current
            ) {
                const firstFocusableElement = getKeyboardFocusableElements(containerElement).shift();
                // ensure we don't re-focus an already active element by comparing against e.relatedTarget
                if (
                    !instance.isAutoFocusing &&
                    firstFocusableElement != null &&
                    firstFocusableElement !== e.relatedTarget
                ) {
                    firstFocusableElement.focus();
                } else {
                    startFocusTrapElement.current?.focus({ preventScroll: true });
                }
            } else {
                const lastFocusableElement = getKeyboardFocusableElements(containerElement).pop();
                if (lastFocusableElement != null) {
                    lastFocusableElement.focus();
                } else {
                    // Keeps focus within Overlay even if there are no keyboard-focusable children
                    startFocusTrapElement.current?.focus({ preventScroll: true });
                }
            }
        },
        [instance.isAutoFocusing],
    );

    // no reason to render anything at all if we're being truly lazy
    if (lazy && !hasEverOpened) {
        return null;
    }

    // TransitionGroup types require single array of children; does not support nested arrays.
    // So we must collapse backdrop and children into one array, and every item must be wrapped in a
    // Transition element (no ReactText allowed).
    const childrenWithTransitions = isOpen ? React.Children.map(children, maybeRenderChild) ?? [] : [];

    const maybeBackdrop = maybeRenderBackdrop();
    if (maybeBackdrop !== null) {
        childrenWithTransitions.unshift(maybeBackdrop);
    }
    if (isOpen && (autoFocus || enforceFocus) && childrenWithTransitions.length > 0) {
        childrenWithTransitions.unshift(
            renderDummyElement("__start", {
                className: Classes.OVERLAY_START_FOCUS_TRAP,
                onFocus: handleStartFocusTrapElementFocus,
                onKeyDown: handleStartFocusTrapElementKeyDown,
                ref: startFocusTrapElement,
            }),
        );
        if (enforceFocus) {
            childrenWithTransitions.push(
                renderDummyElement("__end", {
                    className: Classes.OVERLAY_END_FOCUS_TRAP,
                    onFocus: handleEndFocusTrapElementFocus,
                    ref: endFocusTrapElement,
                }),
            );
        }
    }

    const transitionGroup = (
        <div
            aria-live="polite"
            className={classNames(
                Classes.OVERLAY,
                {
                    [Classes.OVERLAY_OPEN]: isOpen,
                    [Classes.OVERLAY_INLINE]: !usePortal,
                },
                className,
            )}
            onKeyDown={handleContainerKeyDown}
            ref={containerElement}
        >
            <TransitionGroup appear={true} component={null}>
                {childrenWithTransitions}
            </TransitionGroup>
        </div>
    );

    if (usePortal) {
        return (
            <Portal className={portalClassName} container={portalContainer}>
                {transitionGroup}
            </Portal>
        );
    } else {
        return transitionGroup;
    }
};
Overlay2.defaultProps = {
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
Overlay2.displayName = `${DISPLAYNAME_PREFIX}.Overlay2`;

function getKeyboardFocusableElements(containerElement: React.RefObject<HTMLElement>) {
    const focusableElements: HTMLElement[] =
        containerElement.current !== null
            ? Array.from(
                  // Order may not be correct if children elements use tabindex values > 0.
                  // Selectors derived from this SO question:
                  // https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
                  containerElement.current.querySelectorAll(
                      [
                          'a[href]:not([tabindex="-1"])',
                          'button:not([disabled]):not([tabindex="-1"])',
                          'details:not([tabindex="-1"])',
                          'input:not([disabled]):not([tabindex="-1"])',
                          'select:not([disabled]):not([tabindex="-1"])',
                          'textarea:not([disabled]):not([tabindex="-1"])',
                          '[tabindex]:not([tabindex="-1"])',
                      ].join(","),
                  ),
              )
            : [];

    return focusableElements.filter(
        el =>
            !el.classList.contains(Classes.OVERLAY_START_FOCUS_TRAP) &&
            !el.classList.contains(Classes.OVERLAY_END_FOCUS_TRAP),
    );
}
