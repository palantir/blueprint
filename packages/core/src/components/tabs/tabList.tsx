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

import { AbstractComponent } from "../../common/abstractComponent";
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
export class TabList extends AbstractComponent<ITabListProps, {}> {
    public static displayName = "Blueprint.TabList";

    public state: ITabListState = {
        shouldAnimate: false,
    };

    public render() {
        return (
            <ul className={classNames(Classes.TAB_LIST, this.props.className)} role="tablist">
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
            this.setTimeout(() => this.setState({ shouldAnimate: true }));
        }
    }
}

export const TabListFactory = React.createFactory(TabList);
