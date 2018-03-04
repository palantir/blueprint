/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { ITabProps, TabId } from "./tab";

export interface ITabTitleProps extends ITabProps {
    /** Handler invoked when this tab is clicked. */
    onClick: (id: TabId, event: React.MouseEvent<HTMLElement>) => void;

    /** ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes. */
    parentId: TabId;

    /** Whether the tab is currently selected. */
    selected: boolean;
}

export class TabTitle extends React.PureComponent<ITabTitleProps, {}> {
    public static displayName = "Blueprint2.TabTitle";

    public render() {
        const { disabled, id, parentId, selected } = this.props;
        return (
            <div
                aria-controls={generateTabPanelId(parentId, id)}
                aria-disabled={disabled}
                aria-expanded={selected}
                aria-selected={selected}
                className={classNames(Classes.TAB, this.props.className)}
                data-tab-id={id}
                id={generateTabTitleId(parentId, id)}
                onClick={disabled ? undefined : this.handleClick}
                role="tab"
                tabIndex={disabled ? undefined : 0}
            >
                {this.props.title}
                {this.props.children}
            </div>
        );
    }

    private handleClick = (e: React.MouseEvent<HTMLElement>) => this.props.onClick(this.props.id, e);
}

export function generateTabPanelId(parentId: TabId, tabId: TabId) {
    return `${Classes.TAB_PANEL}_${parentId}_${tabId}`;
}

export function generateTabTitleId(parentId: TabId, tabId: TabId) {
    return `${Classes.TAB}-title_${parentId}_${tabId}`;
}
