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

import { type TabProps } from "./tab";
import type { TabsProps } from "./tabs";
import { generateTabIds, type TabTitleProps } from "./tabTitle";

export interface TabPanelProps
    extends Pick<TabProps, "className" | "id" | "panel">,
        Pick<TabsProps, "renderActiveTabPanelOnly">,
        Pick<TabTitleProps, "parentId"> {
    /**
     * Used for setting `aria-hidden` prop.
     */
    isHidden: boolean;
}

/**
 * Wraps the passed `panel`.
 */
export class TabPanel extends AbstractPureComponent<TabPanelProps> {
    public render() {
        const { className, id, parentId, panel, isHidden, renderActiveTabPanelOnly } = this.props;

        if (panel === undefined || (renderActiveTabPanelOnly && isHidden)) {
            return undefined;
        }

        const { tabTitleId, tabPanelId } = generateTabIds(parentId, id);

        return (
            <div
                aria-labelledby={tabTitleId}
                aria-hidden={isHidden}
                className={classNames(Classes.TAB_PANEL, className)}
                id={tabPanelId}
                role="tabpanel"
            >
                {Utils.isFunction(panel) ? panel({ tabTitleId, tabPanelId }) : panel}
            </div>
        );
    }
}