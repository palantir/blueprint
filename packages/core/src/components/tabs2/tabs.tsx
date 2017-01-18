/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
// import { findDOMNode } from "react-dom";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
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
// vertical key bindings? up/dn

type TabElement = React.ReactElement<ITabProps & { children: React.ReactNode }>;

const TAB_SELECTOR = `.${Classes.TAB}`;

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

    private tabElement: HTMLDivElement;

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
                        onClick={this.getTabClickHandler(tabIndex)}
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
                <div
                    className={Classes.TAB_LIST}
                    onKeyDown={this.handleKeyDown}
                    onKeyPress={this.handleKeyPress}
                    ref={this.handleTabRef}
                    role="tablist"
                >
                    {tabs}
                </div>
                {activeTab}
            </div>
        );
    }

    /** Filters this.props.children to only `<Tab>`s */
    private getTabChildren() {
        return React.Children.toArray(this.props.children).filter(isTab) as TabElement[];
    }

    /** Queries root HTML element for all `.pt-tab`s */
    private getTabElements() {
        if (this.tabElement == null) {
            return [] as Elements;
        }
        return this.tabElement.queryAll(TAB_SELECTOR);
    }

    private getTabClickHandler(selectedTabIndex: number) {
        return () => {
            if (selectedTabIndex !== this.state.selectedTabIndex) {
                safeInvoke(this.props.onChange, selectedTabIndex, this.state.selectedTabIndex);
                this.setState({ selectedTabIndex });
            }
        };
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const focusedElement = document.activeElement.closest(TAB_SELECTOR);
        // rest of this is potentially expensive and futile, so bail if no tab is focused
        if (focusedElement == null) { return; }

        // must rely on DOM state because we have no way of mapping `focusedElement` to a JSX.Element
        const enabledTabElements = this.getTabElements()
            .filter((el) => el.getAttribute("aria-disabled") === "false");
        // .indexOf(undefined) => -1 which we handle later
        const focusedIndex = enabledTabElements.indexOf(focusedElement);

        if (focusedIndex >= 0 && isEventKeyCode(e, Keys.ARROW_LEFT, Keys.ARROW_RIGHT)) {
            // UP keycode is between LEFT and RIGHT so this produces 1 | -1
            const direction = e.which - Keys.ARROW_UP;
            const { length } = enabledTabElements;
            // auto-wrapping at 0 and `length`
            const nextFocusedIndex = (focusedIndex + direction + length) % length;
            (enabledTabElements[nextFocusedIndex] as HTMLElement).focus();
        }
    }

    private handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const targetTabElement = (e.target as HTMLElement).closest(TAB_SELECTOR) as HTMLElement;
        if (targetTabElement != null && isEventKeyCode(e, Keys.SPACE, Keys.ENTER)) {
            e.preventDefault();
            targetTabElement.click();
        }
    }

    private handleTabRef = (tabElement: HTMLDivElement) => { this.tabElement = tabElement; };
}

export const TabsFactory = React.createFactory(Tabs);

function isEventKeyCode(e: React.KeyboardEvent<HTMLElement>, ...codes: number[]) {
    return codes.indexOf(e.which) >= 0;
}

function isTab(child: React.ReactChild): child is TabElement {
    return (child as JSX.Element).type === Tab;
}
