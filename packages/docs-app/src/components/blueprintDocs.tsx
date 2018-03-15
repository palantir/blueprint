/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, setHotkeysDialogProps } from "@blueprintjs/core";
import { IPackageInfo } from "@blueprintjs/docs-data";
import { Banner, Documentation, IDocumentationProps, INavMenuItemProps, NavMenuItem } from "@blueprintjs/docs-theme";
import classNames from "classnames";
import { isPageNode, ITsDocBase } from "documentalist/dist/client";
import * as React from "react";
import { NavHeader } from "./navHeader";
import { NavIcon } from "./navIcons";

const DARK_THEME = "pt-dark";
const LIGHT_THEME = "";
const THEME_LOCAL_STORAGE_KEY = "pt-blueprint-theme";

/** Return the current theme className. */
export function getTheme(): string {
    return localStorage.getItem(THEME_LOCAL_STORAGE_KEY) || LIGHT_THEME;
}

/** Persist the current theme className in local storage. */
export function setTheme(themeName: string) {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, themeName);
}

export interface IBlueprintDocsProps extends Pick<IDocumentationProps, "defaultPageId" | "docs" | "tagRenderers"> {
    releases: IPackageInfo[];
    versions: IPackageInfo[];
}

export class BlueprintDocs extends React.Component<IBlueprintDocsProps, { themeName: string }> {
    public state = { themeName: getTheme() };

    public render() {
        const header = (
            <NavHeader onToggleDark={this.handleToggleDark} useDarkTheme={this.state.themeName === DARK_THEME} />
        );
        return (
            <>
                <Banner href="http://blueprintjs.com/docs/v1/">
                    This documentation is for Blueprint v2, which is currently under development. Click here to go to
                    the v1 docs.
                </Banner>
                <Documentation
                    {...this.props}
                    className={this.state.themeName}
                    header={header}
                    onComponentUpdate={this.handleComponentUpdate}
                    renderNavMenuItem={this.renderNavMenuItem}
                    renderViewSourceLinkText={this.renderViewSourceLinkText}
                />
            </>
        );
    }

    private renderNavMenuItem = (props: INavMenuItemProps) => {
        if (isPageNode(props.section) && props.section.level === 1) {
            const pkg = this.props.releases.find(p => p.name === `@blueprintjs/${props.section.route}`);
            return (
                <div className={classNames("docs-nav-package", props.className)} data-route={props.section.route}>
                    <a className="pt-menu-item" href={props.href} onClick={props.onClick}>
                        <NavIcon route={props.section.route} />
                        <span>{props.section.title}</span>
                    </a>
                    {pkg && (
                        <a className={Classes.TEXT_MUTED} href={pkg.url} target="_blank">
                            <small>{pkg.version}</small>
                        </a>
                    )}
                </div>
            );
        }
        return <NavMenuItem {...props} />;
    };

    private renderViewSourceLinkText(entry: ITsDocBase) {
        return `@blueprintjs/${entry.fileName.split("/", 2)[1]}`;
    }

    // This function is called whenever the documentation page changes and should be used to
    // run non-React code on the newly rendered sections.
    private handleComponentUpdate = () => {
        // indeterminate checkbox styles must be applied via JavaScript.
        Array.from(document.querySelectorAll(".pt-checkbox input[indeterminate]")).forEach((el: HTMLInputElement) => {
            el.indeterminate = true;
        });
    };

    private handleToggleDark = (useDark: boolean) => {
        const nextThemeName = useDark ? DARK_THEME : LIGHT_THEME;
        setTheme(nextThemeName);
        setHotkeysDialogProps({ className: nextThemeName });
        this.setState({ themeName: nextThemeName });
    };
}
