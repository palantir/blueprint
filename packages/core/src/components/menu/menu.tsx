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

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";
import type { Size } from "../../common/size";

export interface MenuProps extends Props, React.HTMLAttributes<HTMLUListElement> {
    /** Menu items. */
    children?: React.ReactNode;

    /**
     * Whether the menu items in this menu should use a large appearance.
     *
     * @deprecated use `size="large"` instead.
     * @default false
     */
    large?: boolean;

    /**
     * Whether the menu items in this menu should use a small appearance.
     *
     * @deprecated use `size="small"` instead.
     * @default false
     */
    small?: boolean;

    /**
     * The size of the items in this menu.
     *
     * @default "medium"
     */
    size?: Size;

    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: React.Ref<HTMLUListElement>;
}

/**
 * Menu component.
 *
 * @see https://blueprintjs.com/docs/#core/components/menu
 */
export const Menu: React.FC<MenuProps> = props => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const { className, children, large, size = "medium", small, ulRef, ...htmlProps } = props;
    return (
        <ul
            role="menu"
            {...htmlProps}
            className={classNames(className, Classes.MENU, Classes.sizeClass(size, { large, small }))}
            ref={ulRef}
        >
            {children}
        </ul>
    );
};
Menu.displayName = `${DISPLAYNAME_PREFIX}.Menu`;
