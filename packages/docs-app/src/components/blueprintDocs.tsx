/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { AnchorButton, Classes, setHotkeysDialogProps, Tag } from "@blueprintjs/core";
import { IDocsCompleteData } from "@blueprintjs/docs-data";
import { Documentation, IDocumentationProps, INavMenuItemProps, NavMenuItem } from "@blueprintjs/docs-theme";
import { IHeadingNode, IPageData, isPageNode, ITsDocBase } from "@documentalist/client";
import classNames from "classnames";
import * as React from "react";
import { NavHeader } from "./navHeader";
import { NavIcon } from "./navIcons";

const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";
const THEME_LOCAL_STORAGE_KEY = "blueprint-docs-theme";

const GITHUB_SOURCE_URL = "https://github.com/palantir/blueprint/blob/develop";
const NPM_URL = "https://www.npmjs.com/package";

// detect Components page and subheadings
const COMPONENTS_PATTERN = /\/components(\.[\w-]+)?$/;
const isNavSection = ({ route }: IHeadingNode) => COMPONENTS_PATTERN.test(route);

/** Return the current theme className. */
export function getTheme(): string {
    return localStorage.getItem(THEME_LOCAL_STORAGE_KEY) || LIGHT_THEME;
}

/** Persist the current theme className in local storage. */
export function setTheme(themeName: string) {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, themeName);
}

export interface IBlueprintDocsProps {
    docs: IDocsCompleteData;
    defaultPageId: IDocumentationProps["defaultPageId"];
    tagRenderers: IDocumentationProps["tagRenderers"];
    /** Whether to use `next` versions for packages (as opposed to `latest`). */
    useNextVersion: boolean;
}

export class BlueprintDocs extends React.Component<IBlueprintDocsProps, { themeName: string }> {
    public state = { themeName: getTheme() };

    public render() {
        const footer = (
            <small className={classNames("docs-copyright", Classes.TEXT_MUTED)}>
                &copy; {new Date().getFullYear()}
                <svg className={Classes.ICON} viewBox="0 0 18 23" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.718 16.653L9 20.013l-7.718-3.36L0 19.133 9 23l9-3.868-1.282-2.48zM9 14.738c-3.297 0-5.97-2.696-5.97-6.02C3.03 5.39 5.703 2.695 9 2.695c3.297 0 5.97 2.696 5.97 6.02 0 3.326-2.673 6.022-5.97 6.022zM9 0C4.23 0 .366 3.9.366 8.708c0 4.81 3.865 8.71 8.634 8.71 4.77 0 8.635-3.9 8.635-8.71C17.635 3.898 13.77 0 9 0z" />
                </svg>
                <a href="https://www.palantir.com/" target="_blank">
                    Palantir
                </a>
            </small>
        );
        const header = (
            <NavHeader
                onToggleDark={this.handleToggleDark}
                useDarkTheme={this.state.themeName === DARK_THEME}
                useNextVersion={this.props.useNextVersion}
                packageData={this.getNpmPackage("@blueprintjs/core")}
            />
        );
        return (
            <Documentation
                {...this.props}
                className={this.state.themeName}
                footer={footer}
                header={header}
                navigatorExclude={isNavSection}
                onComponentUpdate={this.handleComponentUpdate}
                renderNavMenuItem={this.renderNavMenuItem}
                renderPageActions={this.renderPageActions}
                renderViewSourceLinkText={this.renderViewSourceLinkText}
            />
        );
    }

    private renderNavMenuItem = (props: INavMenuItemProps) => {
        const { route, title } = props.section;
        if (isNavSection(props.section)) {
            // non-interactive header that expands its menu
            return <div className="docs-nav-section docs-nav-expanded">{title}</div>;
        }
        if (isPageNode(props.section)) {
            if (props.section.level === 1) {
                return (
                    <div className={classNames("docs-nav-package", props.className)} data-route={route}>
                        <a className={Classes.MENU_ITEM} href={props.href} onClick={props.onClick}>
                            <NavIcon route={route} />
                            <span>{title}</span>
                        </a>
                        {this.maybeRenderPackageLink(`@blueprintjs/${route}`)}
                    </div>
                );
            } else {
                // pages can define `tag: message` in metadata to appear next to nav item.
                return <NavMenuItem {...props}>{this.maybeRenderPageTag(props.section.reference)}</NavMenuItem>;
            }
        }
        return <NavMenuItem {...props} />;
    };

    private renderPageActions(page: IPageData) {
        return (
            <AnchorButton
                href={`${GITHUB_SOURCE_URL}/${page.sourcePath}`}
                icon="edit"
                minimal={true}
                target="_blank"
                text="Edit this page"
            />
        );
    }

    private maybeRenderPageTag(reference: string) {
        const tag = this.props.docs.pages[reference].metadata.tag;
        if (tag == null) {
            return null;
        }
        return (
            <Tag className="docs-nav-tag" minimal={true} intent={tag === "new" ? "success" : "none"}>
                {tag}
            </Tag>
        );
    }

    private renderViewSourceLinkText(entry: ITsDocBase) {
        return `@blueprintjs/${entry.fileName.split("/", 2)[1]}`;
    }

    private maybeRenderPackageLink(packageName: string) {
        const pkg = this.getNpmPackage(packageName);
        if (pkg == null) {
            return null;
        }
        const version = this.props.useNextVersion && pkg.nextVersion ? pkg.nextVersion : pkg.version;
        return (
            <a className={Classes.TEXT_MUTED} href={`${NPM_URL}/${pkg.name}`} target="_blank">
                <small>{version}</small>
            </a>
        );
    }

    private getNpmPackage(packageName: string) {
        return this.props.docs.npm[packageName];
    }

    // This function is called whenever the documentation page changes and should be used to
    // run non-React code on the newly rendered sections.
    private handleComponentUpdate = () => {
        // indeterminate checkbox styles must be applied via JavaScript.
        Array.from(document.querySelectorAll(`.${Classes.CHECKBOX} input[indeterminate]`)).forEach(
            (el: HTMLInputElement) => (el.indeterminate = true),
        );
    };

    private handleToggleDark = (useDark: boolean) => {
        const nextThemeName = useDark ? DARK_THEME : LIGHT_THEME;
        setTheme(nextThemeName);
        setHotkeysDialogProps({ className: nextThemeName });
        this.setState({ themeName: nextThemeName });
    };
}
