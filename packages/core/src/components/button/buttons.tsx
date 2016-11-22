/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IActionProps, removeNonHTMLProps } from "../../common/props";

function getButtonClasses(props: IButtonProps) {
    return classNames(
        Classes.BUTTON,
        { [Classes.DISABLED]: props.disabled },
        Classes.iconClass(props.iconName),
        Classes.intentClass(props.intent),
        props.className
    );
}

function maybeRenderRightIcon(iconName: string) {
    if (iconName == null) {
        return null;
    } else {
        return <span className={classNames(Classes.ICON_STANDARD, Classes.iconClass(iconName), Classes.ALIGN_RIGHT)} />;
    }
}

export interface IButtonProps extends IActionProps {
    /** A ref handler that receives the native HTML element backing this component. */
    elementRef?: (ref: HTMLElement) => any;

    /** Name of icon (the part after `pt-icon-`) to add to button. */
    rightIconName?: string;
}

export class Button extends React.Component<React.HTMLProps<HTMLButtonElement> & IButtonProps, {}> {
    public static displayName = "Blueprint.Button";

    public render() {
        return (
            <button
                type="button"
                {...removeNonHTMLProps(this.props)}
                className={getButtonClasses(this.props)}
                ref={this.props.elementRef}
            >
                {this.props.text}
                {this.props.children}
                {maybeRenderRightIcon(this.props.rightIconName)}
            </button>
        );
    }
}

export class AnchorButton extends React.Component<React.HTMLProps<HTMLAnchorElement> & IButtonProps, {}> {
    public static displayName = "Blueprint.AnchorButton";

    public render() {
        const { children, disabled, href, onClick, rightIconName, text } = this.props;
        return (
            <a
                {...removeNonHTMLProps(this.props)}
                className={getButtonClasses(this.props)}
                href={disabled ? null : href}
                onClick={disabled ? null : onClick}
                ref={this.props.elementRef}
                role="button"
                tabIndex={disabled ? null : 0}
            >
                {text}
                {children}
                {maybeRenderRightIcon(rightIconName)}
            </a>
        );
    }
}

export const ButtonFactory = React.createFactory(Button);
export const AnchorButtonFactory = React.createFactory(AnchorButton);
