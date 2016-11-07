/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Hotkey, Hotkeys, HotkeysTarget, IHotkeysDialogProps, setHotkeysDialogProps } from "@blueprint/core";

import { Navbar, NavbarLeft } from "./navbar";
import { Navigator } from "./navigator";
import { NavMenu } from "./navMenu";
import { Section } from "./section";

const DARK_THEME = "pt-dark";
const LIGHT_THEME = "";
const THEME_LOCAL_STORAGE_KEY = "pt-blueprint-theme";

export function getTheme(): string {
    return localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
}

export interface IStyleguideModifier {
    className?: string;
    description: string;
    name: string;
}

export interface IStyleguideSection {
    angularExample?: string;
    deprecated: boolean;
    depth: number;
    description: string;
    experimental: boolean;
    header: string;
    hideMarkup?: boolean;
    highlightedMarkup?: string;
    markup?: string;
    modifiers: IStyleguideModifier[];
    parameters: any[];
    interfaceName?: string;
    reactDocs?: string;
    reactExample?: string;
    reference: string;
    sections: IStyleguideSection[];
}

export interface IPackageInfo {
    name: string;
    version: string;
}

export interface IStyleguideProps {
    /**
     * Callback invoked whenever the documentation state updates (typically page or theme change).
     * Use it to run non-React code on the newly rendered sections.
     */
    onUpdate: (pageId: string) => void;

    /** All pages in the documentation. */
    pages: IStyleguideSection[];

    /** Release versions for published documentation. */
    versions: string[];

    /** Latest release versions for published projects. */
    releases: IPackageInfo[];

    renderExample(section: IStyleguideSection): { element: JSX.Element, sourceUrl: string };
}

export interface IStyleguideState {
    activePageId?: string;
    activeSectionId?: string;
    themeName?: string;
}

// initial page ID on load
const DEFAULT_PAGE = "overview";

@HotkeysTarget
@PureRender
export class Styleguide extends React.Component<IStyleguideProps, IStyleguideState> {
    private contentElement: HTMLElement;
    private navElement: HTMLElement;
    private refHandlers = {
        content: (ref: HTMLElement) => this.contentElement = ref,
        nav: (ref: HTMLElement) => this.navElement = ref,
    };

    public constructor(props: IStyleguideProps, context?: any) {
        super(props, context);
        this.state = {
            activePageId: DEFAULT_PAGE,
            activeSectionId: DEFAULT_PAGE,
            themeName: getTheme(),
        };
    }

    public render() {
        const { activePageId, activeSectionId } = this.state;
        const [actualPageId] = activePageId.split(".", 1);
        let activePage = this.props.pages.filter((page) => page.reference === actualPageId)[0];

        if (activePageId.indexOf("components") === 0) {
            // create page that only contains the specific component being viewed
            activePage = Object.assign({}, activePage, {
                description: "",
                reference: "components",
                sections: activePage.sections.filter((page) => page.reference === activePageId),
            });
        }

        return (
            <div className={classNames("pt-app", "docs-app", this.state.themeName)}>
                <div className="docs-left-container">
                    <NavbarLeft versions={this.props.versions} />
                    <div className="docs-nav" ref={this.refHandlers.nav}>
                        <NavMenu
                            activeSectionId={activeSectionId}
                            onItemClick={this.handleMenuClick}
                            sections={this.props.pages}
                        />
                    </div>
                </div>
                <div className="docs-right-container" onScroll={this.handleScroll}>
                    <Navbar
                        onToggleDark={this.handleToggleDark}
                        releases={this.props.releases}
                        useDarkTheme={this.state.themeName === DARK_THEME}
                    >
                        <Navigator pages={this.props.pages} onNavigate={this.handleNavigation} />
                    </Navbar>
                    <article className="docs-content" ref={this.refHandlers.content} role="main">
                        <Section renderExample={this.props.renderExample} section={activePage} />
                    </article>
                </div>
            </div>
        );
    }

    public renderHotkeys() {
        return <Hotkeys>
            <Hotkey global={true} combo="[" label="Previous Section" onKeyDown={this.handlePreviousSection}/>
            <Hotkey global={true} combo="]" label="Next section" onKeyDown={this.handleNextSection}/>
        </Hotkeys>;
    }

    public componentWillMount() {
        this.updateHash();
    }

    public componentDidMount() {
        this.scrollActiveSectionIntoView();
        this.props.onUpdate(this.state.activePageId);
        // whoa handling future history...
        window.addEventListener("hashchange", () => {
            if (location.hostname.indexOf("github.io") !== -1) {
                // captures a pageview for new location hashes that are dynamically rendered without a full page request
                (window as any).ga("send", "pageview", { page: location.pathname + location.search  + location.hash });
            }
            // Don't call componentWillMount since the HotkeysTarget decorator will be invoked on every hashchange.
            this.updateHash();
        });
        setHotkeysDialogProps({ className : this.state.themeName } as any as IHotkeysDialogProps);
    }

    public componentDidUpdate(_: IStyleguideProps, prevState: IStyleguideState) {
        const { activePageId, themeName } = this.state;

        // ensure the active section is visible when switching pages
        if (prevState.activePageId !== activePageId) {
            this.scrollActiveSectionIntoView();
        }

        this.props.onUpdate(activePageId);
        setHotkeysDialogProps({ className: themeName } as any as IHotkeysDialogProps);
    }

    private doesSectionExist(reference: string) {
        function containsPage(page: IStyleguideSection): boolean {
            return page.reference === reference || page.sections.some(containsPage);
        }
        return this.props.pages.some(containsPage);
    }

    private handleMenuClick = ({ reference }: IStyleguideSection) => this.handleNavigation(reference);

    private updateHash() {
        // update state based on current hash location
        this.handleNavigation(location.hash.slice(1));
    }

    private handleNavigation = (activeSectionId: string) => {
        // only update state if this section reference is valid
        if (activeSectionId != null && this.doesSectionExist(activeSectionId)) {
            const [page, section] = activeSectionId.split(".", 2);
            // treat Components page differently: each component should appear on its own page
            // so page id has two parts (second defaults to "Usage", the first subsection).
            const activePageId = (page === "components" ? `${page}.${section || "usage"}` : page);
            this.setState({ activePageId, activeSectionId });
        }
    }

    private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        // NOTE: typically we'd throttle a scroll handler but this guy is _blazing fast_ so no perf worries
        const { offsetLeft } = e.target as HTMLElement;
        // horizontal offset comes from section left padding, vertical offset from navbar height + 10px
        // test twice to ignore little blank zones that resolve to the parent section
        const refA = getReferenceAt(offsetLeft + 50, 60);
        const refB = getReferenceAt(offsetLeft + 50, 70);
        if (refA == null || refB == null) { return; }
        // use the longer (deeper) name to avoid jumping up between sections
        const activeSectionId = (refA.length > refB.length ? refA : refB);
        this.setState({ activeSectionId });
    }

    private getCurrentSectionsList() {
        const sections: string[] = [];
        const recurse = (page: IStyleguideSection) => {
            sections.push(page.reference);
            page.sections.forEach(recurse);
        };
        this.props.pages.forEach(recurse);
        return sections;
    }

    private handleNextSection = () => {
        const sections = this.getCurrentSectionsList();
        const currentSectionHash = location.hash.slice(1);
        const index = sections.indexOf(currentSectionHash);
        const nextIndex = (index + 1) % sections.length;

        location.hash = sections[nextIndex];
    }

    private handlePreviousSection = () => {
        const sections = this.getCurrentSectionsList();
        // Use the current hash instead of this.state.activeSectionId because
        // the state value sometimes doees not match the hash. This can happen
        // because the activeSectionId is updated based on what's visible while
        // scroll. So, navigating to a particular hash can cause the
        // activeSectionId to be set the to next section that is in view.
        const currentSectionHash = location.hash.slice(1);
        const index = sections.indexOf(currentSectionHash);
        const prevIndex = (index - 1 + sections.length) % sections.length;

        location.hash = sections[prevIndex];
    }

    private handleToggleDark = (useDark: boolean) => {
        const themeName = useDark ? DARK_THEME : LIGHT_THEME;
        this.setState({ themeName });
        localStorage.setItem(THEME_LOCAL_STORAGE_KEY, themeName);
    }

    private scrollActiveSectionIntoView() {
        const { activeSectionId } = this.state;
        queryHTMLElement(this.contentElement, `[data-section-id="${activeSectionId}"]`).scrollIntoView();
        queryHTMLElement(this.navElement, `[href="#${activeSectionId}"]`).scrollIntoView();
    }
}

/** Shorthand for element.query() + cast to HTMLElement */
function queryHTMLElement(parent: Element, selector: string) {
    return parent.query(selector) as HTMLElement;
}

/** Returns the reference of the sction that contains the given screen coordinate */
function getReferenceAt(clientX: number, clientY: number) {
    const section = document.elementFromPoint(clientX, clientY).closest(".docs-section");
    if (section == null) { return undefined; }
    return section.getAttribute("data-section-id");
}
