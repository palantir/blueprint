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
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, Props } from "../../common/props";

// eslint-disable-next-line deprecation/deprecation
export type NavbarHeadingProps = INavbarHeadingProps;
/** @deprecated use NavbarHeadingProps */
export interface INavbarHeadingProps extends Props, HTMLDivProps {
    // allow the empty interface so we can label it clearly in the docs
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@polyfill
export class NavbarHeading extends AbstractPureComponent2<NavbarHeadingProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.NavbarHeading`;

    public render() {
        const { children, className, ...htmlProps } = this.props;
        return (
            <div className={classNames(Classes.NAVBAR_HEADING, className)} {...htmlProps}>
                {children}
            </div>
        );
    }
}
