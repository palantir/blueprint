/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent, Classes, Utils } from "../../common";

import { type TabId, type TabProps } from "./tab";
import type { TabsProps } from "./tabs";
import { generateTabIds, type TabTitleProps } from "./tabTitle";

export interface TabPanelProps
    extends Pick<TabProps, "className" | "id" | "panel">,
        Pick<TabsProps, "renderActiveTabPanelOnly" | "selectedTabId">,
        Pick<TabTitleProps, "parentId"> {
    /**
     * Used for setting visibility. This `TabPanel` will be visibile when `selectedTabId === id`, with proper accessibility attributes set.
     */
    selectedTabId: TabId | undefined;
}

/**
 * Wraps the passed `panel`.
 */
export class TabPanel extends AbstractPureComponent<TabPanelProps> {
    public render() {
        const { className, id, parentId, selectedTabId, panel, renderActiveTabPanelOnly } = this.props;

        const isSelected = id === selectedTabId;

        if (panel === undefined || (renderActiveTabPanelOnly && !isSelected)) {
            return undefined;
        }

        const { tabTitleId, tabPanelId } = generateTabIds(parentId, id);

        return (
            <div
                aria-labelledby={tabTitleId}
                aria-hidden={!isSelected}
                className={classNames(Classes.TAB_PANEL, className)}
                id={tabPanelId}
                role="tabpanel"
            >
                {Utils.isFunction(panel) ? panel({ tabPanelId, tabTitleId }) : panel}
            </div>
        );
    }
}
