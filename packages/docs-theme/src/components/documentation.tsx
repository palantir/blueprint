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

import {
    type HeadingNode,
    isPageNode,
    linkify,
    type PageData,
    type PageNode,
    type TsDocBase,
} from "@documentalist/client";
import classNames from "classnames";
import { PureComponent } from "react";

import { Classes, Drawer, FocusStyleManager, HotkeysTarget, type Props } from "@blueprintjs/core";

import {
    type DocsData,
    DocumentationContext,
    type DocumentationContextApi,
    hasTypescriptData,
} from "../common/context";
import { eachLayoutNode } from "../common/documentalistUtils";
import { type TagRendererMap, TypescriptExample } from "../tags";

import { renderBlock } from "./block";
import { Header, HeaderCenter, HeaderLeft, HeaderRight } from "./header";
import { HeaderGitHubLink, HeaderSearch, HeaderThemeToggle } from "./headerActions";
import { Navigator } from "./navigator";
import { NavMenu } from "./navMenu";
import type { NavMenuItemProps } from "./navMenuItem";
import { Page } from "./page";
import { addScrollbarStyle } from "./scrollbar";
import { HEADING_IN_VIEW_THRESHOLD, HeadingRegistryProvider } from "./toc/headingRegistry";
import { TOCContainer, TOCContent, TOCItems } from "./toc/TOC";
import { ApiLink } from "./typescript/apiLink";

export interface DocumentationProps extends Props {
    /**
     * An element to place above the documentation, along the top of the viewport.
     * For best results, use a `Banner` from this package.
     */
    banner?: React.JSX.Element;

    /**
     * Default page to render in the absence of a hash route.
     */
    defaultPageId: string;

    /**
     * All the docs data from Documentalist.
     * This theme requires the Markdown plugin, and optionally supports Typescript and KSS data.
     */
    docs: DocsData;

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
    navigatorExclude?: (node: PageNode | HeadingNode) => boolean;

    /**
     * Callback invoked whenever the component props or state change (specifically,
     * called in `componentDidMount` and `componentDidUpdate`).
     * Use it to run non-React code on the newly rendered sections.
     */
    onComponentUpdate?: (pageId: string) => void;

    /**
     * Callback invoked when the theme toggle button is clicked.
     */
    onThemeToggle?: (useDark: boolean) => void;

    /**
     * Callback invoked to render "View source" links in Typescript interfaces.
     * The `href` of the link will be `entry.sourceUrl`.
     *
     * @default "View source"
     */
    renderViewSourceLinkText?: (entry: TsDocBase) => React.ReactNode;

    /**
     * Callback invoked to render the clickable nav menu items. (Nested menu structure is handled by the library.)
     * The default implementation renders a `NavMenuItem` element, which is exported from this package.
     */
    renderNavMenuItem?: (props: NavMenuItemProps) => React.JSX.Element;

    /**
     * Callback invoked to render actions for a documentation page.
     * Actions appear in an element in the upper-right corner of the page.
     */
    renderPageActions?: (page: PageData) => React.ReactNode;

    /**
     * HTML element to use as the scroll parent. By default `document.documentElement` is assumed to be the scroll container.
     *
     * @default document.documentElement
     */
    scrollParent?: HTMLElement;

    /** Tag renderer functions. Unknown tags will log console errors. */
    tagRenderers: TagRendererMap;
}

export interface DocumentationState {
    activeApiMember: string;
    activePageId: string;
    activeSectionId: string;
    isApiBrowserOpen: boolean;
    isNavigatorOpen: boolean;
}

export class Documentation extends PureComponent<DocumentationProps, DocumentationState> {
    /** Map of section route to containing page reference. */
    private routeToPage: { [route: string]: string };

    public constructor(props: DocumentationProps) {
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
            if (isPageNode(node)) {
                if (this.props.navigatorExclude?.(node)) {
                    // if node is excluded from navigation, don't store it in the route to page map
                    // to ensure the user cannnot navigate to it with hotkeys or through the URL
                    return;
                }
                this.routeToPage[node.route] = node.reference;
            } else if (parents[0] != null) {
                this.routeToPage[node.route] = parents[0].reference;
            }
        });
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
        const isDarkTheme = rootClasses.includes(Classes.DARK);

        return (
            <DocumentationContext.Provider value={this.getDocumentationContextApi()}>
                <HeadingRegistryProvider>
                    <HotkeysTarget
                        hotkeys={[
                            {
                                combo: "shift+s",
                                global: true,
                                group: "Navigation (global)",
                                label: "Open navigator",
                                onKeyDown: this.handleOpenNavigator,
                                preventDefault: true,
                            },
                            {
                                combo: "[",
                                global: true,
                                group: "Navigation (global)",
                                label: "Previous section",
                                onKeyDown: this.handlePreviousSection,
                            },
                            {
                                combo: "]",
                                global: true,
                                group: "Navigation (global)",
                                label: "Next section",
                                onKeyDown: this.handleNextSection,
                            },
                        ]}
                    >
                        <div className={rootClasses}>
                            {this.props.banner}
                            <div className="docs-app">
                                <Header>
                                    <HeaderLeft>{this.props.header}</HeaderLeft>
                                    <HeaderCenter>
                                        <HeaderSearch onClick={this.handleOpenNavigator} />
                                    </HeaderCenter>
                                    <HeaderRight>
                                        <HeaderThemeToggle
                                            isDarkThemeEnabled={isDarkTheme}
                                            onToggle={this.props.onThemeToggle}
                                        />
                                        <HeaderGitHubLink />
                                    </HeaderRight>
                                </Header>
                                <div className="docs-nav-wrapper" role="navigation">
                                    <div className="docs-nav">
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
                                <main className="docs-content-wrapper" role="main">
                                    <div className="docs-content-with-toc">
                                        <Page
                                            page={pages[activePageId]!}
                                            renderActions={this.props.renderPageActions}
                                            tagRenderers={this.props.tagRenderers}
                                            className={classNames({ banner: !!this.props.banner })}
                                        />
                                        <TOCContainer
                                            className={classNames({ banner: !!this.props.banner })}
                                            isDarkThemeEnabled={isDarkTheme}
                                        >
                                            <TOCContent>
                                                <TOCItems key={activePageId} />
                                            </TOCContent>
                                        </TOCContainer>
                                    </div>
                                </main>
                                <Drawer
                                    className={apiClasses}
                                    isOpen={isApiBrowserOpen}
                                    onClose={this.handleApiBrowserClose}
                                >
                                    <TypescriptExample tag="typescript" value={activeApiMember} />
                                </Drawer>
                                <Navigator
                                    isOpen={this.state.isNavigatorOpen}
                                    items={nav}
                                    itemExclude={this.props.navigatorExclude}
                                    onClose={this.handleCloseNavigator}
                                    useDarkTheme={isDarkTheme}
                                />
                            </div>
                        </div>
                    </HotkeysTarget>
                </HeadingRegistryProvider>
            </DocumentationContext.Provider>
        );
    }

    public componentDidMount() {
        addScrollbarStyle();
        this.updateHash();
        FocusStyleManager.onlyShowFocusOnTabs();
        this.props.onComponentUpdate?.(this.state.activePageId);

        // Apply dark theme class to HTML element if needed
        this.updateHtmlThemeClass();

        // whoa handling future history...
        window.addEventListener("hashchange", this.handleHashChange);
    }

    private updateHtmlThemeClass() {
        // Check if dark theme is applied to the root element
        const isDarkTheme = document.body.classList.contains(Classes.DARK);

        // Apply or remove the dark theme class from the HTML element
        if (isDarkTheme) {
            document.documentElement.classList.add(Classes.DARK);
        } else {
            document.documentElement.classList.remove(Classes.DARK);
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleHashChange);
    }

    public componentDidUpdate(_prevProps: DocumentationProps) {
        const { activePageId } = this.state;
        // Update HTML theme class in case it changed
        this.updateHtmlThemeClass();
        this.props.onComponentUpdate?.(activePageId);
    }

    private getDocumentationContextApi(): DocumentationContextApi {
        const { docs, renderViewSourceLinkText } = this.props;
        return {
            getDocsData: () => docs,
            renderBlock: block => renderBlock(block, this.props.tagRenderers),
            renderType: hasTypescriptData(docs)
                ? omitEmptyTypeParamsList(type =>
                      linkify(type, docs.typescript, (name, _d, idx) => <ApiLink key={`${name}-${idx}`} name={name} />),
                  )
                : omitEmptyTypeParamsList(type => type),
            renderViewSourceLinkText: renderViewSourceLinkText ?? (() => "View source"),
            showApiDocs: this.handleApiBrowserOpen,
        };
    }

    private updateHash() {
        // update state based on current hash location
        const sectionId = location.hash.slice(1);
        this.handleNavigation(sectionId === "" ? this.props.defaultPageId : sectionId);
    }

    private handleHashChange = () => {
        if (location.hostname.indexOf("blueprint") !== -1) {
            // captures a pageview for new location hashes that are dynamically rendered without a full page request
            (window as any).ga("send", "pageview", {
                page: location.pathname + location.search + location.hash,
            });
        }
        // Don't call componentDidMount since the HotkeysTarget decorator will be invoked on every hashchange.
        this.updateHash();
    };

    private handleCloseNavigator = () => this.setState({ isNavigatorOpen: false });

    private handleOpenNavigator = () => this.setState({ isNavigatorOpen: true });

    private handleNavigation = (activeSectionId: string) => {
        // only update state if this section reference is valid
        const activePageId = this.routeToPage[activeSectionId];
        if (activeSectionId !== undefined && activePageId !== undefined) {
            const scrollToHeading = (behavior: "smooth" | "instant") => {
                // Scroll to the heading after React finishes rendering
                requestAnimationFrame(() => {
                    const headingElement = document.getElementById(activeSectionId);
                    if (headingElement != null) {
                        const scrollParent = this.props.scrollParent ?? document.documentElement;
                        const offsetPosition = headingElement.offsetTop - HEADING_IN_VIEW_THRESHOLD;
                        scrollParent.scrollTo({
                            behavior,
                            top: offsetPosition,
                        });
                    }
                });
            };

            // If we're on the same page, just scroll. Otherwise update state first.
            if (this.state.activePageId === activePageId) {
                scrollToHeading("smooth");
            } else {
                this.setState({ activePageId, activeSectionId, isNavigatorOpen: false }, () => scrollToHeading("instant"));
            }
        }
    };

    private handleNextSection = () => this.shiftSection(1);

    private handlePreviousSection = () => this.shiftSection(-1);

    private shiftSection(direction: 1 | -1) {
        // use the current hash instead of `this.state.activeSectionId` to avoid cases where the
        // active section cannot actually be selected in the nav (often a short one at the end).
        const currentSectionId = location.hash.slice(1);
        // this map is built by an in-order traversal so the keys are actually sorted correctly!
        const sections = Object.keys(this.routeToPage);
        const index = sections.indexOf(currentSectionId);
        const newIndex = index === -1 ? 0 : (index + direction + sections.length) % sections.length;
        // updating hash triggers event listener which sets new state.
        location.hash = sections[newIndex]!;
    }

    private handleApiBrowserOpen = (activeApiMember: string) =>
        this.setState({ activeApiMember, isApiBrowserOpen: true });

    private handleApiBrowserClose = () => this.setState({ isApiBrowserOpen: false });
}

type TypeRenderer = (type: string) => React.ReactNode;

/**
 * HACKHACK: workaround for https://github.com/palantir/documentalist/issues/246
 */
function omitEmptyTypeParamsList(typeRenderer: TypeRenderer): TypeRenderer {
    return (type: string) => typeRenderer(type.replace("<>", ""));
}
