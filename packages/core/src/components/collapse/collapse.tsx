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
import { createElement, useCallback, useEffect, useRef, useState } from "react";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";

export interface CollapseProps extends Props {
    /** Contents to collapse. */
    children?: React.ReactNode;

    /**
     * Component to render as the root element.
     * Useful when rendering a `Collapse` inside a `<table>`, for instance.
     *
     * @default "div"
     */
    component?: React.ElementType;

    /**
     * Whether the component is open or closed.
     *
     * @default false
     */
    isOpen?: boolean;

    /**
     * Whether the child components will remain mounted when the `Collapse` is closed.
     * Setting to true may improve performance by avoiding re-mounting children.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;

    /**
     * The length of time the transition takes, in milliseconds. This must match
     * the duration of the animation in CSS. Only set this prop if you override
     * Blueprint's default transitions with new transitions of a different
     * length.
     *
     * @default 200
     */
    transitionDuration?: number;
}

/**
 * `Collapse` can be in one of six states, enumerated here.
 * When changing the `isOpen` prop, the following happens to the states:
 * isOpen={true}  : CLOSED -> OPEN_START -> OPENING -> OPEN
 * isOpen={false} : OPEN -> CLOSING_START -> CLOSING -> CLOSED
 */
export enum AnimationStates {
    /**
     * The body is re-rendered, height is set to the measured body height and
     * the body Y is set to 0.
     */
    OPEN_START,

    /**
     * Animation begins, height is set to auto. This is all animated, and on
     * complete, the state changes to OPEN.
     */
    OPENING,

    /**
     * The collapse height is set to auto, and the body Y is set to 0 (so the
     * element can be seen as normal).
     */
    OPEN,

    /**
     * Height has been changed from auto to the measured height of the body to
     * prepare for the closing animation in CLOSING.
     */
    CLOSING_START,

    /**
     * Height is set to 0 and the body Y is at -height. Both of these properties
     * are transformed, and then after the animation is complete, the state
     * changes to CLOSED.
     */
    CLOSING,

    /**
     * The contents of the collapse is not rendered, the collapse height is 0,
     * and the body Y is at -height (so that the bottom of the body is at Y=0).
     */
    CLOSED,
}

/**
 * Collapse component.
 *
 * @see https://blueprintjs.com/docs/#core/components/collapse
 */
export const Collapse: React.FC<CollapseProps> = ({
    children,
    className,
    component = "div",
    isOpen = false,
    keepChildrenMounted = false,
    transitionDuration = 200,
}) => {
    const [animationState, setAnimationState] = useState<AnimationStates>(
        isOpen ? AnimationStates.OPEN : AnimationStates.CLOSED,
    );
    const [height, setHeight] = useState<string | undefined>(isOpen ? "auto" : "0px");
    const [heightWhenOpen, setHeightWhenOpen] = useState<number | undefined>(undefined);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;
    const contents = useRef<HTMLElement | null>(null);
    const animationStateRef = useRef(animationState);
    animationStateRef.current = animationState;
    const delayedTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const onDelayedStateChange = useCallback(() => {
        switch (animationStateRef.current) {
            case AnimationStates.OPENING:
                setAnimationState(AnimationStates.OPEN);
                setHeight("auto");
                break;
            case AnimationStates.CLOSING:
                setAnimationState(AnimationStates.CLOSED);
                break;
            default:
                break;
        }
    }, []);

    // Synchronize animationState with the isOpen prop during render.
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            switch (animationState) {
                case AnimationStates.OPEN:
                case AnimationStates.OPENING:
                    break;
                default:
                    setAnimationState(AnimationStates.OPEN_START);
            }
        } else {
            switch (animationState) {
                case AnimationStates.CLOSED:
                case AnimationStates.CLOSING:
                    break;
                default:
                    setAnimationState(AnimationStates.CLOSING_START);
                    setHeight(`${heightWhenOpen}px`);
            }
        }
    }

    // Clean up delayed timer on unmount only (mirrors AbstractPureComponent.setTimeout behavior)
    useEffect(() => {
        return () => {
            if (delayedTimerRef.current != null) {
                clearTimeout(delayedTimerRef.current);
            }
        };
    }, []);

    // Handle animation state transitions
    useEffect(() => {
        if (!contents.current) return undefined;

        switch (animationState) {
            case AnimationStates.OPEN_START: {
                const clientHeight = contents.current.clientHeight;
                setAnimationState(AnimationStates.OPENING);
                setHeight(`${clientHeight}px`);
                setHeightWhenOpen(clientHeight);

                clearTimeout(delayedTimerRef.current);
                delayedTimerRef.current = setTimeout(onDelayedStateChange, transitionDuration);
                break;
            }
            case AnimationStates.CLOSING_START: {
                const clientHeight = contents.current.clientHeight;

                const immediateTimer = setTimeout(() => {
                    setAnimationState(AnimationStates.CLOSING);
                    setHeight("0px");
                    setHeightWhenOpen(clientHeight);
                });

                clearTimeout(delayedTimerRef.current);
                delayedTimerRef.current = setTimeout(onDelayedStateChange, transitionDuration);

                return () => clearTimeout(immediateTimer);
            }
            default:
                break;
        }

        return undefined;
    }, [animationState, transitionDuration, onDelayedStateChange]);

    const contentsRefHandler = useCallback((element: HTMLElement | null) => {
        contents.current = element;
        if (contents.current != null) {
            const contentHeight = contents.current.clientHeight;
            setAnimationState(isOpenRef.current ? AnimationStates.OPEN : AnimationStates.CLOSED);
            setHeight(contentHeight === 0 ? undefined : `${contentHeight}px`);
            setHeightWhenOpen(contentHeight === 0 ? undefined : contentHeight);
        }
    }, []);

    const isContentVisible = animationState !== AnimationStates.CLOSED;
    const shouldRenderChildren = isContentVisible || keepChildrenMounted;
    const displayWithTransform = isContentVisible && animationState !== AnimationStates.CLOSING;
    // When fully open, always use "auto" height so content is never clipped — the ref
    // callback may have stored a measured pixel value, but that's only needed for close
    // animations, not for the resting open state.
    const effectiveHeight = animationState === AnimationStates.OPEN ? "auto" : height;
    const isAutoHeight = effectiveHeight === "auto";

    const containerStyle = {
        height: isContentVisible ? effectiveHeight : undefined,
        overflowY: isAutoHeight ? "visible" : undefined,
        // transitions don't work with height: auto
        transition: isAutoHeight ? "none" : undefined,
    };

    const contentsStyle = {
        // only use heightWhenOpen while closing
        transform: displayWithTransform ? "translateY(0)" : `translateY(-${heightWhenOpen}px)`,
        // transitions don't work with height: auto
        transition: isAutoHeight ? "none" : undefined,
    };

    return createElement(
        component,
        {
            className: classNames(Classes.COLLAPSE, className),
            style: containerStyle,
        },
        <div
            className={Classes.COLLAPSE_BODY}
            ref={contentsRefHandler}
            style={contentsStyle}
            aria-hidden={!isContentVisible}
        >
            {shouldRenderChildren ? children : null}
        </div>,
    );
};

Collapse.displayName = `${DISPLAYNAME_PREFIX}.Collapse`;
