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
import { AbstractButton, IButtonProps } from "./abstractButton";

export { IButtonProps } from "./abstractButton";

export class Button extends AbstractButton<HTMLButtonElement> {
    public static displayName = "Blueprint.Button";

    public render() {
        const { onClick } = this.props;
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
                {this.renderChildren()}
            </button>
        );
    }
}

export const ButtonFactory = React.createFactory(Button);

export class AnchorButton extends AbstractButton<HTMLAnchorElement> {
    public static displayName = "Blueprint.AnchorButton";

    public render() {
        const { href, onClick, tabIndex = 0 } = this.props;
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
                {this.renderChildren()}
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
