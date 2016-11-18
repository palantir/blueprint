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

export interface ITabListProps extends IProps {
    /**
     * The list of CSS rules to use on the indicator wrapper.
     * @internal
     */
    indicatorWrapperStyle?: React.CSSProperties;
}

export interface ITabListState {
    /**
     * Whether the animation should be run when transform changes.
     */
    shouldAnimate?: boolean;
}

@PureRender
export class TabList extends React.Component<ITabListProps, {}> {
    public displayName = "Blueprint.TabList";
    public state: ITabListState = {
        shouldAnimate: false,
    };

    public render() {
        return (
            <ul
                className={classNames(Classes.TAB_LIST, this.props.className)}
                role="tablist"
            >
                <div
                    className={classNames("pt-tab-indicator-wrapper", { "pt-no-animation": !this.state.shouldAnimate })}
                    style={this.props.indicatorWrapperStyle}
                >
                    <div className="pt-tab-indicator" />
                </div>
                {this.props.children}
            </ul>
        );
    }

    public componentDidUpdate(prevProps: ITabListProps) {
        if (prevProps.indicatorWrapperStyle == null) {
            setTimeout(() => this.setState({ shouldAnimate: true }));
        }
    }
}

export var TabListFactory = React.createFactory(TabList);
