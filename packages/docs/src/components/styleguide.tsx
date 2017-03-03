/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import { IPageData, IPageNode } from "documentalist/dist/client";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { IHotkeysDialogProps, setHotkeysDialogProps } from "@blueprintjs/core";

import { getTheme, setTheme } from "../common/theme";
import { Navbar } from "./navbar";
import { Navigator } from "./navigator";
import { NavMenu } from "./navMenu";
import { Page, TagRenderer } from "./page";

// these interfaces are essential to the docs app, so it's helpful to re-export here
export { IInterfaceEntry, IPropertyEntry } from "ts-quick-docs/dist/interfaces";

const DARK_THEME = "pt-dark";
const LIGHT_THEME = "";

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
    /** Name of package. Ignored for documentation site versions. */
    name?: string;
    url: string;
    version: string;
}

export interface IStyleguideProps {
    /**
     * Callback invoked whenever the documentation state updates (typically page or theme change).
     * Use it to run non-React code on the newly rendered sections.
     */
    onUpdate: (pageId: string) => void;

    layout: IPageNode[];

    /** All pages in the documentation. */
    pages: { [ref: string]: IPageData };

    tagRenderers: { [tag: string]: TagRenderer };

    /** Release versions for published documentation. */
    versions: IPackageInfo[];

    /** Latest release versions for published projects. */
    releases: IPackageInfo[];
}

export interface IStyleguideState {
    activePageId?: string;
    activeSectionId?: string;
    themeName?: string;
}

// initial page ID on load
const DEFAULT_PAGE = "components";

@PureRender
export class Styleguide extends React.Component<IStyleguideProps, IStyleguideState> {
    private contentElement: HTMLElement;
    private navElement: HTMLElement;
    private refHandlers = {
        content: (ref: HTMLElement) => this.contentElement = ref,
        nav: (ref: HTMLElement) => this.navElement = ref,
    };

    public constructor(props: IStyleguideProps) {
        super(props);
        this.state = {
            activePageId: DEFAULT_PAGE,
            activeSectionId: DEFAULT_PAGE,
            themeName: getTheme(),
        };
    }

    public render() {
        const { activePageId, activeSectionId, themeName } = this.state;
        const { layout, pages } = this.props;
        return (
            <div className={classNames("docs-root", themeName)}>
                <div className="docs-app">
                    <Navbar
                        onToggleDark={this.handleToggleDark}
                        releases={this.props.releases}
                        useDarkTheme={themeName === DARK_THEME}
                        versions={this.props.versions}
                    >
                        <Navigator items={layout} onNavigate={this.handleNavigation} />
                    </Navbar>
                    <div className="docs-nav" ref={this.refHandlers.nav}>
                        <NavMenu
                            items={layout}
                            activeSectionId={activeSectionId}
                            onItemClick={this.handleNavigation}
                        />
                    </div>
                    <article className="docs-content pt-running-text" ref={this.refHandlers.content} role="main">
                        <Page page={pages[activePageId]} tagRenderers={this.props.tagRenderers} />
                    </article>
                </div>
            </div>
        );
    }

    public componentWillMount() {
        this.updateHash();
    }

    public componentDidMount() {
        this.scrollActiveSectionIntoView();
        this.props.onUpdate(this.state.activePageId);
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
        setHotkeysDialogProps({ className: this.state.themeName } as any as IHotkeysDialogProps);
    }

    public componentWillUnmount() {
        window.removeEventListener("hashchange");
        document.removeEventListener("scroll", this.handleScroll);
    }

    public componentDidUpdate(_prevProps: IStyleguideProps, prevState: IStyleguideState) {
        const { activePageId, themeName } = this.state;

        // ensure the active section is visible when switching pages
        if (prevState.activePageId !== activePageId) {
            this.scrollActiveSectionIntoView();
        }

        this.props.onUpdate(activePageId);
        setHotkeysDialogProps({ className: themeName } as any as IHotkeysDialogProps);
    }

    private doesSectionExist(reference: string) {
        return this.props.pages[reference] != null;
    }

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

    private handleScroll = () => {
        const activeSectionId = getScrolledReference(100);
        if (activeSectionId == null) { return; }
        // use the longer (deeper) name to avoid jumping up between sections
        this.setState({ activeSectionId });
    }

    private handleToggleDark = (useDark: boolean) => {
        const themeName = useDark ? DARK_THEME : LIGHT_THEME;
        this.setState({ themeName });
        setTheme(themeName);
    }

    private scrollActiveSectionIntoView() {
        const { activeSectionId } = this.state;
        queryHTMLElement(this.contentElement, `a[name="${activeSectionId}"]`).scrollIntoView();
        queryHTMLElement(this.navElement, `a[href="#${activeSectionId}"]`).scrollIntoView();
    }
}

/** Shorthand for element.query() + cast to HTMLElement */
function queryHTMLElement(parent: Element, selector: string) {
    return parent.query(selector) as HTMLElement;
}

/**
 * Returns the reference of the closest section to the top of the viewport,
 * within the given offset.
 */
function getScrolledReference(offset: number, scrollParent = document.body) {
    const headings = document.queryAll(".kss-title");
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
