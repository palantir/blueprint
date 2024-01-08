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

export interface NavbarHeadingProps extends Props, HTMLDivProps {
    children?: React.ReactNode;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class NavbarHeading extends AbstractPureComponent<NavbarHeadingProps> {
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
