/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, Utils } from "../../common";
import { DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";
import { mergeRefs } from "../../common/refs";
import { Icon } from "../icon/icon";
import { Spinner, SpinnerSize } from "../spinner/spinner";
import { Text } from "../text/text";
import type { AnchorButtonProps, ButtonProps } from "./buttonProps";

/**
 * Link component.
 *
 * @see https://blueprintjs.com/docs/#core/components/link
 */
export const Link: React.FC<ButtonProps> = React.forwardRef<HTMLAnchorElement, ButtonProps>((props, ref) => {
    const commonAttributes = useSharedLinkAttributes(props, ref);

    return (
        <a {...removeNonHTMLProps(props)} {...commonAttributes} href={href}>
            {renderButtonContents(props)}
        </a>
    );
});
Link.displayName = `${DISPLAYNAME_PREFIX}.Link`;

/**
 * ButtonLink component.
 *
 * @see https://blueprintjs.com/docs/#core/components/link
 */
export const ButtonLink: React.FC<AnchorButtonProps> = React.forwardRef<HTMLButtonElement, AnchorButtonProps>(
    (props, ref) => {
        const { href, tabIndex = 0 } = props;
        const commonProps = useSharedLinkAttributes(props, ref);

        return (
            <button
                {...removeNonHTMLProps(props)}
                {...commonProps}
                aria-disabled={commonProps.disabled}
                tabIndex={commonProps.disabled ? -1 : tabIndex}
            >
                {renderButtonContents(props)}
            </button>
        );
    },
);
ButtonLink.displayName = `${DISPLAYNAME_PREFIX}.ButtonLink`;

/**
 * Most of the button logic lives in this shared hook.
 */
function useSharedLinkAttributes<E extends HTMLAnchorElement | HTMLButtonElement>(
    props: E extends HTMLAnchorElement ? AnchorButtonProps : ButtonProps,
    ref: React.Ref<E>,
) {
    const {
        onBlur,
        onKeyDown,
        onKeyUp,
        tabIndex,
    } = props;

    // the current key being pressed
    const [currentKeyPressed, setCurrentKeyPressed] = React.useState<string | undefined>();
    // whether the button is in "active" state
    const [isActive, setIsActive] = React.useState(false);
    // our local ref for the button element, merged with the consumer's own ref (if supplied) in this hook's return value
    const buttonRef = React.useRef<E | null>(null);

    const handleBlur = React.useCallback(
        (e: React.FocusEvent<any>) => {
            if (isActive) {
                setIsActive(false);
            }
            onBlur?.(e);
        },
        [isActive, onBlur],
    );
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<any>) => {
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
        (e: React.KeyboardEvent<any>) => {
            if (Utils.isKeyboardClick(e)) {
                setIsActive(false);
                buttonRef.current?.click();
            }
            setCurrentKeyPressed(undefined);
            onKeyUp?.(e);
        },
        [onKeyUp],
    );

    const className = classNames(
        Classes.BUTTON,
        {
            [Classes.ACTIVE]: !disabled && (active || isActive),
            [Classes.DISABLED]: disabled,
            [Classes.FILL]: fill,
            [Classes.LARGE]: large,
            [Classes.LOADING]: loading,
            [Classes.MINIMAL]: minimal,
            [Classes.OUTLINED]: outlined,
            [Classes.SMALL]: small,
        },
        Classes.alignmentClass(alignText),
        Classes.intentClass(props.intent),
        props.className,
    );

    return {
        className,
        disabled,
        onBlur: handleBlur,
        onClick: disabled ? undefined : props.onClick,
        onFocus: disabled ? undefined : props.onFocus,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        ref: mergeRefs(buttonRef, ref),
        tabIndex: disabled ? -1 : tabIndex,
    };
}

/**
 * Shared rendering code for button contents.
 */
function renderButtonContents<E extends HTMLAnchorElement | HTMLButtonElement>(
    props: E extends HTMLAnchorElement ? AnchorButtonProps : ButtonProps,
) {
    const { children, ellipsizeText, icon, loading, rightIcon, text, textClassName } = props;
    const hasTextContent = !Utils.isReactNodeEmpty(text) || !Utils.isReactNodeEmpty(children);
    return (
        <>
            {loading && <Spinner key="loading" className={Classes.BUTTON_SPINNER} size={SpinnerSize.SMALL} />}
            <Icon key="leftIcon" icon={icon} />
            {hasTextContent && (
                <Text
                    key="text"
                    className={classNames(Classes.BUTTON_TEXT, textClassName)}
                    ellipsize={ellipsizeText}
                    tagName="span"
                >
                    {text}
                    {children}
                </Text>
                // <span key="text" className={classNames(Classes.BUTTON_TEXT, textClassName)}>
                //     {text}
                //     {children}
                // </span>
            )}
            <Icon key="rightIcon" icon={rightIcon} />
        </>
    );
}
