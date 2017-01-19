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
import { safeInvoke } from "../../common/utils";

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
// vertical key bindings? up/dn

type TabElement = React.ReactElement<ITabProps & { children: React.ReactNode }>;

const TAB_SELECTOR = `.${Classes.TAB}`;

export interface ITabsProps extends IProps {
    /**
     * Whether the selected tab indicator should animate its movement.
     * @default true
     */
    animate?: boolean;

    /**
     * Initial selected tab index. Note that "tab index" refers only to `<Tab>` children;
     * other types of elements are ignored.
     * @default 0
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
    indicatorWrapperStyle?: React.CSSProperties;
    selectedTabIndex?: number;
}

@PureRender
export class Tabs extends AbstractComponent<ITabsProps, ITabsState> {
    public static defaultProps: ITabsProps = {
        animate: true,
        defaultSelectedTabIndex: 0,
        vertical: false,
    };

    public displayName = "Blueprint.Tabs2";

    private tabElement: HTMLDivElement;

    constructor(props?: ITabsProps, context?: any) {
        super(props, context);
        this.state = {
            selectedTabIndex: props.defaultSelectedTabIndex,
        };
    }

    public render() {
        const { indicatorWrapperStyle, selectedTabIndex } = this.state;

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
        const activeTabPanel = this.getTabChildren()[selectedTabIndex];

        const tabIndicator = (
            <div className="pt-tab-indicator-wrapper" style={indicatorWrapperStyle}>
                <div className="pt-tab-indicator" />
            </div>
        );

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
                    {this.props.animate ? tabIndicator : undefined}
                    {tabs}
                </div>
                {activeTabPanel}
            </div>
        );
    }

    public componentDidMount() {
        this.moveSelectionIndicator();
    }

    public componentDidUpdate(_: ITabsProps, prevState: ITabsState) {
        if (this.state.selectedTabIndex !== prevState.selectedTabIndex) {
            this.moveSelectionIndicator();
        }
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

    /**
     * Calculate the new height, width, and position of the tab indicator.
     * Store the CSS values so the transition animation can start.
     */
    private moveSelectionIndicator() {
        // need to measure on the next frame in case the Tab children simultaneously change
        const selectedTabElement = this.getTabElements()[this.state.selectedTabIndex] as HTMLElement;
        const { clientHeight, clientWidth, offsetLeft, offsetTop } = selectedTabElement;
        const indicatorWrapperStyle = {
            height: clientHeight,
            transform: `translateX(${Math.floor(offsetLeft)}px) translateY(${Math.floor(offsetTop)}px)`,
            width: clientWidth,
        };
        this.setState({ indicatorWrapperStyle });
    }
}

export const TabsFactory = React.createFactory(Tabs);

function isEventKeyCode(e: React.KeyboardEvent<HTMLElement>, ...codes: number[]) {
    return codes.indexOf(e.which) >= 0;
}

function isTab(child: React.ReactChild): child is TabElement {
    return (child as JSX.Element).type === Tab;
}
