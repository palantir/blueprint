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
import { IActionProps, removeNonHTMLProps } from "../../common/props";
import { Spinner } from "../spinner/spinner";

export interface IButtonProps extends IActionProps {
    /** A ref handler that receives the native HTML element backing this component. */
    elementRef?: (ref: HTMLElement) => any;

    /** Name of icon (the part after `pt-icon-`) to add to button. */
    rightIconName?: string;

    /** Whether the button's action is currently loading (will disable the button) */
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
                <span style={buttonContentsVisibility(loading)}>
                    {text}
                    {children}
                    {maybeRenderRightIcon(rightIconName)}
                </span>
            </button>
        );
    }
}

export const ButtonFactory = React.createFactory(Button);

export class AnchorButton extends React.Component<React.HTMLProps<HTMLAnchorElement> & IButtonProps, {}> {
    public static displayName = "Blueprint.AnchorButton";

    public render() {
        const { children, href, onClick, loading, rightIconName, tabIndex = 0, text } = this.props;
        const disabled = isButtonDisabled(this.props);

        return (
            <a
                role="button"
                {...removeNonHTMLProps(this.props)}
                className={getButtonClasses(this.props)}
                href={disabled ? undefined : href}
                onClick={disabled ? undefined : onClick}
                ref={this.props.elementRef}
                tabIndex={disabled ? undefined : tabIndex}
            >
                {maybeRenderSpinner(loading)}
                <span style={buttonContentsVisibility(loading)}>
                    {text}
                    {children}
                    {maybeRenderRightIcon(rightIconName)}
                </span>
            </a>
        );
    }
}

export const AnchorButtonFactory = React.createFactory(AnchorButton);

function getButtonClasses(props: IButtonProps) {
    return classNames(
        Classes.BUTTON,
        { [Classes.DISABLED]: isButtonDisabled(props) },
        Classes.iconClass(props.iconName),
        Classes.intentClass(props.intent),
        props.className,
    );
}

function isButtonDisabled(props: IButtonProps) {
    return props.disabled === true || props.loading === true;
}

function buttonContentsVisibility(loading: boolean) {
    return {visibility: loading ? "hidden" : "visible"};
}

function maybeRenderSpinner(loading: boolean) {
    return loading != null && loading
      ? <span className="pt-button-loading-spinner"><Spinner className="pt-small" /></span>
      : undefined;
}

function maybeRenderRightIcon(iconName: string) {
    if (iconName == null) {
        return undefined;
    } else {
        return <span className={classNames(Classes.ICON_STANDARD, Classes.iconClass(iconName), Classes.ALIGN_RIGHT)} />;
    }
}
