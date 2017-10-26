/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import { IMarkdownPluginData, isPageNode } from "documentalist/dist/client";
import * as React from "react";

import { FocusStyleManager, Hotkey, Hotkeys, HotkeysTarget, IProps, Utils } from "@blueprintjs/core";

import { eachLayoutNode } from "../common/utils";
import { TagRenderer } from "../tags";
import { Navigator } from "./navigator";
import { NavMenu } from "./navMenu";
import { Page } from "./page";

export interface IDocumentationProps extends IProps {
    /**
     * Default page to render in the absence of a hash route.
     */
    defaultPageId: string;

    /**
     * All the docs data from Documentalist.
     * Must include at least  `{ nav, pages }` from the MarkdownPlugin.
     */
    docs: IMarkdownPluginData;

    /**
     * Callback invoked whenever the component props or state change (specifically,
     * called in `componentDidMount` and `componentDidUpdate`).
     * Use it to run non-React code on the newly rendered sections.
     */
    onComponentUpdate?: (pageId: string) => void;

    /** Tag renderer functions. Unknown tags will log console errors. */
    tagRenderers: { [tag: string]: TagRenderer };

    /**
     * Elements to render on the left side of the navbar, typically logo and title.
     * All elements will be wrapped in a single `.pt-navbar-group`.
     * @default "Documentation"
     */
    navbarLeft?: React.ReactNode;

    /**
     * Element to render on the right side of the navbar, typically links and actions.
     * All elements will be wrapped in a single `.pt-navbar-group`.
     */
    navbarRight?: React.ReactNode;
}

export interface IDocumentationState {
    activePageId: string;
    activeSectionId: string;
}

@HotkeysTarget
export class Documentation extends React.PureComponent<IDocumentationProps, IDocumentationState> {
    public static defaultProps = {
        navbarLeft: "Documentation",
    };

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
            activePageId: props.defaultPageId,
            activeSectionId: props.defaultPageId,
        };

        // build up static map of all references to their page, for navigation / routing
        this.routeToPage = {};
        eachLayoutNode(this.props.docs.nav, (node, parents) => {
            const { reference } = isPageNode(node) ? node : parents[0];
            this.routeToPage[node.route] = reference;
        });
    }

    public render() {
        const { activePageId, activeSectionId } = this.state;
        const { nav, pages } = this.props.docs;
        const examplesOnly = location.search === "?examples";
        return (
            <div className={classNames("docs-root", { "docs-examples-only": examplesOnly }, this.props.className)}>
                <div className="docs-app">
                    <div className="pt-navbar docs-navbar docs-flex-row">
                        <div className="pt-navbar-group">{this.props.navbarLeft}</div>
                        <div className="pt-navbar-group">
                            <Navigator items={nav} onNavigate={this.handleNavigation} />
                        </div>
                        <div className="pt-navbar-group">{this.props.navbarRight}</div>
                    </div>
                    <div className="docs-nav" ref={this.refHandlers.nav}>
                        <NavMenu
                            items={nav}
                            activePageId={activePageId}
                            activeSectionId={activeSectionId}
                            onItemClick={this.handleNavigation}
                        />
                    </div>
                    <article className="docs-content" ref={this.refHandlers.content} role="main">
                        <Page page={pages[activePageId]} tagRenderers={this.props.tagRenderers} />
                    </article>
                </div>
            </div>
        );
    }

    public renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey global={true} combo="[" label="Previous section" onKeyDown={this.handlePreviousSection} />
                <Hotkey global={true} combo="]" label="Next section" onKeyDown={this.handleNextSection} />
            </Hotkeys>
        );
    }

    public componentWillMount() {
        this.updateHash();
    }

    public componentDidMount() {
        // hooray! so you don't have to!
        FocusStyleManager.onlyShowFocusOnTabs();
        this.scrollToActiveSection();
        this.maybeScrollToActivePageMenuItem();
        Utils.safeInvoke(this.props.onComponentUpdate, this.state.activePageId);
        // whoa handling future history...
        window.addEventListener("hashchange", () => {
            if (location.hostname.indexOf("blueprint") !== -1) {
                // captures a pageview for new location hashes that are dynamically rendered without a full page request
                (window as any).ga("send", "pageview", { page: location.pathname + location.search + location.hash });
            }
            // Don't call componentWillMount since the HotkeysTarget decorator will be invoked on every hashchange.
            this.updateHash();
        });
        document.addEventListener("scroll", this.handleScroll);
    }

    public componentWillUnmount() {
        window.removeEventListener("hashchange");
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
        this.handleNavigation(location.hash.slice(1));
    }

    private handleNavigation = (activeSectionId: string) => {
        // only update state if this section reference is valid
        const activePageId = this.routeToPage[activeSectionId];
        if (activeSectionId !== undefined && activePageId !== undefined) {
            this.setState({ activePageId, activeSectionId });
        }
    };

    private handleNextSection = () => this.shiftSection(1);
    private handlePreviousSection = () => this.shiftSection(-1);

    private handleScroll = () => {
        const activeSectionId = getScrolledReference(100, this.contentElement);
        if (activeSectionId == null) {
            return;
        }
        // use the longer (deeper) name to avoid jumping up between sections
        this.setState({ ...this.state, activeSectionId });
    };

    private maybeScrollToActivePageMenuItem() {
        const { activeSectionId } = this.state;
        // only scroll nav menu if active item is not visible in viewport.
        // using activeSectionId so you can see the page title in nav (may not be visible in document).
        const navMenuElement = this.navElement.query(`a[href="#${activeSectionId}"]`).closest(".docs-menu-item-page");
        const innerBounds = navMenuElement.getBoundingClientRect();
        const outerBounds = this.navElement.getBoundingClientRect();
        if (innerBounds.top < outerBounds.top || innerBounds.bottom > outerBounds.bottom) {
            navMenuElement.scrollIntoView();
        }
    }

    private scrollToActiveSection() {
        scrollToReference(this.state.activeSectionId, this.contentElement);
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
}

/** Shorthand for element.query() + cast to HTMLElement */
function queryHTMLElement(parent: Element, selector: string) {
    return parent.query(selector) as HTMLElement;
}

/**
 * Returns the reference of the closest section within `offset` pixels of the top of the viewport.
 */
function getScrolledReference(offset: number, container: HTMLElement, scrollParent = document.body) {
    const headings = container.queryAll(".docs-title");
    while (headings.length > 0) {
        // iterating in reverse order (popping from end / bottom of page)
        // so the first element below the threshold is the one we want.
        const element = headings.pop() as HTMLElement;
        if (element.offsetTop < scrollParent.scrollTop + offset) {
            // relying on DOM structure to get reference
            return element.query("[name]").getAttribute("name");
        }
    }
    return undefined;
}

/**
 * Scroll the scrollParent such that the reference heading appears at the top of the viewport.
 */
function scrollToReference(reference: string, container: HTMLElement, scrollParent = document.body) {
    const headingAnchor = queryHTMLElement(container, `a[name="${reference}"]`);
    if (headingAnchor == null || headingAnchor.parentElement == null) {
        return;
    }
    const scrollOffset = headingAnchor.parentElement!.offsetTop + headingAnchor.offsetTop;
    scrollParent.scrollTop = scrollOffset;
}
