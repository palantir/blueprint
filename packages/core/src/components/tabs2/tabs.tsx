/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { safeInvoke} from "../../common/utils";

import { ITabProps, Tab } from "./tab";
import { TabTitle } from "./TabTitle";

// <Tabs>
//     <Tab title="Alpha">
//         <h1>first panel</h1>
//     </Tab>
//     <Tab title="Beta">
//         <h1>second panel</h1>
//     </Tab>
//     <input type="text" placeholder="Search..." />
// </Tabs>

// TODO
// `renderActiveTabPanelOnly`
// animate tab indicator
// key bindings

type TabElement = React.ReactElement<ITabProps & { children: React.ReactNode }>;

export interface ITabsProps extends IProps {
    /**
     *
     */
    defaultSelectedTabIndex?: number;

    /**
     * Whether to show tabs stacked vertically on the left side.
     * @default false
     */
    vertical?: boolean;

    /**
     * A callback function that is invoked when tabs in the tab list are clicked.
     */
    onChange?(selectedTabIndex: number, prevSelectedTabIndex: number): void;
}

export interface ITabsState {
    /**
     * The list of CSS rules to use on the indicator wrapper of the tab list.
     */
    indicatorWrapperStyle?: React.CSSProperties;

    /**
     * The index of the currently selected tab.
     * If a prop with the same name is set, this bit of state simply aliases the prop.
     */
    selectedTabIndex?: number;
}

@PureRender
export class Tabs extends AbstractComponent<ITabsProps, ITabsState> {
    public static defaultProps: ITabsProps = {
        defaultSelectedTabIndex: 0,
        vertical: false,
    };

    public displayName = "Blueprint.Tabs";

    constructor(props?: ITabsProps, context?: any) {
        super(props, context);
        this.state = {
            selectedTabIndex: props.defaultSelectedTabIndex,
        };
    }

    public render() {
        const { selectedTabIndex } = this.state;

        // separate counter to only include Tab-type children
        let tabIndex = -1;
        const tabs = React.Children.map(this.props.children, (child) => {
            if (isTab(child)) {
                tabIndex++;
                return (
                    <TabTitle
                        {...child.props}
                        onClick={this.getClickHandler(tabIndex)}
                        selected={tabIndex === selectedTabIndex}
                    />
                );
            } else {
                // TabTitle renders an <li> so let's do the same here
                return <li>{child}</li>;
            }
        });

        // only render the active tab, for performance and such
        const activeTab = this.getTabChildren()[selectedTabIndex];

        const classes = classNames(Classes.TABS, { "pt-vertical": this.props.vertical }, this.props.className);
        return (
            <div className={classes}>
                <div className={Classes.TAB_LIST} role="tablist">{tabs}</div>
                {activeTab}
            </div>
        );
    }

    private getTabChildren() {
        return React.Children.toArray(this.props.children).filter(isTab) as TabElement[];
    }

    private getClickHandler(selectedTabIndex: number) {
        return () => {
            safeInvoke(this.props.onChange, selectedTabIndex, this.state.selectedTabIndex);
            this.setState({ selectedTabIndex });
        };
    }
}

export const TabsFactory = React.createFactory(Tabs);

function isTab(child: React.ReactChild): child is TabElement {
    return (child as JSX.Element).type === Tab;
}
