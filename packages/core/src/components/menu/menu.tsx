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
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes, IRef } from "../../common";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { MenuDivider } from "./menuDivider";
// this cyclic import can be removed in v4.0 (https://github.com/palantir/blueprint/issues/3829)
// eslint-disable-next-line import/no-cycle
import { MenuItem } from "./menuItem";

// eslint-disable-next-line deprecation/deprecation
export type MenuProps = IMenuProps;
/** @deprecated use MenuProps */
export interface IMenuProps extends Props, React.HTMLAttributes<HTMLUListElement> {
    /** Whether the menu items in this menu should use a large appearance. */
    large?: boolean;

    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: IRef<HTMLUListElement>;
}

@polyfill
export class Menu extends AbstractPureComponent2<MenuProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Menu`;

    /** @deprecated use MenuDivider */
    public static Divider = MenuDivider;

    /** @deprecated use MenuItem*/
    public static Item = MenuItem;

    public render() {
        const { className, children, large, ulRef, ...htmlProps } = this.props;
        const classes = classNames(Classes.MENU, { [Classes.LARGE]: large }, className);
        return (
            <ul {...htmlProps} className={classes} ref={ulRef}>
                {children}
            </ul>
        );
    }
}
