/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { mergeRefs, Utils } from "../common";

type InteractiveHTMLAttributes<E extends HTMLElement> = Pick<
    React.HTMLAttributes<E>,
    "onBlur" | "onClick" | "onFocus" | "onKeyDown" | "onKeyUp" | "tabIndex"
>;

interface InteractiveComponentProps extends InteractiveHTMLAttributes<HTMLElement> {
    active?: boolean | undefined;
}

interface InteractiveAttributes<E extends HTMLElement> extends InteractiveHTMLAttributes<E> {
    ref: React.Ref<E>;
}

export interface UseInteractiveAttributesOptions {
    defaultTabIndex: number | undefined;
    disabledTabIndex: number | undefined;
}

const DEFAULT_OPTIONS: UseInteractiveAttributesOptions = { defaultTabIndex: undefined, disabledTabIndex: -1 };

export function useInteractiveAttributes<E extends HTMLElement>(
    interactive: boolean,
    props: InteractiveComponentProps,
    ref: React.Ref<E>,
    options: UseInteractiveAttributesOptions = DEFAULT_OPTIONS,
): [active: boolean, interactiveProps: InteractiveAttributes<E>] {
    const { defaultTabIndex, disabledTabIndex } = options;
    const { active, onClick, onFocus, onKeyDown, onKeyUp, onBlur, tabIndex = defaultTabIndex } = props;
    // the current key being pressed
    const [currentKeyPressed, setCurrentKeyPressed] = React.useState<string | undefined>();
    // whether the button is in "active" state
    const [isActive, setIsActive] = React.useState(false);
    // our local ref for the interactive element, merged with the consumer's own ref in this hook's return value
    const elementRef = React.useRef<E | null>(null);

    const handleBlur = React.useCallback(
        (e: React.FocusEvent<E>) => {
            if (isActive) {
                setIsActive(false);
            }

            onBlur?.(e);
        },
        [isActive, onBlur],
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<E>) => {
            if (Utils.isKeyboardClick(e)) {
                e.preventDefault();
                if (e.key !== currentKeyPressed) {
                    setIsActive(true);
                }
            }

            setCurrentKeyPressed(e.key);
            onKeyDown?.(e);
        },
        [currentKeyPressed, onKeyDown],
    );

    const handleKeyUp = React.useCallback(
        (e: React.KeyboardEvent<E>) => {
            if (Utils.isKeyboardClick(e)) {
                setIsActive(false);
                elementRef.current?.click();
            }
            setCurrentKeyPressed(undefined);
            onKeyUp?.(e);
        },
        [onKeyUp, elementRef],
    );

    const resolvedActive = interactive && (active || isActive);

    return [
        resolvedActive,
        {
            onBlur: handleBlur,
            onClick: interactive ? onClick : undefined,
            onFocus: interactive ? onFocus : undefined,
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            ref: mergeRefs(elementRef, ref),
            tabIndex: interactive ? tabIndex : disabledTabIndex,
        },
    ];
}
