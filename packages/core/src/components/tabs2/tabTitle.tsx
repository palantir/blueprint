/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { ITab2Props, TabId } from "./tab";

export interface ITabTitleProps extends ITab2Props {
    /** Handler invoked when this tab is clicked. */
    onClick: (id: TabId, e: React.MouseEvent<HTMLElement>) => void;

    /** ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes. */
    parentId: TabId;

    /** Whether the tab is currently selected. */
    selected: boolean;
}

@PureRender
export class TabTitle extends React.Component<ITabTitleProps, {}> {
    public static displayName = "Blueprint.TabTitle";

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
                selected={selected ? true : undefined}
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
