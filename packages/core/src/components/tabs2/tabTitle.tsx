/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { ITabProps, TabId } from "./tab";

export interface ITabTitleProps extends ITabProps {
    onClick: React.MouseEventHandler<HTMLLIElement>;

    /**
     * ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes.
     */
    parentId: TabId;

    /**
     * Whether the tab is currently selected.
     */
    selected: boolean;
}

export const TabTitle: React.SFC<ITabTitleProps> = (props) => (
    <li
        aria-controls={generateTabPanelId(props.parentId, props.id)}
        aria-disabled={props.disabled}
        aria-expanded={props.selected}
        aria-selected={props.selected}
        className={classNames(Classes.TAB, props.className)}
        data-tab-id={props.id}
        id={generateTabTitleId(props.parentId, props.id)}
        onClick={props.disabled ? null : props.onClick}
        role="tab"
        selected={props.selected ? true : null}
        tabIndex={props.disabled ? null : 0}
    >
        {props.title}
    </li>
);
TabTitle.displayName = "Blueprint.TabTitle";

export function generateTabPanelId(parentId: TabId, tabId: TabId) {
    return `${Classes.TAB_PANEL}_${parentId}_${tabId}`;
}

export function generateTabTitleId(parentId: TabId, tabId: TabId) {
    return `${Classes.TAB}-title_${parentId}_${tabId}`;
}
