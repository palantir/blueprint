/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { setHotkeysDialogProps } from "@blueprintjs/core";
import { Documentation, IDocumentationProps } from "@blueprintjs/docs";
import * as React from "react";
import { IPackageInfo, NavbarActions } from "./navbarActions";

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
            <div className="pt-text-muted" key="_version">
                v{this.props.versions[0].version}
            </div>,
        ];
        const navbarRight = (
            <NavbarActions
                onToggleDark={this.handleToggleDark}
                releases={this.props.releases}
                useDarkTheme={this.state.themeName === DARK_THEME}
            />
        );
        return (
            <Documentation
                {...this.props}
                className={this.state.themeName}
                navbarLeft={navbarLeft}
                navbarRight={navbarRight}
                onComponentUpdate={this.handleComponentUpdate}
            />
        );
    }

    // This function is called whenever the documentation page changes and should be used to
    // run non-React code on the newly rendered sections.
    private handleComponentUpdate = () => {
        // indeterminate checkbox styles must be applied via JavaScript.
        document.queryAll(".pt-checkbox input[indeterminate]").forEach((el: HTMLInputElement) => {
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
