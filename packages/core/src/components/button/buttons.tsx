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
import type { AnchorButtonProps, ButtonProps } from "./buttonProps";

/**
 * Button component.
 *
 * @see https://blueprintjs.com/docs/#core/components/button
 */
export const Button: React.FC<ButtonProps> = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const commonAttributes = useSharedButtonAttributes(props, ref);

    return (
        <button type="button" {...removeNonHTMLProps(props)} {...commonAttributes}>
            {renderButtonContents(props)}
        </button>
    );
});
Button.displayName = `${DISPLAYNAME_PREFIX}.Button`;

/**
 * AnchorButton component.
 *
 * @see https://blueprintjs.com/docs/#core/components/button
 */
export const AnchorButton: React.FC<AnchorButtonProps> = React.forwardRef<HTMLAnchorElement, AnchorButtonProps>(
    (props, ref) => {
        const { href, tabIndex = 0 } = props;
        const commonProps = useSharedButtonAttributes(props, ref);

        return (
            <a
                role="button"
                {...removeNonHTMLProps(props)}
                {...commonProps}
                href={commonProps.disabled ? undefined : href}
                tabIndex={commonProps.disabled ? -1 : tabIndex}
            >
                {renderButtonContents(props)}
            </a>
        );
    },
);
AnchorButton.displayName = `${DISPLAYNAME_PREFIX}.AnchorButton`;

/**
 * Most of the button logic lives in this shared hook.
 */
function useSharedButtonAttributes<E extends HTMLAnchorElement | HTMLButtonElement>(
    props: E extends HTMLAnchorElement ? AnchorButtonProps : ButtonProps,
    ref: React.Ref<E>,
) {
    const { active = false, alignText, fill, large, loading = false, outlined, minimal, small, tabIndex } = props;
    const disabled = props.disabled || loading;

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
            props.onBlur?.(e);
        },
        [isActive, props.onBlur],
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
            props.onKeyDown?.(e);
        },
        [currentKeyPressed, props.onKeyDown],
    );
    const handleKeyUp = React.useCallback(
        (e: React.KeyboardEvent<any>) => {
            if (Utils.isKeyboardClick(e)) {
                setIsActive(false);
                buttonRef.current?.click();
            }
            setCurrentKeyPressed(undefined);
            props.onKeyUp?.(e);
        },
        [props.onKeyUp],
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
    const { children, icon, loading, rightIcon, text } = props;
    const hasTextContent = !Utils.isReactNodeEmpty(text) || !Utils.isReactNodeEmpty(children);
    return (
        <>
            {loading && <Spinner key="loading" className={Classes.BUTTON_SPINNER} size={SpinnerSize.SMALL} />}
            <Icon key="leftIcon" icon={icon} />
            {hasTextContent && (
                <span key="text" className={Classes.BUTTON_TEXT}>
                    {text}
                    {children}
                </span>
            )}
            <Icon key="rightIcon" icon={rightIcon} />
        </>
    );
}
