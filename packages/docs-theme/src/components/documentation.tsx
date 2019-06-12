/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { IHeadingNode, IPageData, IPageNode, isPageNode, ITsDocBase, linkify } from "@documentalist/client";
import classNames from "classnames";
import * as React from "react";

import { Classes, Drawer, FocusStyleManager, Hotkey, Hotkeys, HotkeysTarget, IProps, Utils } from "@blueprintjs/core";

import { DocumentationContextTypes, hasTypescriptData, IDocsData, IDocumentationContext } from "../common/context";
import { eachLayoutNode } from "../common/utils";
import { ITagRendererMap, TypescriptExample } from "../tags";
import { renderBlock } from "./block";
import { NavButton } from "./navButton";
import { Navigator } from "./navigator";
import { NavMenu } from "./navMenu";
import { INavMenuItemProps } from "./navMenuItem";
import { Page } from "./page";
import { addScrollbarStyle } from "./scrollbar";
import { ApiLink } from "./typescript/apiLink";

export interface IDocumentationProps extends IProps {
    /**
     * An element to place above the documentation, along the top of the viewport.
     * For best results, use a `Banner` from this package.
     */
    banner?: JSX.Element;

    /**
     * Default page to render in the absence of a hash route.
     */
    defaultPageId: string;

    /**
     * All the docs data from Documentalist.
     * This theme requires the Markdown plugin, and optionally supports Typescript and KSS data.
     */
    docs: IDocsData;

    /**
     * Elements to render on the bottom of the sidebar, below the nav menu.
     * This typically contains copyright information.
     */
    footer?: React.ReactNode;

    /**
     * Elements to render on the top of the sidebar, above the search box.
     * This typically contains logo, title and navigation links.
     * Use `.docs-nav-title` on an element for proper padding relative to other sidebar elements.
     */
    header: React.ReactNode;

    /**
     * Callback invoked to determine if given nav node should *not* be
     * searchable in the navigator. Returning `true` will exclude the item from
     * the navigator search results.
     */
    navigatorExclude?: (node: IPageNode | IHeadingNode) => boolean;

    /**
     * Callback invoked whenever the component props or state change (specifically,
     * called in `componentDidMount` and `componentDidUpdate`).
     * Use it to run non-React code on the newly rendered sections.
     */
    onComponentUpdate?: (pageId: string) => void;

    /**
     * Callback invoked to render "View source" links in Typescript interfaces.
     * The `href` of the link will be `entry.sourceUrl`.
     * @default "View source"
     */
    renderViewSourceLinkText?: (entry: ITsDocBase) => React.ReactNode;

    /**
     * Callback invoked to render the clickable nav menu items. (Nested menu structure is handled by the library.)
     * The default implementation renders a `NavMenuItem` element, which is exported from this package.
     */
    renderNavMenuItem?: (props: INavMenuItemProps) => JSX.Element;

    /**
     * Callback invoked to render actions for a documentation page.
     * Actions appear in an element in the upper-right corner of the page.
     */
    renderPageActions?: (page: IPageData) => React.ReactNode;

    /**
     * HTML element to use as the scroll parent. By default `document.documentElement` is assumed to be the scroll container.
     * @default document.documentElement
     */
    scrollParent?: HTMLElement;

    /** Tag renderer functions. Unknown tags will log console errors. */
    tagRenderers: ITagRendererMap;
}

export interface IDocumentationState {
    activeApiMember: string;
    activePageId: string;
    activeSectionId: string;
    isApiBrowserOpen: boolean;
    isNavigatorOpen: boolean;
}

@HotkeysTarget
export class Documentation extends React.PureComponent<IDocumentationProps, IDocumentationState> {
    public static childContextTypes = DocumentationContextTypes;

    /** Map of section route to containing page reference. */
    private routeToPage: { [route: string]: string };

    private contentElement: HTMLElement;
    private navElement: HTMLElement;
    private refHandlers = {
        content: (ref: HTMLElement) => (this.contentElement = ref),
        nav: (ref: HTMLElement) => (this.navElement = ref),
    };

    public constructor(props: IDocumentationProps) {
        super(props);
        this.state = {
            activeApiMember: "",
            activePageId: props.defaultPageId,
            activeSectionId: props.defaultPageId,
            isApiBrowserOpen: false,
            isNavigatorOpen: false,
        };

        // build up static map of all references to their page, for navigation / routing
        this.routeToPage = {};
        eachLayoutNode(this.props.docs.nav, (node, parents) => {
            const { reference } = isPageNode(node) ? node : parents[0];
            this.routeToPage[node.route] = reference;
        });
    }

    public getChildContext(): IDocumentationContext {
        const { docs, renderViewSourceLinkText } = this.props;
        return {
            getDocsData: () => docs,
            renderBlock: block => renderBlock(block, this.props.tagRenderers),
            renderType: hasTypescriptData(docs)
                ? type =>
                      linkify(type, docs.typescript, (name, _d, idx) => <ApiLink key={`${name}-${idx}`} name={name} />)
                : type => type,
            renderViewSourceLinkText: Utils.isFunction(renderViewSourceLinkText)
                ? renderViewSourceLinkText
                : () => "View source",
            showApiDocs: this.handleApiBrowserOpen,
        };
    }

    public render() {
        const { activeApiMember, activePageId, activeSectionId, isApiBrowserOpen } = this.state;
        const { nav, pages } = this.props.docs;
        const rootClasses = classNames(
            "docs-root",
            { "docs-examples-only": location.search === "?examples" },
            this.props.className,
        );
        const apiClasses = classNames("docs-api-drawer", this.props.className);
        return (
            <div className={rootClasses}>
                {this.props.banner}
                <div className="docs-app">
                    <div className="docs-nav-wrapper">
                        <div className="docs-nav" ref={this.refHandlers.nav}>
                            {this.props.header}
                            <div className="docs-nav-divider" />
                            <NavButton
                                icon="search"
                                hotkey="shift + s"
                                text="Search..."
                                onClick={this.handleOpenNavigator}
                            />
                            <div className="docs-nav-divider" />
                            <NavMenu
                                activePageId={activePageId}
                                activeSectionId={activeSectionId}
                                items={nav}
                                level={0}
                                onItemClick={this.handleNavigation}
                                renderNavMenuItem={this.props.renderNavMenuItem}
                            />
                            {this.props.footer}
                        </div>
                    </div>
                    <main
                        className={classNames("docs-content-wrapper", Classes.FILL)}
                        ref={this.refHandlers.content}
                        role="main"
                    >
                        <Page
                            page={pages[activePageId]}
                            renderActions={this.props.renderPageActions}
                            tagRenderers={this.props.tagRenderers}
                        />
                    </main>
                </div>
                <Drawer className={apiClasses} isOpen={isApiBrowserOpen} onClose={this.handleApiBrowserClose}>
                    <TypescriptExample tag="typescript" value={activeApiMember} />
                </Drawer>
                <Navigator
                    isOpen={this.state.isNavigatorOpen}
                    items={nav}
                    itemExclude={this.props.navigatorExclude}
                    onClose={this.handleCloseNavigator}
                />
            </div>
        );
    }

    public renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey
                    global={true}
                    combo="shift+s"
                    label="Open navigator"
                    onKeyDown={this.handleOpenNavigator}
                    preventDefault={true}
                />
                <Hotkey global={true} combo="[" label="Previous section" onKeyDown={this.handlePreviousSection} />
                <Hotkey global={true} combo="]" label="Next section" onKeyDown={this.handleNextSection} />
            </Hotkeys>
        );
    }

    public componentWillMount() {
        addScrollbarStyle();
        this.updateHash();
    }

    public componentDidMount() {
        // hooray! so you don't have to!
        FocusStyleManager.onlyShowFocusOnTabs();
        this.scrollToActiveSection();
        Utils.safeInvoke(this.props.onComponentUpdate, this.state.activePageId);
        // whoa handling future history...
        window.addEventListener("hashchange", this.handleHashChange);
        document.addEventListener("scroll", this.handleScroll);
        requestAnimationFrame(() => this.maybeScrollToActivePageMenuItem());
    }

    public componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleHashChange);
        document.removeEventListener("scroll", this.handleScroll);
    }

    public componentDidUpdate(_prevProps: IDocumentationProps, prevState: IDocumentationState) {
        const { activePageId } = this.state;

        // only scroll to heading when switching pages, but always check if nav item needs scrolling.
        if (prevState.activePageId !== activePageId) {
            this.scrollToActiveSection();
            this.maybeScrollToActivePageMenuItem();
        }

        Utils.safeInvoke(this.props.onComponentUpdate, activePageId);
    }

    private updateHash() {
        // update state based on current hash location
        const sectionId = location.hash.slice(1);
        this.handleNavigation(sectionId === "" ? this.props.defaultPageId : sectionId);
    }

    private handleHashChange = () => {
        if (location.hostname.indexOf("blueprint") !== -1) {
            // captures a pageview for new location hashes that are dynamically rendered without a full page request
            (window as any).ga("send", "pageview", { page: location.pathname + location.search + location.hash });
        }
        // Don't call componentWillMount since the HotkeysTarget decorator will be invoked on every hashchange.
        this.updateHash();
    };

    private handleCloseNavigator = () => this.setState({ isNavigatorOpen: false });
    private handleOpenNavigator = () => this.setState({ isNavigatorOpen: true });

    private handleNavigation = (activeSectionId: string) => {
        // only update state if this section reference is valid
        const activePageId = this.routeToPage[activeSectionId];
        if (activeSectionId !== undefined && activePageId !== undefined) {
            this.setState({ activePageId, activeSectionId, isNavigatorOpen: false });
            this.scrollToActiveSection();
        }
    };

    private handleNextSection = () => this.shiftSection(1);
    private handlePreviousSection = () => this.shiftSection(-1);

    private handleScroll = () => {
        const activeSectionId = getScrolledReference(100, this.props.scrollParent);
        if (activeSectionId == null) {
            return;
        }
        // use the longer (deeper) name to avoid jumping up between sections
        this.setState({ activeSectionId });
    };

    private maybeScrollToActivePageMenuItem() {
        const { activeSectionId } = this.state;
        // only scroll nav menu if active item is not visible in viewport.
        // using activeSectionId so you can see the page title in nav (may not be visible in document).
        const navItemElement = this.navElement.querySelector(`a[href="#${activeSectionId}"]`) as HTMLElement;
        const scrollOffset = navItemElement.offsetTop - this.navElement.scrollTop;
        if (scrollOffset < 0 || scrollOffset > this.navElement.offsetHeight) {
            // reveal two items above this item in list
            this.navElement.scrollTop = navItemElement.offsetTop - navItemElement.offsetHeight * 2;
        }
    }

    private scrollToActiveSection() {
        if (this.contentElement != null) {
            scrollToReference(this.state.activeSectionId, this.props.scrollParent);
        }
    }

    private shiftSection(direction: 1 | -1) {
        // use the current hash instead of `this.state.activeSectionId` to avoid cases where the
        // active section cannot actually be selected in the nav (often a short one at the end).
        const currentSectionId = location.hash.slice(1);
        // this map is built by an in-order traversal so the keys are actually sorted correctly!
        const sections = Object.keys(this.routeToPage);
        const index = sections.indexOf(currentSectionId);
        const newIndex = index === -1 ? 0 : (index + direction + sections.length) % sections.length;
        // updating hash triggers event listener which sets new state.
        location.hash = sections[newIndex];
    }

    private handleApiBrowserOpen = (activeApiMember: string) =>
        this.setState({ activeApiMember, isApiBrowserOpen: true });
    private handleApiBrowserClose = () => this.setState({ isApiBrowserOpen: false });
}

/** Shorthand for element.querySelector() + cast to HTMLElement */
function queryHTMLElement(parent: Element, selector: string) {
    return parent.querySelector(selector) as HTMLElement;
}

/**
 * Returns the reference of the closest section within `offset` pixels of the top of the viewport.
 */
function getScrolledReference(offset: number, scrollContainer: HTMLElement = document.documentElement) {
    const headings = Array.from(scrollContainer.querySelectorAll(".docs-title"));
    while (headings.length > 0) {
        // iterating in reverse order (popping from end / bottom of page)
        // so the first element below the threshold is the one we want.
        const element = headings.pop() as HTMLElement;
        if (element.offsetTop < scrollContainer.scrollTop + offset) {
            // relying on DOM structure to get reference
            return element.querySelector("[data-route]").getAttribute("data-route");
        }
    }
    return undefined;
}

/**
 * Scroll the scroll container such that the reference heading appears at the top of the viewport.
 */
function scrollToReference(reference: string, scrollContainer: HTMLElement = document.documentElement) {
    // without rAF, on initial load this would scroll to the bottom because the CSS had not been applied.
    // with rAF, CSS is applied before updating scroll positions so all elements are in their correct places.
    requestAnimationFrame(() => {
        const headingAnchor = queryHTMLElement(scrollContainer, `a[data-route="${reference}"]`);
        if (headingAnchor != null && headingAnchor.parentElement != null) {
            const scrollOffset = headingAnchor.parentElement!.offsetTop + headingAnchor.offsetTop;
            scrollContainer.scrollTop = scrollOffset;
        }
    });
}
