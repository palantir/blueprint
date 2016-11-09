/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

import { IStyleguideSection } from "./styleguide";

export interface INavMenuProps extends IProps {
    activeSectionId: string;
    onItemClick: (item: IStyleguideSection) => void;
    sections: IStyleguideSection[];
}

export interface INavMenuItemProps extends IStyleguideSection, IProps {
    onClick: (item: IStyleguideSection) => void;
}

export const NavMenuItem: React.SFC<INavMenuItemProps> = (props: INavMenuItemProps & { children: React.ReactNode }) => {
    const classes = classNames("docs-menu-item", `depth-${props.depth}`, props.className);
    const handleClick = () => props.onClick(props);
    return (
        <li className={classes}>
            <a href={"#" + props.reference} onClick={handleClick}>
                {props.header}
            </a>
            {props.children}
        </li>
    );
};

export const NavMenu: React.SFC<INavMenuProps> = (props) => {
    const filteredMenuItems: JSX.Element[] = props.sections
        .map((section, index) => {
            const isActive = props.activeSectionId === section.reference;
            const isExpanded = isActive || props.activeSectionId.indexOf(`${section.reference}.`) === 0;
            // active section gets selected styles, expanded section shows its children
            const classes = classNames({
                "docs-nav-active": isActive,
                "docs-nav-expanded": isExpanded,
            });
            return (
                <NavMenuItem
                    {...section}
                    className={classes}
                    key={index}
                    onClick={props.onItemClick}
                >
                    <NavMenu {...props} sections={section.sections} />
                </NavMenuItem>
            );
        });
    return <ul className="docs-nav-menu">{filteredMenuItems}</ul>;
};
