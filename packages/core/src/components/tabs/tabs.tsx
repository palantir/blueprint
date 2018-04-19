/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IProps } from "../../common/props";
import * as Utils from "../../common/utils";

import { ITabProps, Tab, TabId } from "./tab";
import { generateTabPanelId, generateTabTitleId, TabTitle } from "./tabTitle";

export const Expander: React.SFC<{}> = () => <div className={Classes.FLEX_EXPANDER} />;

type TabElement = React.ReactElement<ITabProps & { children: React.ReactNode }>;

const TAB_SELECTOR = `.${Classes.TAB}`;

export interface ITabsProps extends IProps {
    /**
     * Whether the selected tab indicator should animate its movement.
     * @default true
     */
    animate?: boolean;

    /**
     * Initial selected tab `id`, for uncontrolled usage.
     * Note that this prop refers only to `<Tab>` children; other types of elements are ignored.
     * @default first tab
     */
    defaultSelectedTabId?: TabId;

    /**
     * Unique identifier for this `Tabs` container. This will be combined with the `id` of each
     * `Tab` child to generate ARIA accessibility attributes. IDs are required and should be
     * unique on the page to support server-side rendering.
     */
    id: TabId;

    /**
     * If set to `true`, the tab titles will display with larger styling.
     * This will apply large styles only to the tabs at this level, not to nested tabs.
     * @default false
     */
    large?: boolean;

    /**
     * Whether inactive tab panels should be removed from the DOM and unmounted in React.
     * This can be a performance enhancement when rendering many complex panels, but requires
     * careful support for unmounting and remounting.
     * @default false
     */
    renderActiveTabPanelOnly?: boolean;

    /**
     * Selected tab `id`, for controlled usage.
     * Providing this prop will put the component in controlled mode.
     * Unknown ids will result in empty selection (no errors).
     */
    selectedTabId?: TabId;

    /**
     * Whether to show tabs stacked vertically on the left side.
     * @default false
     */
    vertical?: boolean;

    /**
     * A callback function that is invoked when a tab in the tab list is clicked.
     */
    onChange?(newTabId: TabId, prevTabId: TabId, event: React.MouseEvent<HTMLElement>): void;
}

export interface ITabsState {
    indicatorWrapperStyle?: React.CSSProperties;
    selectedTabId?: TabId;
}

export class Tabs extends AbstractPureComponent<ITabsProps, ITabsState> {
    /** Insert a `Tabs.Expander` between any two children to right-align all subsequent children. */
    public static Expander = Expander;

    public static Tab = Tab;

    public static defaultProps: Partial<ITabsProps> = {
        animate: true,
        large: false,
        renderActiveTabPanelOnly: false,
        vertical: false,
    };

    public static displayName = "Blueprint2.Tabs";

    private tablistElement: HTMLDivElement;
    private refHandlers = {
        tablist: (tabElement: HTMLDivElement) => (this.tablistElement = tabElement),
    };

    constructor(props?: ITabsProps) {
        super(props);
        const selectedTabId = this.getInitialSelectedTabId();
        this.state = { selectedTabId };
    }

    public render() {
        const { indicatorWrapperStyle, selectedTabId } = this.state;

        const tabTitles = React.Children.map(
            this.props.children,
            child => (Utils.isElementOfType(child, Tab) ? this.renderTabTitle(child as TabElement) : child),
        );

        const tabPanels = this.getTabChildren()
            .filter(this.props.renderActiveTabPanelOnly ? tab => tab.props.id === selectedTabId : () => true)
            .map(this.renderTabPanel);

        const tabIndicator = this.props.animate ? (
            <div className={Classes.TAB_INDICATOR_WRAPPER} style={indicatorWrapperStyle}>
                <div className={Classes.TAB_INDICATOR} />
            </div>
        ) : null;

        const classes = classNames(Classes.TABS, { [Classes.VERTICAL]: this.props.vertical }, this.props.className);
        const tabListClasses = classNames(Classes.TAB_LIST, {
            [Classes.LARGE]: this.props.large,
        });

        return (
            <div className={classes}>
                <div
                    className={tabListClasses}
                    onKeyDown={this.handleKeyDown}
                    onKeyPress={this.handleKeyPress}
                    ref={this.refHandlers.tablist}
                    role="tablist"
                >
                    {tabIndicator}
                    {tabTitles}
                </div>
                {tabPanels}
            </div>
        );
    }

    public componentDidMount() {
        this.moveSelectionIndicator();
    }

    public componentWillReceiveProps({ selectedTabId }: ITabsProps) {
        if (selectedTabId !== undefined) {
            // keep state in sync with controlled prop, so state is canonical source of truth
            this.setState({ selectedTabId });
        }
    }

    public componentDidUpdate(prevProps: ITabsProps, prevState: ITabsState) {
        if (this.state.selectedTabId !== prevState.selectedTabId) {
            this.moveSelectionIndicator();
        } else if (prevState.selectedTabId != null) {
            // comparing React nodes is difficult to do with simple logic, so
            // shallowly compare just their props as a workaround.
            const didChildrenChange = !Utils.arraysEqual(
                this.getTabChildrenProps(prevProps),
                this.getTabChildrenProps(),
                Utils.shallowCompareKeys,
            );
            if (didChildrenChange) {
                this.moveSelectionIndicator();
            }
        }
    }

    private getInitialSelectedTabId() {
        // NOTE: providing an unknown ID will hide the selection
        const { defaultSelectedTabId, selectedTabId } = this.props;
        if (selectedTabId !== undefined) {
            return selectedTabId;
        } else if (defaultSelectedTabId !== undefined) {
            return defaultSelectedTabId;
        } else {
            // select first tab in absence of user input
            const tabs = this.getTabChildren();
            return tabs.length === 0 ? undefined : tabs[0].props.id;
        }
    }

    private getKeyCodeDirection(e: React.KeyboardEvent<HTMLElement>) {
        if (isEventKeyCode(e, Keys.ARROW_LEFT, Keys.ARROW_UP)) {
            return -1;
        } else if (isEventKeyCode(e, Keys.ARROW_RIGHT, Keys.ARROW_DOWN)) {
            return 1;
        }
        return undefined;
    }

    private getTabChildrenProps(props: ITabsProps & { children?: React.ReactNode } = this.props) {
        return this.getTabChildren(props).map(child => child.props);
    }

    /** Filters children to only `<Tab>`s */
    private getTabChildren(props: ITabsProps & { children?: React.ReactNode } = this.props) {
        return React.Children.toArray(props.children).filter(child => {
            return Utils.isElementOfType(child, Tab);
        }) as TabElement[];
    }

    /** Queries root HTML element for all tabs with optional filter selector */
    private getTabElements(subselector = "") {
        if (this.tablistElement == null) {
            return [];
        }
        return Array.from(this.tablistElement.querySelectorAll(TAB_SELECTOR + subselector));
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const focusedElement = document.activeElement.closest(TAB_SELECTOR);
        // rest of this is potentially expensive and futile, so bail if no tab is focused
        if (focusedElement == null) {
            return;
        }

        // must rely on DOM state because we have no way of mapping `focusedElement` to a JSX.Element
        const enabledTabElements = this.getTabElements().filter(el => el.getAttribute("aria-disabled") === "false");
        const focusedIndex = enabledTabElements.indexOf(focusedElement);
        const direction = this.getKeyCodeDirection(e);

        if (focusedIndex >= 0 && direction !== undefined) {
            e.preventDefault();
            const { length } = enabledTabElements;
            // auto-wrapping at 0 and `length`
            const nextFocusedIndex = (focusedIndex + direction + length) % length;
            (enabledTabElements[nextFocusedIndex] as HTMLElement).focus();
        }
    };

    private handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const targetTabElement = (e.target as HTMLElement).closest(TAB_SELECTOR) as HTMLElement;
        if (targetTabElement != null && isEventKeyCode(e, Keys.SPACE, Keys.ENTER)) {
            e.preventDefault();
            targetTabElement.click();
        }
    };

    private handleTabClick = (newTabId: TabId, event: React.MouseEvent<HTMLElement>) => {
        Utils.safeInvoke(this.props.onChange, newTabId, this.state.selectedTabId, event);
        if (this.props.selectedTabId === undefined) {
            this.setState({ selectedTabId: newTabId });
        }
    };

    /**
     * Calculate the new height, width, and position of the tab indicator.
     * Store the CSS values so the transition animation can start.
     */
    private moveSelectionIndicator() {
        if (this.tablistElement === undefined || !this.props.animate) {
            return;
        }

        const tabIdSelector = `${TAB_SELECTOR}[data-tab-id="${this.state.selectedTabId}"]`;
        const selectedTabElement = this.tablistElement.querySelector(tabIdSelector) as HTMLElement;

        let indicatorWrapperStyle: React.CSSProperties = { display: "none" };
        if (selectedTabElement != null) {
            const { clientHeight, clientWidth, offsetLeft, offsetTop } = selectedTabElement;
            indicatorWrapperStyle = {
                height: clientHeight,
                transform: `translateX(${Math.floor(offsetLeft)}px) translateY(${Math.floor(offsetTop)}px)`,
                width: clientWidth,
            };
        }
        this.setState({ indicatorWrapperStyle });
    }

    private renderTabPanel = (tab: TabElement) => {
        const { className, panel, id } = tab.props;
        if (panel === undefined) {
            return undefined;
        }
        return (
            <div
                aria-labelledby={generateTabTitleId(this.props.id, id)}
                aria-hidden={id !== this.state.selectedTabId}
                className={classNames(Classes.TAB_PANEL, className)}
                id={generateTabPanelId(this.props.id, id)}
                key={id}
                role="tabpanel"
            >
                {panel}
            </div>
        );
    };

    private renderTabTitle = (tab: TabElement) => {
        const { id } = tab.props;
        return (
            <TabTitle
                {...tab.props}
                parentId={this.props.id}
                onClick={this.handleTabClick}
                selected={id === this.state.selectedTabId}
            />
        );
    };
}

function isEventKeyCode(e: React.KeyboardEvent<HTMLElement>, ...codes: number[]) {
    return codes.indexOf(e.which) >= 0;
}
