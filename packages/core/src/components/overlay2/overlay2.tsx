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
import { useUID } from "react-uid";

import { Classes, mergeRefs } from "../../common";
import {
    OVERLAY_CHILD_REF_AND_REFS_MUTEX,
    OVERLAY_CHILD_REQUIRES_KEY,
    OVERLAY_WITH_MULTIPLE_CHILDREN_REQUIRES_CHILD_REFS,
} from "../../common/errors";
import { DISPLAYNAME_PREFIX, type HTMLDivProps } from "../../common/props";
import {
    ensureElement,
    getActiveElement,
    getRef,
    isEmptyString,
    isNodeEnv,
    isReactElement,
    setRef,
} from "../../common/utils";
import { hasDOMEnvironment } from "../../common/utils/domUtils";
import { useOverlayStack } from "../../hooks/overlays/useOverlayStack";
import { usePrevious } from "../../hooks/usePrevious";
import type { OverlayProps } from "../overlay/overlayProps";
import { getKeyboardFocusableElements } from "../overlay/overlayUtils";
import { Portal } from "../portal/portal";

import type { OverlayInstance } from "./overlayInstance";

export interface Overlay2Props extends OverlayProps, React.RefAttributes<OverlayInstance> {
    /**
     * If you provide a single child element to Overlay2 and attach your own `ref` to the node, you must pass the
     * same value here (otherwise, Overlay2 won't be able to render CSSTransition correctly).
     *
     * Mutually exclusive with the `childRefs` prop. This prop is a shorthand for `childRefs={{ [key: string]: ref }}`.
     */
    childRef?: React.RefObject<HTMLElement>;

    /**
     * If you provide a _multiple child elements_ to Overlay2, you must enumerate and generate a
     * collection of DOM refs to those elements and provide it here. The object's keys must correspond to the child
     * React element `key` values.
     *
     * Mutually exclusive with the `childRef` prop. If you only provide a single child element, consider using
     * `childRef` instead.
     */
    childRefs?: Record<string, React.RefObject<HTMLElement>>;
}

export const OVERLAY2_DEFAULT_PROPS = {
    autoFocus: true,
    backdropProps: {},
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    hasBackdrop: true,
    isOpen: false,
    lazy: hasDOMEnvironment(),
    shouldReturnFocusOnClose: true,
    transitionDuration: 300,
    transitionName: Classes.OVERLAY,
    usePortal: true,
};

/**
 * Overlay2 component.
 *
 * @see https://blueprintjs.com/docs/#core/components/overlay2
 */
export const Overlay2 = React.forwardRef<OverlayInstance, Overlay2Props>((props, forwardedRef) => {
    const {
        autoFocus,
        backdropClassName,
        backdropProps,
        canEscapeKeyClose,
        canOutsideClickClose,
        childRef,
        childRefs,
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
        shouldReturnFocusOnClose,
        transitionDuration,
        transitionName,
        usePortal,
    } = props;

    useOverlay2Validation(props);
    const { closeOverlay, getLastOpened, getThisOverlayAndDescendants, openOverlay } = useOverlayStack();

    const [isAutoFocusing, setIsAutoFocusing] = React.useState(false);
    const [hasEverOpened, setHasEverOpened] = React.useState(false);
    const lastActiveElementBeforeOpened = React.useRef<Element>(null);

    /** Ref for container element, containing all children and the backdrop */
    const containerElement = React.useRef<HTMLDivElement>(null);

    /** Ref for backdrop element */
    const backdropElement = React.useRef<HTMLDivElement>(null);

    /* An empty, keyboard-focusable div at the beginning of the Overlay content */
    const startFocusTrapElement = React.useRef<HTMLDivElement>(null);

    /* An empty, keyboard-focusable div at the end of the Overlay content */
    const endFocusTrapElement = React.useRef<HTMLDivElement>(null);

    /**
     * Locally-generated DOM ref for a singleton child element.
     * This is only used iff the user does not specify the `childRef` or `childRefs` props.
     */
    const localChildRef = React.useRef<HTMLElement>(null);

    const bringFocusInsideOverlay = React.useCallback(() => {
        // always delay focus manipulation to just before repaint to prevent scroll jumping
        return requestAnimationFrame(() => {
            // container element may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            const container = getRef(containerElement);
            const activeElement = getActiveElement(container);

            if (container == null || activeElement == null) {
                return;
            }

            // Overlay2 is guaranteed to be mounted here
            const isFocusOutsideModal = !container.contains(activeElement);
            if (isFocusOutsideModal) {
                getRef(startFocusTrapElement)?.focus({ preventScroll: true });
                setIsAutoFocusing(false);
            }
        });
    }, []);

    /** Unique ID for this overlay in the global stack */
    const id = useOverlay2ID();

    // N.B. use `null` here and not simply `undefined` because `useImperativeHandle` will set `null` on unmount,
    // and we need the following code to be resilient to that value.
    const instance = React.useRef<OverlayInstance>(null);

    /**
     * When multiple `enforceFocus` Overlays are open, this event handler is only active for the most
     * recently opened one to avoid Overlays competing with each other for focus.
     */
    const handleDocumentFocus = React.useCallback(
        (e: FocusEvent) => {
            // get the actual target even in the Shadow DOM
            // see https://github.com/palantir/blueprint/issues/4220
            const eventTarget = e.composed ? e.composedPath()[0] : e.target;
            const container = getRef(containerElement);
            if (container != null && eventTarget instanceof Node && !container.contains(eventTarget as HTMLElement)) {
                // prevent default focus behavior (sometimes auto-scrolls the page)
                e.preventDefault();
                e.stopImmediatePropagation();
                bringFocusInsideOverlay();
            }
        },
        [bringFocusInsideOverlay],
    );

    // N.B. this listener is only kept attached when `isOpen={true}` and `canOutsideClickClose={true}`
    const handleDocumentMousedown = React.useCallback(
        (e: MouseEvent) => {
            // get the actual target even in the Shadow DOM
            // see https://github.com/palantir/blueprint/issues/4220
            const eventTarget = (e.composed ? e.composedPath()[0] : e.target) as HTMLElement;

            const thisOverlayAndDescendants = getThisOverlayAndDescendants(id);
            const isClickInThisOverlayOrDescendant = thisOverlayAndDescendants.some(
                ({ containerElement: containerRef }) => {
                    // `elem` is the container of backdrop & content, so clicking directly on that container
                    // should not count as being "inside" the overlay.
                    const elem = getRef(containerRef);
                    return elem?.contains(eventTarget) && !elem.isSameNode(eventTarget);
                },
            );

            if (!isClickInThisOverlayOrDescendant) {
                // casting to any because this is a native event
                onClose?.(e as any);
            }
        },
        [getThisOverlayAndDescendants, id, onClose],
    );

    // send this instance's imperative handle to the the forwarded ref as well as our local ref
    const ref = React.useMemo(() => mergeRefs(forwardedRef, instance), [forwardedRef]);
    React.useImperativeHandle(
        ref,
        () => ({
            bringFocusInsideOverlay,
            containerElement,
            handleDocumentFocus,
            handleDocumentMousedown,
            id,
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
            handleDocumentMousedown,
            hasBackdrop,
            id,
            usePortal,
        ],
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
        if (instance.current == null) {
            return;
        }

        const lastOpenedOverlay = getLastOpened();
        if (lastOpenedOverlay?.handleDocumentFocus !== undefined) {
            document.removeEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
        }
        openOverlay(instance.current);

        if (autoFocus) {
            setIsAutoFocusing(true);
            bringFocusInsideOverlay();
        }

        setRef(lastActiveElementBeforeOpened, getActiveElement(getRef(containerElement)));
    }, [autoFocus, bringFocusInsideOverlay, getLastOpened, openOverlay]);

    const overlayWillClose = React.useCallback(() => {
        document.removeEventListener("focus", handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", handleDocumentMousedown);

        // N.B. `instance.current` may be null at this point if we are cleaning up an open overlay during the unmount phase
        // (this is common, for example, with context menu's singleton `showContextMenu` / `hideContextMenu` imperative APIs).
        closeOverlay(id);
        const lastOpenedOverlay = getLastOpened();
        if (lastOpenedOverlay !== undefined) {
            // Only bring focus back to last overlay if it had autoFocus _and_ enforceFocus enabled.
            // If `autoFocus={false}`, it's likely that the overlay never received focus in the first place,
            // so it would be surprising for us to send it there. See https://github.com/palantir/blueprint/issues/4921
            if (lastOpenedOverlay.props.autoFocus && lastOpenedOverlay.props.enforceFocus) {
                lastOpenedOverlay.bringFocusInsideOverlay?.();
                if (lastOpenedOverlay.handleDocumentFocus !== undefined) {
                    document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
                }
            }
        }
    }, [closeOverlay, getLastOpened, handleDocumentFocus, handleDocumentMousedown, id]);

    const prevIsOpen = usePrevious(isOpen) ?? false;
    React.useEffect(() => {
        if (isOpen) {
            setHasEverOpened(true);
        }

        if (!prevIsOpen && isOpen) {
            // just opened
            overlayWillOpen();
        }

        if (prevIsOpen && !isOpen) {
            // just closed
            overlayWillClose();
        }
    }, [isOpen, overlayWillOpen, overlayWillClose, prevIsOpen]);

    // Important: clean up old document-level event listeners if their memoized values change (this is rare, but
    // may happen, for example, if a user forgets to use `React.useCallback` in the `props.onClose` value).
    // Otherwise, we will lose the reference to those values and create a memory leak since we won't be able
    // to successfully detach them inside overlayWillClose.
    React.useEffect(() => {
        if (!isOpen || !(canOutsideClickClose && !hasBackdrop)) {
            return;
        }

        document.addEventListener("mousedown", handleDocumentMousedown);

        return () => {
            document.removeEventListener("mousedown", handleDocumentMousedown);
        };
    }, [handleDocumentMousedown, isOpen, canOutsideClickClose, hasBackdrop]);
    React.useEffect(() => {
        if (!isOpen || !enforceFocus) {
            return;
        }

        // Focus events do not bubble, but setting useCapture allows us to listen in and execute
        // our handler before all others
        document.addEventListener("focus", handleDocumentFocus, /* useCapture */ true);

        return () => {
            document.removeEventListener("focus", handleDocumentFocus, /* useCapture */ true);
        };
    }, [handleDocumentFocus, enforceFocus, isOpen]);

    const overlayWillCloseRef = React.useRef(overlayWillClose);
    overlayWillCloseRef.current = overlayWillClose;
    React.useEffect(() => {
        // run cleanup code once on unmount, ensuring we call the most recent overlayWillClose callback
        // by storing in a ref and keeping up to date
        return () => {
            overlayWillCloseRef.current();
        };
    }, []);

    const handleTransitionExited = React.useCallback(
        (node: HTMLElement) => {
            const lastActiveElement = getRef(lastActiveElementBeforeOpened);
            if (shouldReturnFocusOnClose && lastActiveElement instanceof HTMLElement) {
                lastActiveElement.focus();
            }
            onClosed?.(node);
        },
        [onClosed, shouldReturnFocusOnClose],
    );

    // N.B. CSSTransition requires this callback to be defined, even if it's unused.
    const handleTransitionAddEnd = React.useCallback(() => {
        // no-op
    }, []);

    /**
     * Gets the relevant DOM ref for a child element using the `childRef` or `childRefs` props (if possible).
     * This ref is necessary for `CSSTransition` to work in React 18 without relying on `ReactDOM.findDOMNode`.
     *
     * Returns `undefined` if the user did not specify either of those props. In those cases, we use the ref we
     * have locally generated and expect that the user _did not_ specify their own `ref` on the child element
     * (it will get clobbered / overriden).
     *
     * @see https://reactcommunity.org/react-transition-group/css-transition
     */
    const getUserChildRef = React.useCallback(
        (child: React.ReactNode) => {
            if (childRef != null) {
                return childRef;
            } else if (childRefs != null) {
                const key = (child as React.ReactElement).key;
                if (key == null) {
                    if (!isNodeEnv("production")) {
                        console.error(OVERLAY_CHILD_REQUIRES_KEY);
                    }
                    return undefined;
                }
                return childRefs[key];
            }
            return undefined;
        },
        [childRef, childRefs],
    );

    const maybeRenderChild = React.useCallback(
        (child: React.ReactNode | undefined) => {
            if (child == null || isEmptyString(child)) {
                return null;
            }

            // decorate the child with a few injected props
            const userChildRef = getUserChildRef(child);
            const childProps = isReactElement(child) ? child.props : {};
            // if the child is a string, number, or fragment, it will be wrapped in a <span> element
            const decoratedChild = ensureElement(child, "span", {
                className: classNames(childProps.className, Classes.OVERLAY_CONTENT),
                // IMPORTANT: only inject our ref if the user didn't specify childRef or childRefs already. Otherwise,
                // we risk clobbering the user's ref (which we cannot inspect here while cloning/decorating the child).
                ref: userChildRef === undefined ? localChildRef : undefined,
                tabIndex: enforceFocus || autoFocus ? 0 : undefined,
            });
            const resolvedChildRef = userChildRef ?? localChildRef;

            return (
                <CSSTransition
                    addEndListener={handleTransitionAddEnd}
                    classNames={transitionName}
                    // HACKHACK: CSSTransition types are slightly incompatible with React types here.
                    // React prefers `| null` but not `| undefined` for the ref value, while
                    // CSSTransition _demands_ that `| undefined` be part of the element type.
                    nodeRef={resolvedChildRef as React.RefObject<HTMLElement | undefined>}
                    onEntered={getLifecycleCallbackWithChildRef(onOpened, resolvedChildRef)}
                    onEntering={getLifecycleCallbackWithChildRef(onOpening, resolvedChildRef)}
                    onExited={getLifecycleCallbackWithChildRef(handleTransitionExited, resolvedChildRef)}
                    onExiting={getLifecycleCallbackWithChildRef(onClosing, resolvedChildRef)}
                    timeout={transitionDuration}
                >
                    {decoratedChild}
                </CSSTransition>
            );
        },
        [
            autoFocus,
            enforceFocus,
            getUserChildRef,
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

    const renderDummyElement = React.useCallback(
        (key: string, dummyElementProps: HTMLDivProps & { ref?: React.Ref<HTMLDivElement> }) => (
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
        ),
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
            if (!enforceFocus || isAutoFocusing) {
                return;
            }
            // e.relatedTarget will not be defined if this was a programmatic focus event, as is the
            // case when we call this.bringFocusInsideOverlay() after a user clicked on the backdrop.
            // Otherwise, we're handling a user interaction, and we should wrap around to the last
            // element in this transition group.
            const container = getRef(containerElement);
            const endFocusTrap = getRef(endFocusTrapElement);
            if (
                e.relatedTarget != null &&
                container?.contains(e.relatedTarget as Element) &&
                e.relatedTarget !== endFocusTrap
            ) {
                endFocusTrap?.focus({ preventScroll: true });
            }
        },
        [enforceFocus, isAutoFocusing],
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
                    getRef(endFocusTrapElement)?.focus({ preventScroll: true });
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
            const startFocusTrap = getRef(startFocusTrapElement);
            if (
                e.relatedTarget != null &&
                getRef(containerElement)?.contains(e.relatedTarget as Element) &&
                e.relatedTarget !== startFocusTrap
            ) {
                const firstFocusableElement = getKeyboardFocusableElements(containerElement).shift();
                // ensure we don't re-focus an already active element by comparing against e.relatedTarget
                if (!isAutoFocusing && firstFocusableElement != null && firstFocusableElement !== e.relatedTarget) {
                    firstFocusableElement.focus();
                } else {
                    startFocusTrap?.focus({ preventScroll: true });
                }
            } else {
                const lastFocusableElement = getKeyboardFocusableElements(containerElement).pop();
                if (lastFocusableElement != null) {
                    lastFocusableElement.focus();
                } else {
                    // Keeps focus within Overlay even if there are no keyboard-focusable children
                    startFocusTrap?.focus({ preventScroll: true });
                }
            }
        },
        [isAutoFocusing],
    );

    const maybeBackdrop = React.useMemo(
        () =>
            hasBackdrop && isOpen ? (
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
            ) : null,
        [
            backdropClassName,
            backdropProps,
            handleBackdropMouseDown,
            handleTransitionAddEnd,
            hasBackdrop,
            isOpen,
            transitionDuration,
            transitionName,
        ],
    );

    // no reason to render anything at all if we're being truly lazy
    if (lazy && !hasEverOpened) {
        return null;
    }

    // TransitionGroup types require single array of children; does not support nested arrays.
    // So we must collapse backdrop and children into one array, and every item must be wrapped in a
    // Transition element (no ReactText allowed).
    const childrenWithTransitions = isOpen ? React.Children.map(children, maybeRenderChild) ?? [] : [];

    // const maybeBackdrop = maybeRenderBackdrop();
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
});
// eslint-disable-next-line @typescript-eslint/no-deprecated
Overlay2.defaultProps = OVERLAY2_DEFAULT_PROPS;
Overlay2.displayName = `${DISPLAYNAME_PREFIX}.Overlay2`;

function useOverlay2Validation({ childRef, childRefs, children }: Overlay2Props) {
    const numChildren = React.Children.count(children);
    React.useEffect(() => {
        if (isNodeEnv("production")) {
            return;
        }

        if (childRef != null && childRefs != null) {
            console.error(OVERLAY_CHILD_REF_AND_REFS_MUTEX);
        }

        if (numChildren > 1 && childRefs == null) {
            console.error(OVERLAY_WITH_MULTIPLE_CHILDREN_REQUIRES_CHILD_REFS);
        }
    }, [childRef, childRefs, numChildren]);
}

/**
 * Generates a unique ID for a given Overlay which persists across the component's lifecycle.
 */
function useOverlay2ID(): string {
    // TODO: migrate to React.useId() in React 18
    const id = useUID();
    return `${Overlay2.displayName}-${id}`;
}

// N.B. the `onExiting` callback is not provided with the `node` argument as suggested in CSSTransition types since
// we are using the `nodeRef` prop, so we must inject it dynamically.
function getLifecycleCallbackWithChildRef(
    callback: ((node: HTMLElement) => void) | undefined,
    childRef: React.RefObject<HTMLElement> | undefined,
) {
    return () => {
        if (childRef?.current != null) {
            callback?.(childRef.current);
        }
    };
}
