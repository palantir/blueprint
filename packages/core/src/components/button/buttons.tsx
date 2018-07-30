/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// HACKHACK: these components should go in separate files
// tslint:disable max-classes-per-file

import * as React from "react";

import { DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";
import { AbstractButton, IButtonProps } from "./abstractButton";

export { IButtonProps };

export class Button extends AbstractButton<React.ButtonHTMLAttributes<HTMLButtonElement>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Button`;

    public render() {
        return (
            <button type="button" {...removeNonHTMLProps(this.props)} {...this.getCommonButtonProps()}>
                {this.renderChildren()}
            </button>
        );
    }
}

export class AnchorButton extends AbstractButton<React.AnchorHTMLAttributes<HTMLAnchorElement>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.AnchorButton`;

    public render() {
        const { href, tabIndex = 0 } = this.props;
        const commonProps = this.getCommonButtonProps();

        return (
            <a
                role="button"
                {...removeNonHTMLProps(this.props)}
                {...commonProps}
                href={commonProps.disabled ? undefined : href}
                tabIndex={commonProps.disabled ? -1 : tabIndex}
            >
                {this.renderChildren()}
            </a>
        );
    }
}
