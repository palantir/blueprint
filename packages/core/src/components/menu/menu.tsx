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
import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

export interface IMenuProps extends IProps, React.HTMLAttributes<HTMLUListElement> {
    /** Whether the menu items in this menu should use a large appearance. */
    large?: boolean;

    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: (ref: HTMLUListElement | null) => any;
}

@polyfill
export class Menu extends AbstractPureComponent2<IMenuProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Menu`;

    public static Divider = MenuDivider;
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
