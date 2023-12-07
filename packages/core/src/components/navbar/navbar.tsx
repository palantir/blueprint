/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type Props } from "../../common/props";
import { NavbarDivider } from "./navbarDivider";
import { NavbarGroup } from "./navbarGroup";
import { NavbarHeading } from "./navbarHeading";

export interface NavbarProps extends Props, HTMLDivProps {
    children?: React.ReactNode;

    /**
     * Whether this navbar should be fixed to the top of the viewport (using CSS `position: fixed`).
     */
    fixedToTop?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
/**
 * Navbar component.
 *
 * @see https://blueprintjs.com/docs/#core/components/navbar
 */
export class Navbar extends AbstractPureComponent<NavbarProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Navbar`;

    public static Divider = NavbarDivider;

    public static Group = NavbarGroup;

    public static Heading = NavbarHeading;

    public render() {
        const { children, className, fixedToTop, ...htmlProps } = this.props;
        const classes = classNames(Classes.NAVBAR, { [Classes.FIXED_TOP]: fixedToTop }, className);
        return (
            <div className={classes} {...htmlProps}>
                {children}
            </div>
        );
    }
}
