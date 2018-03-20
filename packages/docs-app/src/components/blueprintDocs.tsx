/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Icon, Menu, MenuItem, Popover, Position, setHotkeysDialogProps } from "@blueprintjs/core";
import { IPackageInfo } from "@blueprintjs/docs-data";
import { Banner, Documentation, IDocumentationProps } from "@blueprintjs/docs-theme";
import { ITsDocBase } from "documentalist/dist/client";
import * as React from "react";
import { NavbarActions } from "./navbarActions";

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
        const navbarLeft = [
            <a className="docs-logo" href="/" key="_logo" />,
            <div className="pt-navbar-heading docs-heading" key="_title">
                Blueprint
            </div>,
            this.renderVersionsMenu(),
        ];
        const navbarRight = (
            <NavbarActions
                onToggleDark={this.handleToggleDark}
                releases={this.props.releases}
                useDarkTheme={this.state.themeName === DARK_THEME}
            />
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
                    navbarLeft={navbarLeft}
                    navbarRight={navbarRight}
                    onComponentUpdate={this.handleComponentUpdate}
                    renderViewSourceLinkText={this.renderViewSourceLinkText}
                />
            </>
        );
    }

    private renderVersionsMenu() {
        const { versions } = this.props;
        if (versions.length === 1) {
            return (
                <div className="pt-text-muted" key="_versions">
                    v{versions[0].version}
                </div>
            );
        }

        const match = /docs\/v([0-9]+)/.exec(location.href);
        // default to latest release if we can't find a major version in the URL
        const currentRelease = match == null ? versions[versions.length - 1].version : match[1];
        const releaseItems = versions.map((rel, i) => <MenuItem key={i} href={rel.url} text={rel.version} />);
        const menu = <Menu className="docs-version-list">{releaseItems}</Menu>;

        return (
            <Popover content={menu} position={Position.BOTTOM} key="_versions">
                <button className="docs-version-selector pt-text-muted">
                    v{currentRelease} <Icon icon="caret-down" />
                </button>
            </Popover>
        );
    }

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
        const themeName = useDark ? DARK_THEME : LIGHT_THEME;
        setTheme(themeName);
        setHotkeysDialogProps({ className: this.state.themeName });
        this.setState({ themeName });
    };
}
