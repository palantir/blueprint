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
import { DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";
import { ITabProps, TabId } from "./tab";

export interface ITabTitleProps extends ITabProps {
    /** Handler invoked when this tab is clicked. */
    onClick: (id: TabId, event: React.MouseEvent<HTMLElement>) => void;

    /** ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes. */
    parentId: TabId;

    /** Whether the tab is currently selected. */
    selected: boolean;
}

@polyfill
export class TabTitle extends AbstractPureComponent2<ITabTitleProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TabTitle`;

    public render() {
        const { className, children, disabled, id, parentId, selected, title, ...htmlProps } = this.props;
        return (
            <div
                {...removeNonHTMLProps(htmlProps)}
                aria-controls={generateTabPanelId(parentId, id)}
                aria-disabled={disabled}
                aria-expanded={selected}
                aria-selected={selected}
                className={classNames(Classes.TAB, className)}
                data-tab-id={id}
                id={generateTabTitleId(parentId, id)}
                onClick={disabled ? undefined : this.handleClick}
                role="tab"
                tabIndex={disabled ? undefined : 0}
            >
                {title}
                {children}
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
