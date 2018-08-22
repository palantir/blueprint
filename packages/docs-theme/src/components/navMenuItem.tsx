/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/

import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
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
