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

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { ITab2Props, TabId } from "./tab2";

export interface ITabTitleProps extends ITab2Props {
    /** Handler invoked when this tab is clicked. */
    onClick: (id: TabId, event: React.MouseEvent<HTMLElement>) => void;

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
