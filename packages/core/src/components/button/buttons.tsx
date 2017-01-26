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
import { AbstractButton, IButtonProps } from "./abstractButton";

export { IButtonProps };

export class Button extends AbstractButton<HTMLButtonElement> {
    public static displayName = "Blueprint.Button";

    public render() {
        return (
            <button
                type="button"
                {...removeNonHTMLProps(this.props)}
                {...this.getCommonButtonProps()}
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
        const { href, tabIndex = 0 } = this.props;
        const commonProps = this.getCommonButtonProps();

        return (
            <a
                role="button"
                {...removeNonHTMLProps(this.props)}
                {...commonProps}
                href={commonProps.disabled ? undefined : href}
                tabIndex={commonProps.disabled ? undefined : tabIndex}
            >
                {this.renderChildren()}
            </a>
        );
    }
}

export const AnchorButtonFactory = React.createFactory(AnchorButton);
