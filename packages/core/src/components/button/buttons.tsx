/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// HACKHACK: these components should go in separate files
// tslint:disable max-classes-per-file

import * as React from "react";

import { removeNonHTMLProps } from "../../common/props";

// namespace import for re-exported IButtonProps ("cannot be named")
import * as AB from "./abstractButton";

export { IButtonProps } from "./abstractButton";

export class Button extends AB.AbstractButton<HTMLButtonElement> {
    public static displayName = "Blueprint.Button";

    public render() {
        return (
            <button
                type="button"
                {...removeNonHTMLProps(this.props)}
                {...this.getProps()}
            >
                {this.renderChildren()}
            </button>
        );
    }
}

export const ButtonFactory = React.createFactory(Button);

export class AnchorButton extends AB.AbstractButton<HTMLAnchorElement> {
    public static displayName = "Blueprint.AnchorButton";

    public render() {
        const { href, tabIndex = 0 } = this.props;
        const props = this.getProps();

        return (
            <a
                role="button"
                {...removeNonHTMLProps(this.props)}
                {...props}
                href={props.disabled ? undefined : href}
                tabIndex={props.disabled ? undefined : tabIndex}
            >
                {this.renderChildren()}
            </a>
        );
    }
}

export const AnchorButtonFactory = React.createFactory(AnchorButton);
