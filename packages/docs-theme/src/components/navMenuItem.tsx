/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "@blueprintjs/core";
import { IHeadingNode, IPageNode } from "@documentalist/client";
import classNames from "classnames";
import * as React from "react";

export interface INavMenuItemProps {
    /** CSS classes to apply to the root element, for proper appearance in the tree. */
    className: string;

    /** Link URL. */
    href: string;

    /** Whether this item is the active section (currently being viewed) */
    isActive: boolean;

    /** Whether this section is expanded (it or a child is being viewed) */
    isExpanded: boolean;

    /** Click handler for item, to navigate to URL. */
    onClick: () => void;

    /** The section for this menu item, either a page or a heading node. */
    section: IPageNode | IHeadingNode;
}

export const NavMenuItem: React.SFC<INavMenuItemProps> = props => {
    const { className, isActive, isExpanded, section, ...htmlProps } = props;
    return (
        <a className={classNames(Classes.MENU_ITEM, className)} {...htmlProps}>
            <span>{section.title}</span>
            {props.children}
        </a>
    );
};
NavMenuItem.displayName = "Docs2.NavMenuItem";
