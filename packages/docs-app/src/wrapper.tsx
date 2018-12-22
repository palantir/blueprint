/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { AnchorButton, Classes, setHotkeysDialogProps, Tag } from "@blueprintjs/core";
import { docsData } from "@blueprintjs/docs-data";
import { BlueprintDoczConfig, IThemeConfig, NavItemRenderer, NavMenuItem } from "@blueprintjs/docz-theme";
import classNames from "classnames";
import { ITsDocBase } from "documentalist/dist/client";
import { Entry } from "docz";
import * as React from "react";
import { NavFooter } from "./components/navFooter";
import { NavHeader } from "./components/navHeader";
import { NavIcon } from "./components/navIcons";
import "./index.scss";
import { getTheme, setTheme } from "./theme";

const GITHUB_SOURCE_URL = "https://github.com/palantir/blueprint/blob/develop";
const NPM_URL = "https://www.npmjs.com/package";

interface IAppState {
    themeName: string;
}

// Docz requires that this be a default export.
// tslint:disable-next-line:no-default-export
export default class extends React.Component<{}, IAppState> {
    public state = { themeName: getTheme() };

    public render() {
        const config: IThemeConfig = {
            className: this.state.themeName,
            documentalist: docsData,
            footer: <NavFooter />,
            header: (
                <NavHeader
                    packageData={docsData.npm["@blueprintjs/core"]}
                    onToggleDark={this.handleToggleDark}
                    useDarkTheme={!!this.state.themeName}
                    useNextVersion={false}
                />
            ),
            renderNavMenuItem: this.renderNavMenuItem,
            renderPageActions: this.renderPageActions,
            renderViewSourceLinkText: this.renderViewSourceLinkText,
        };
        return <BlueprintDoczConfig value={config}>{this.props.children}</BlueprintDoczConfig>;
    }

    private renderNavMenuItem: NavItemRenderer = props => {
        const pkgName = props.name.toLowerCase().slice(props.name.lastIndexOf("/") + 1);
        console.log(pkgName);

        if (props.route == null && this.getNpmPackage(pkgName) != null) {
            console.log(props);

            const classes = classNames(
                "docs-nav-package",
                { "docs-nav-expanded": props.expanded },
                `depth-${props.depth}`,
            );
            return (
                <div className={classes} data-package={pkgName}>
                    <NavIcon name={props.name} />
                    <span>{props.name}</span>
                    {this.maybeRenderPackageLink(pkgName)}
                </div>
            );
        }
        return <NavMenuItem {...props} depth={props.depth - 1} />;
    };

    private maybeRenderPageTag(reference: string) {
        const tag = docsData.pages[reference].metadata.tag;
        if (tag == null) {
            return null;
        }
        return (
            <Tag className="docs-nav-tag" minimal={true} intent={tag === "new" ? "success" : "none"}>
                {tag}
            </Tag>
        );
    }

    private maybeRenderPackageLink(unscopedName: string) {
        const pkg = this.getNpmPackage(unscopedName);
        if (pkg == null) {
            return null;
        }
        const version = this.props.useNextVersion && pkg.nextVersion ? pkg.nextVersion : pkg.version;
        return (
            <a
                className={Classes.TEXT_MUTED}
                href={`${NPM_URL}/${pkg.name}`}
                target="_blank"
                onClick={this.handlePackageLink}
            >
                <small>{version}</small>
            </a>
        );
    }

    private renderPageActions(page: Entry) {
        return (
            <AnchorButton
                href={`${GITHUB_SOURCE_URL}/${page.filepath}`}
                icon="edit"
                minimal={true}
                target="_blank"
                text="Edit this page"
            />
        );
    }

    private renderViewSourceLinkText(entry: ITsDocBase) {
        return `@blueprintjs/${entry.fileName.split("/", 2)[1]}`;
    }

    private getNpmPackage(unscopedPackageName: string) {
        return docsData.npm[`@blueprintjs/${unscopedPackageName}`];
    }

    private handleToggleDark = (useDark: boolean) => {
        const nextThemeName = setTheme(useDark);
        setHotkeysDialogProps({ className: nextThemeName });
        this.setState({ themeName: nextThemeName });
    };

    private handlePackageLink = (evt: React.MouseEvent) => evt.stopPropagation();
}
