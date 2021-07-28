/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import {
    AbstractPureComponent2,
    Alignment,
    Classes,
    ActionProps,
    IElementRefProps,
    Keys,
    MaybeElement,
    Utils,
} from "../../common";
import { Icon, IconName, IconSize } from "../icon/icon";
import { Spinner } from "../spinner/spinner";

// eslint-disable-next-line deprecation/deprecation
export type ButtonProps<E extends HTMLButtonElement | HTMLAnchorElement = HTMLButtonElement> = IButtonProps<E>;
/** @deprecated use ButtonProps */
export interface IButtonProps<E extends HTMLButtonElement | HTMLAnchorElement = HTMLButtonElement>
    extends ActionProps,
        // eslint-disable-next-line deprecation/deprecation
        IElementRefProps<E> {
    /**
     * If set to `true`, the button will display in an active state.
     * This is equivalent to setting `className={Classes.ACTIVE}`.
     *
     * @default false
     */
    active?: boolean;

    /**
     * Text alignment within button. By default, icons and text will be centered
     * within the button. Passing `"left"` or `"right"` will align the button
     * text to that side and push `icon` and `rightIcon` to either edge. Passing
     * `"center"` will center the text and icons together.
     *
     * @default Alignment.CENTER
     */
    alignText?: Alignment;

    /** Whether this button should expand to fill its container. */
    fill?: boolean;

    /** Whether this button should use large styles. */
    large?: boolean;

    /**
     * If set to `true`, the button will display a centered loading spinner instead of its contents.
     * The width of the button is not affected by the value of this prop.
     *
     * @default false
     */
    loading?: boolean;

    /** Whether this button should use minimal styles. */
    minimal?: boolean;

    /** Whether this button should use outlined styles. */
    outlined?: boolean;

    /** Name of a Blueprint UI icon (or an icon element) to render after the text. */
    rightIcon?: IconName | MaybeElement;

    /** Whether this button should use small styles. */
    small?: boolean;

    /**
     * HTML `type` attribute of button. Accepted values are `"button"`, `"submit"`, and `"reset"`.
     * Note that this prop has no effect on `AnchorButton`; it only affects `Button`.
     *
     * @default "button"
     */
    type?: "submit" | "reset" | "button";
}

/** @deprecated use AnchorButtonProps */
export type IAnchorButtonProps = ButtonProps<HTMLAnchorElement>;
// eslint-disable-next-line deprecation/deprecation
export type AnchorButtonProps = IAnchorButtonProps;

export interface IButtonState {
    isActive: boolean;
}

export abstract class AbstractButton<E extends HTMLButtonElement | HTMLAnchorElement> extends AbstractPureComponent2<
    ButtonProps<E> &
        (E extends HTMLButtonElement
            ? React.ButtonHTMLAttributes<HTMLButtonElement>
            : React.AnchorHTMLAttributes<HTMLAnchorElement>),
    IButtonState
> {
    public state = {
        isActive: false,
    };

    protected abstract buttonRef: HTMLElement | null;

    private currentKeyDown?: number;

    public abstract render(): JSX.Element;

    protected getCommonButtonProps() {
        const { active, alignText, fill, large, loading, outlined, minimal, small, tabIndex } = this.props;
        const disabled = this.props.disabled || loading;

        const className = classNames(
            Classes.BUTTON,
            {
                [Classes.ACTIVE]: !disabled && (active || this.state.isActive),
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.LOADING]: loading,
                [Classes.MINIMAL]: minimal,
                [Classes.OUTLINED]: outlined,
                [Classes.SMALL]: small,
            },
            Classes.alignmentClass(alignText),
            Classes.intentClass(this.props.intent),
            this.props.className,
        );

        return {
            className,
            disabled,
            onBlur: this.handleBlur,
            onClick: disabled ? undefined : this.props.onClick,
            onKeyDown: this.handleKeyDown,
            onKeyUp: this.handleKeyUp,
            tabIndex: disabled ? -1 : tabIndex,
        };
    }

    // we're casting as `any` to get around a somewhat opaque safeInvoke error
    // that "Type argument candidate 'KeyboardEvent<T>' is not a valid type
    // argument because it is not a supertype of candidate
    // 'KeyboardEvent<HTMLElement>'."
    protected handleKeyDown = (e: React.KeyboardEvent<any>) => {
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable deprecation/deprecation */
        if (Keys.isKeyboardClick(e.which)) {
            e.preventDefault();
            if (e.which !== this.currentKeyDown) {
                this.setState({ isActive: true });
            }
        }
        this.currentKeyDown = e.which;
        this.props.onKeyDown?.(e);
    };

    protected handleKeyUp = (e: React.KeyboardEvent<any>) => {
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable deprecation/deprecation */
        if (Keys.isKeyboardClick(e.which)) {
            this.setState({ isActive: false });
            this.buttonRef?.click();
        }
        this.currentKeyDown = undefined;
        this.props.onKeyUp?.(e);
    };

    protected handleBlur = (e: React.FocusEvent<any>) => {
        if (this.state.isActive) {
            this.setState({ isActive: false });
        }
        this.props.onBlur?.(e);
    };

    protected renderChildren(): React.ReactNode {
        const { children, icon, loading, rightIcon, text } = this.props;
        return [
            loading && <Spinner key="loading" className={Classes.BUTTON_SPINNER} size={IconSize.LARGE} />,
            <Icon key="leftIcon" icon={icon} />,
            (!Utils.isReactNodeEmpty(text) || !Utils.isReactNodeEmpty(children)) && (
                <span key="text" className={Classes.BUTTON_TEXT}>
                    {text}
                    {children}
                </span>
            ),
            <Icon key="rightIcon" icon={rightIcon} />,
        ];
    }
}
