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
import { removeNonHTMLProps } from "../../common/props";
import { Spinner } from "../spinner/spinner";
import { AbstractButton, IButtonProps } from "./abstractButton";

export class Button extends AbstractButton<HTMLButtonElement> {
    public static displayName = "Blueprint.Button";

    public render() {
        const { children, loading, onClick, rightIconName, text } = this.props;
        const disabled = isButtonDisabled(this.props);

        return (
            <button
                type="button"
                {...removeNonHTMLProps(this.props)}
                className={getButtonClasses(this.props, this.state.isActive)}
                onClick={disabled ? undefined : onClick}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                ref={this.refHandlers.button}
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

export class AnchorButton extends AbstractButton<HTMLButtonElement> {
    public static displayName = "Blueprint.AnchorButton";

    public render() {
        const { children, href, onClick, loading, rightIconName, tabIndex = 0, text } = this.props;
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
                ref={this.refHandlers.button}
                tabIndex={disabled ? undefined : tabIndex}
            >
                {maybeRenderSpinner(loading)}
                {maybeRenderText(text)}
                {children}
                {maybeRenderRightIcon(rightIconName)}
            </a>
        );
    }
}

export const AnchorButtonFactory = React.createFactory(AnchorButton);

function getButtonClasses(props: IButtonProps, isActive = false) {
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
