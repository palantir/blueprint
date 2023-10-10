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

import { AbstractPureComponent, Classes, Intent } from "../../common";
import { DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";
import { Icon } from "../icon/icon";
import { Tag } from "../tag/tag";
import type { TabId, TabProps } from "./tab";

export interface TabTitleProps extends TabProps {
    /** Optional contents. */
    children?: React.ReactNode;

    /** Handler invoked when this tab is clicked. */
    onClick: (id: TabId, event: React.MouseEvent<HTMLElement>) => void;

    /** ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes. */
    parentId: TabId;

    /** Whether the tab is currently selected. */
    selected: boolean;
}

export class TabTitle extends AbstractPureComponent<TabTitleProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TabTitle`;

    public render() {
        const {
            className,
            children,
            disabled,
            id,
            parentId,
            selected,
            title,
            icon,
            tagContent,
            tagProps,
            ...htmlProps
        } = this.props;
        const intent = selected ? Intent.PRIMARY : Intent.NONE;

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
                tabIndex={disabled ? undefined : selected ? 0 : -1}
            >
                {icon != null && <Icon icon={icon} intent={intent} className={Classes.TAB_ICON} />}
                {title}
                {children}
                {tagContent != null && (
                    <Tag
                        minimal={true}
                        intent={intent}
                        {...tagProps}
                        className={classNames(Classes.TAB_TAG, tagProps?.className)}
                    >
                        {tagContent}
                    </Tag>
                )}
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
