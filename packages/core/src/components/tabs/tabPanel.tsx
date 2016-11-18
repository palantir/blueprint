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
                aria-labeledby={this.props._tabId}
                className={classNames(Classes.TAB_PANEL, this.props.className)}
                id={this.props._id}
                role="tabpanel"
            >
                {this.props.children}
            </div>
        );
    }
}

export var TabPanelFactory = React.createFactory(TabPanel);
