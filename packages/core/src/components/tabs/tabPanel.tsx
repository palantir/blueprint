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
import { IProps } from "../../common/props";

// properties with underscores should not be set by users (we set them in the <Tabs> component).
export interface ITabPanelProps extends IProps {
    /**
     * Element ID.
     */
    _id?: string;

    /**
     * The ID of the tab this panel corresponds to.
     */
    _tabId?: string;
}

@PureRender
export class TabPanel extends React.Component<ITabPanelProps, {}> {
    public static displayName = "Blueprint.TabPanel";

    public render() {
        return (
            <div
                aria-labelledby={this.props._tabId}
                className={classNames(Classes.TAB_PANEL, this.props.className)}
                id={this.props._id}
                role="tabpanel"
            >
                {this.props.children}
            </div>
        );
    }
}

export const TabPanelFactory = React.createFactory(TabPanel);
