/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// HACKHACK: these components should go in separate files
// tslint:disable max-classes-per-file

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IActionProps, removeNonHTMLProps } from "../../common/props";
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

export class Button extends React.Component<React.HTMLProps<HTMLButtonElement> & IButtonProps, {}> {
    public static displayName = "Blueprint.Button";

    public render() {
        const { children, elementRef, loading, onClick, rightIconName, text } = this.props;
        const disabled = isButtonDisabled(this.props);

        return (
            <button
                type="button"
                {...removeNonHTMLProps(this.props)}
                className={getButtonClasses(this.props)}
                onClick={disabled ? undefined : onClick}
                ref={elementRef}
            >
                {maybeRenderSpinner(loading)}
                {maybeRenderText(text)}
                {children}
                {maybeRenderRightIcon(rightIconName)}
            </button>
        );
    }
}

export const ButtonFactory = React.createFactory(Button);

export class AnchorButton extends
        React.Component<React.HTMLProps<HTMLAnchorElement> & IButtonProps, { isActive: boolean }> {
    public static displayName = "Blueprint.AnchorButton";

    public state = {
        isActive: false,
    };

    public render() {
        const { children, elementRef, href, onClick, loading, rightIconName, tabIndex = 0, text } = this.props;
        const disabled = isButtonDisabled(this.props);

        return (
            <a
                role="button"
                {...removeNonHTMLProps(this.props)}
                className={getButtonClasses(this.props, this.state.isActive)}
                href={disabled ? undefined : href}
                onClick={disabled ? undefined : onClick}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                ref={elementRef}
                tabIndex={disabled ? undefined : tabIndex}
            >
                {maybeRenderSpinner(loading)}
                {maybeRenderText(text)}
                {children}
                {maybeRenderRightIcon(rightIconName)}
            </a>
        );
    }

    // Provide consistent keyboard interactions across both <Button /> and <AnchorButton /> (#430)
    private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        const { href, onClick, target } = this.props;
        if (e.which === Keys.SPACE) {
            e.preventDefault();

            if (href) {
                if (target === undefined || target === "_self") {
                    window.open(href);
                } else if (target === "_blank") {
                    window.open(href, "_newtab");
                }
            } else {
                this.setState({isActive: true});
            }
        }

        if (e.which === Keys.ENTER && this.props.onClick) {
            onClick(e as any);
        }
    }

    private onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.which === Keys.SPACE) {
            this.setState({isActive: false});

            if (this.props.onClick) {
                this.props.onClick(e as any);
            }
        }
    }
}

export const AnchorButtonFactory = React.createFactory(AnchorButton);

function getButtonClasses(props: IButtonProps, isActive: boolean = false ) {
    return classNames(
        Classes.BUTTON, {
            [Classes.ACTIVE]: isActive,
            [Classes.DISABLED]: isButtonDisabled(props),
            [Classes.LOADING]: props.loading,
        },
        Classes.iconClass(props.iconName),
        Classes.intentClass(props.intent),
        props.className,
    );
}

function isButtonDisabled(props: IButtonProps) {
    return props.disabled || props.loading;
}

function maybeRenderSpinner(loading: boolean) {
    return loading
      ? <Spinner className="pt-small pt-button-spinner" />
      : undefined;
}

function maybeRenderText(text?: string) {
    return text
      ? <span>{text}</span>
      : undefined;
}

function maybeRenderRightIcon(iconName: string) {
    if (iconName == null) {
        return undefined;
    } else {
        return <span className={classNames(Classes.ICON_STANDARD, Classes.iconClass(iconName), Classes.ALIGN_RIGHT)} />;
    }
}
