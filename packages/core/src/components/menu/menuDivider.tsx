/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { H6 } from "../html/html";

export interface MenuDividerProps extends Props {
    /** This component does not support children. */
    children?: never;

    /** Optional header title. */
    title?: React.ReactNode;

    /** Optional `id` prop for the header title. */
    titleId?: string;
}

/**
 * Menu divider component.
 *
 * @see https://blueprintjs.com/docs/#core/components/menu.menu-divider
 */
export class MenuDivider extends React.Component<MenuDividerProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MenuDivider`;

    public render() {
        const { className, title, titleId } = this.props;
        if (title == null) {
            // simple divider
            return <li className={classNames(Classes.MENU_DIVIDER, className)} role="separator" />;
        } else {
            // section header with title
            return (
                <li className={classNames(Classes.MENU_HEADER, className)} role="separator">
                    <H6 id={titleId}>{title}</H6>
                </li>
            );
        }
    }
}
