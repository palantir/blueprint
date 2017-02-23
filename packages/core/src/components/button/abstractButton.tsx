/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IActionProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Spinner } from "../spinner/spinner";

export interface IButtonProps extends IActionProps {
    /** A ref handler that receives the native HTML element backing this component. */
    elementRef?: (ref: HTMLElement) => any;

    /** Name of the icon (the part after `pt-icon-`) to add to the button. */
    rightIconName?: string;

    /**
     * If set to `true`, the button will display a centered loading spinner instead of its contents.
     * The width of the button is not affected by the value of this prop.
     * @default false
     */
    loading?: boolean;

    /**
     * If set to `true`, the button will display in an active state.
     * This is equivalent to setting `pt-active` via className.
     * @default false
     */
    active?: boolean;

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

export abstract class AbstractButton<T> extends React.Component<React.HTMLProps<T> & IButtonProps, IButtonState> {
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
        const disabled = this.props.disabled || this.props.loading;

        const className = classNames(
            Classes.BUTTON,
            {
                [Classes.ACTIVE]: this.state.isActive || this.props.active,
                [Classes.DISABLED]: disabled,
                [Classes.LOADING]: this.props.loading,
            },
            Classes.iconClass(this.props.iconName),
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
    }

    protected handleKeyUp = (e: React.KeyboardEvent<any>) => {
        if (isKeyboardClick(e.which)) {
            this.setState({ isActive: false });
            this.buttonRef.click();
        }
        this.currentKeyDown = null;
        safeInvoke(this.props.onKeyUp, e);
    }

    protected renderChildren(): React.ReactNode {
        const { loading, rightIconName, text } = this.props;
        const iconClasses = classNames(Classes.ICON_STANDARD, Classes.iconClass(rightIconName), Classes.ALIGN_RIGHT);

        const children = React.Children.map(this.props.children, (child, index) => {
            // must wrap string children in spans so loading prop can hide them
            if (typeof child === "string") {
                return <span key={`text-${index}`}>{child}</span>;
            }
            return child;
        });

        return [
            loading ? <Spinner className="pt-small pt-button-spinner" key="spinner" /> : undefined,
            text != null ? <span key="text">{text}</span> : undefined,
            children,
            rightIconName != null ? <span className={iconClasses} key="icon" /> : undefined,
        ];
    }
}

function isKeyboardClick(keyCode: number) {
    return keyCode === Keys.ENTER || keyCode === Keys.SPACE;
}
