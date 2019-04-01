/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
