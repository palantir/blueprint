/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import { PageProps } from "docz";
import * as React from "react";

import { Classes, FocusStyleManager, Hotkey, Hotkeys, HotkeysTarget, IProps, Overlay } from "@blueprintjs/core";

import { IThemeConfig, withConfig } from "../../config";
import { Interface } from "../tags";
import { Navigator } from "./navigator";
import { addScrollbarStyle } from "./scrollbar";
import { Sidebar } from "./sidebar/sidebar";

export interface IDocumentationProps extends PageProps, IProps {
    title: string;

    /**
     * HTML element to use as the scroll parent. By default `document.documentElement` is assumed to be the scroll container.
     * @default document.documentElement
     */
    scrollParent?: HTMLElement;

    /** Tag renderer functions. Unknown tags will log console errors. */
    tagRenderers: any;
}

export interface IDocumentationState {
    activeApiMember: string;
    activeSectionId: string;
    isApiBrowserOpen: boolean;
    isNavigatorOpen: boolean;
}

@HotkeysTarget
class DocumentationCmp extends React.Component<IDocumentationProps & IThemeConfig, IDocumentationState> {
    public static displayName = "Docs.Documentation";

    public state: IDocumentationState = {
        activeApiMember: "",
        activeSectionId: "",
        isApiBrowserOpen: false,
        isNavigatorOpen: false,
    };

    private contentElement: HTMLElement;
    // private navElement: HTMLElement;

    public render() {
        const { renderPageActions } = this.props;
        const { activeApiMember, isApiBrowserOpen } = this.state;
        const rootClasses = classNames(
            "docs-root",
            { "docs-examples-only": location.search === "?examples" },
            this.props.className,
        );
        const apiClasses = classNames("docs-api-overlay", this.props.className);
        const mainClasses = classNames("docs-content-wrapper", Classes.FILL, Classes.RUNNING_TEXT, Classes.TEXT_LARGE);
        return (
            <div className={rootClasses}>
                <div className="docs-app">
                    {this.props.banner}
                    <Sidebar currentPage={this.props.doc} onSearchClick={this.handleOpenNavigator} />
                    <main
                        className={mainClasses}
                        ref={ref => (this.contentElement = ref)}
                        role="main"
                        data-page-id={this.props.doc.route}
                    >
                        <div className="docs-page">
                            {renderPageActions && (
                                <div className="docs-page-actions">{renderPageActions(this.props.doc)}</div>
                            )}
                            {this.props.children}
                        </div>
                    </main>
                </div>

                <Overlay className={apiClasses} isOpen={isApiBrowserOpen} onClose={this.handleApiBrowserClose}>
                    <Interface name={activeApiMember} />
                </Overlay>

                <Navigator isOpen={this.state.isNavigatorOpen} onClose={this.handleCloseNavigator} />
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
            </Hotkeys>
        );
    }

    public componentWillMount() {
        addScrollbarStyle();
    }

    public componentDidMount() {
        // hooray! so you don't have to!
        FocusStyleManager.onlyShowFocusOnTabs();
        this.scrollToActiveSection();
        // whoa handling future history...
        document.addEventListener("scroll", this.handleScroll);
        requestAnimationFrame(() => this.maybeScrollToActivePageMenuItem());
    }

    public componentWillUnmount() {
        document.removeEventListener("scroll", this.handleScroll);
    }

    private handleCloseNavigator = () => this.setState({ isNavigatorOpen: false });
    private handleOpenNavigator = () => this.setState({ isNavigatorOpen: true });

    private handleScroll = () => {
        const activeSectionId = getScrolledReference(100, this.props.scrollParent);
        if (activeSectionId == null) {
            return;
        }
        // use the longer (deeper) name to avoid jumping up between sections
        // this.setState({ activeSectionId });
    };

    private maybeScrollToActivePageMenuItem() {
        return;
        // const { activeSectionId } = this.state;
        // // only scroll nav menu if active item is not visible in viewport.
        // // using activeSectionId so you can see the page title in nav (may not be visible in document).
        // const navItemElement = this.navElement.querySelector(`a[href="#${activeSectionId}"]`) as HTMLElement;
        // const scrollOffset = navItemElement.offsetTop - this.navElement.scrollTop;
        // if (scrollOffset < 0 || scrollOffset > this.navElement.offsetHeight) {
        //     // reveal two items above this item in list
        //     this.navElement.scrollTop = navItemElement.offsetTop - navItemElement.offsetHeight * 2;
        // }
    }

    private scrollToActiveSection() {
        if (this.contentElement != null) {
            scrollToReference(this.state.activeSectionId, this.props.scrollParent);
        }
    }

    // private handleApiBrowserOpen = (activeApiMember: string) =>
    //     this.setState({ activeApiMember, isApiBrowserOpen: true });
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
            return element.querySelector(".docs-anchor").getAttribute("id");
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

export const Documentation = withConfig(DocumentationCmp);
