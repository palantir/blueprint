/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Alignment } from "../../common/alignment";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IActionProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Icon, IconName } from "../icon/icon";
import { Spinner } from "../spinner/spinner";

export interface IButtonProps extends IActionProps {
    /**
     * If set to `true`, the button will display in an active state.
     * This is equivalent to setting `className={Classes.ACTIVE}`.
     * @default false
     */
    active?: boolean;

    /**
     * Text alignment within button. By default, icons and text will be centered within the button.
     * Passing this prop will cause the text container to fill the button and align the text within that
     * to the appropriate side. `icon` and `rightIcon` will be pushed to either side.
     * @default Alignment.CENTER
     */
    alignText?: Alignment;

    /** A ref handler that receives the native HTML element backing this component. */
    elementRef?: (ref: HTMLElement | null) => any;

    /** Whether this button should expand to fill its container. */
    fill?: boolean;

    /** Whether this button should use large styles. */
    large?: boolean;

    /**
     * If set to `true`, the button will display a centered loading spinner instead of its contents.
     * The width of the button is not affected by the value of this prop.
     * @default false
     */
    loading?: boolean;

    /** Whether this button should use minimal styles. */
    minimal?: boolean;

    /** Name of a Blueprint UI icon (or an icon element) to render after the text. */
    rightIcon?: IconName | JSX.Element;

    /** Whether this button should use small styles. */
    small?: boolean;

    /**
     * HTML `type` attribute of button. Common values are `"button"` and `"submit"`.
     * Note that this prop has no effect on `AnchorButton`; it only affects `Button`.
     * @default "button"
     */
    type?: string;
}

export interface IButtonState {
    isActive: boolean;
}

export abstract class AbstractButton<H extends React.HTMLAttributes<any>> extends React.PureComponent<
    IButtonProps & H,
    IButtonState
> {
    public state = {
        isActive: false,
    };

    protected buttonRef: HTMLElement;
    protected refHandlers = {
        button: (ref: HTMLElement) => {
            this.buttonRef = ref;
            safeInvoke(this.props.elementRef, ref);
        },
    };

    private currentKeyDown: number = null;

    public abstract render(): JSX.Element;

    protected getCommonButtonProps() {
        const { alignText, fill, large, loading, minimal, small } = this.props;
        const disabled = this.props.disabled || loading;

        const className = classNames(
            Classes.BUTTON,
            {
                [Classes.ACTIVE]: this.state.isActive || this.props.active,
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.LOADING]: loading,
                [Classes.MINIMAL]: minimal,
                [Classes.SMALL]: small,
            },
            Classes.alignmentClass(alignText),
            Classes.intentClass(this.props.intent),
            this.props.className,
        );

        return {
            className,
            disabled,
            onClick: disabled ? undefined : this.props.onClick,
            onKeyDown: this.handleKeyDown,
            onKeyUp: this.handleKeyUp,
            ref: this.refHandlers.button,
        };
    }

    // we're casting as `any` to get around a somewhat opaque safeInvoke error
    // that "Type argument candidate 'KeyboardEvent<T>' is not a valid type
    // argument because it is not a supertype of candidate
    // 'KeyboardEvent<HTMLElement>'."
    protected handleKeyDown = (e: React.KeyboardEvent<any>) => {
        if (isKeyboardClick(e.which)) {
            e.preventDefault();
            if (e.which !== this.currentKeyDown) {
                this.setState({ isActive: true });
            }
        }
        this.currentKeyDown = e.which;
        safeInvoke(this.props.onKeyDown, e);
    };

    protected handleKeyUp = (e: React.KeyboardEvent<any>) => {
        if (isKeyboardClick(e.which)) {
            this.setState({ isActive: false });
            this.buttonRef.click();
        }
        this.currentKeyDown = null;
        safeInvoke(this.props.onKeyUp, e);
    };

    protected renderChildren(): React.ReactNode {
        const { children, icon, loading, rightIcon, text } = this.props;
        return (
            <>
                {loading && <Spinner className={classNames(Classes.SMALL, Classes.BUTTON_SPINNER)} />}
                <Icon icon={icon} />
                {(text || children) && (
                    <span className={Classes.BUTTON_TEXT}>
                        {text}
                        {children}
                    </span>
                )}
                <Icon icon={rightIcon} />
            </>
        );
    }
}

function isKeyboardClick(keyCode: number) {
    return keyCode === Keys.ENTER || keyCode === Keys.SPACE;
}
