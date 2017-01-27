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

    /** Name of icon (the part after `pt-icon-`) to add to button. */
    rightIconName?: string;

    /**
     * If set to true, the button will display a centered loading spinner instead of its contents.
     * The width of the button is not affected by the value of this prop.
     * @default false
     */
    loading?: boolean;
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

    // define these as private members to avoid polluting component state with sneaky fields from this scope
    private currentKeyDown: number = null;
    private wasClickTriggeredFromKeyPress: boolean = false;
    private shiftKey: boolean = false;
    private metaKey: boolean = false;
    private altKey: boolean = false;

    public abstract render(): JSX.Element;

    protected getCommonButtonProps() {
        const disabled = this.props.disabled || this.props.loading;

        const className = classNames(
            Classes.BUTTON,
            {
                [Classes.ACTIVE]: this.state.isActive,
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
            onClick: disabled ? undefined : this.handleClick,
            onKeyDown: this.handleKeyDown,
            onKeyUp: this.handleKeyUp,
            ref: this.refHandlers.button,
        };
    }

    protected handleClick = (e: React.MouseEvent<HTMLElement>) => {
        if (this.wasClickTriggeredFromKeyPress && e != null) {
            // pass the modifier keys from the keyboard press to the click event
            e.altKey = this.altKey;
            e.metaKey = this.metaKey;
            e.shiftKey = this.shiftKey;

            // reset all fields to prepare for the next click or keyboard event
            this.wasClickTriggeredFromKeyPress = false;
            this.altKey = false;
            this.metaKey = false;
            this.shiftKey = false;
        }
        this.props.onClick(e);
    }

    protected handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (isKeyboardClick(e.which)) {
            e.preventDefault();
            if (e.which !== this.currentKeyDown) {
                this.setState({ isActive: true });
            }
        }
        this.currentKeyDown = e.which;
    }

    protected handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
        if (isKeyboardClick(e.which)) {
            this.setState({ isActive: false });

            // remember the modifier keys from this keyboard event, so we
            // can pass them to the click event.
            this.wasClickTriggeredFromKeyPress = true;
            this.shiftKey = e.shiftKey;
            this.metaKey = e.metaKey;
            this.altKey = e.altKey;

            this.buttonRef.click();
        }
        this.currentKeyDown = null;
    }

    protected renderChildren(): React.ReactNode {
        const { children, loading, rightIconName, text } = this.props;
        const iconClasses = classNames(Classes.ICON_STANDARD, Classes.iconClass(rightIconName), Classes.ALIGN_RIGHT);
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
