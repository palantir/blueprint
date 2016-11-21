/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
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
    public displayName = "Blueprint.TabPanel";

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

export let TabPanelFactory = React.createFactory(TabPanel);
