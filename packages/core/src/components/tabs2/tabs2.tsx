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
import * as Keys from "../../common/keys";
import { IProps } from "../../common/props";
import * as Utils from "../../common/utils";

import { ITab2Props, Tab2, TabId } from "./tab2";
import { generateTabPanelId, generateTabTitleId, TabTitle } from "./tabTitle";

export const Expander: React.SFC<{}> = () => <div className="pt-flex-expander" />;

type TabElement = React.ReactElement<ITab2Props & { children: React.ReactNode }>;

const TAB_SELECTOR = `.${Classes.TAB}`;

export interface ITabs2Props extends IProps {
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
     * If set to `true`, the tabs will display with larger styling.
     * This is equivalent to setting `pt-large` on the `.pt-tab-list` element.
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

export interface ITabs2State {
    indicatorWrapperStyle?: React.CSSProperties;
    selectedTabId?: TabId;
}

@PureRender
export class Tabs2 extends AbstractComponent<ITabs2Props, ITabs2State> {
    /** Insert a `Tabs2.Expander` between any two children to right-align all subsequent children. */
    public static Expander = Expander;

    public static Tab = Tab2;

    public static defaultProps: Partial<ITabs2Props> = {
        animate: true,
        large: false,
        renderActiveTabPanelOnly: false,
        vertical: false,
    };

    public static displayName = "Blueprint.Tabs2";

    private tablistElement: HTMLDivElement;
    private refHandlers = {
        tablist: (tabElement: HTMLDivElement) => (this.tablistElement = tabElement),
    };

    constructor(props?: ITabs2Props) {
        super(props);
        const selectedTabId = this.getInitialSelectedTabId();
        this.state = { selectedTabId };
    }

    public render() {
        const { indicatorWrapperStyle, selectedTabId } = this.state;

        const tabTitles = React.Children.map(
            this.props.children,
            child => (isTab(child) ? this.renderTabTitle(child) : child),
        );

        const tabPanels = this.getTabChildren()
            .filter(this.props.renderActiveTabPanelOnly ? tab => tab.props.id === selectedTabId : () => true)
            .map(this.renderTabPanel);

        const tabIndicator = (
            <div className="pt-tab-indicator-wrapper" style={indicatorWrapperStyle}>
                <div className="pt-tab-indicator" />
            </div>
        );

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
                    {this.props.animate ? tabIndicator : undefined}
                    {tabTitles}
                </div>
                {tabPanels}
            </div>
        );
    }

    public componentDidMount() {
        this.moveSelectionIndicator();
    }

    public componentWillReceiveProps({ selectedTabId }: ITabs2Props) {
        if (selectedTabId !== undefined) {
            // keep state in sync with controlled prop, so state is canonical source of truth
            this.setState({ selectedTabId });
        }
    }

    public componentDidUpdate(prevProps: ITabs2Props, prevState: ITabs2State) {
        if (this.state.selectedTabId !== prevState.selectedTabId) {
            this.moveSelectionIndicator();
        } else if (prevState.selectedTabId != null) {
            if (!Utils.arraysEqual(React.Children.map(prevProps.children, thisArg => {return thisArg}), React.Children.map(this.props.children, thisArg => {return thisArg}), Utils.shallowCompareKeys)) {
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

    /** Filters this.props.children to only `<Tab>`s */
    private getTabChildren() {
        return React.Children.toArray(this.props.children).filter(isTab) as TabElement[];
    }

    /** Queries root HTML element for all `.pt-tab`s with optional filter selector */
    private getTabElements(subselector = "") {
        if (this.tablistElement == null) {
            return [] as Elements;
        }
        return this.tablistElement.queryAll(TAB_SELECTOR + subselector);
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
        if (this.tablistElement === undefined) {
            return;
        }

        const tabIdSelector = `${TAB_SELECTOR}[data-tab-id="${this.state.selectedTabId}"]`;
        const selectedTabElement = this.tablistElement.query(tabIdSelector) as HTMLElement;

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

export const Tabs2Factory = React.createFactory(Tabs2);

function isEventKeyCode(e: React.KeyboardEvent<HTMLElement>, ...codes: number[]) {
    return codes.indexOf(e.which) >= 0;
}

function isTab(child: React.ReactChild): child is TabElement {
    return child != null && (child as JSX.Element).type === Tab2;
}
