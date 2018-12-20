/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isTsClass, isTsInterface, ITsDocBase } from "documentalist/dist/client";
import { ThemeConfig } from "docz";
import * as React from "react";
import { IThemeConfig } from "../../../config";
import { IDocumentationContext } from "../../common/context";

export class ApiHeader extends React.PureComponent<{ entry: ITsDocBase } & IDocumentationContext> {
    public static displayName = "Docs2.ApiHeader";

    public render() {
        const { entry } = this.props;
        return (
            <div className="docs-interface-header">
                <div className="docs-interface-name">
                    <small>{entry.kind}</small> {entry.name} <small>{this.renderInheritance()}</small>
                </div>
                <small className="docs-package-name">
                    <a href={entry.sourceUrl} target="_blank">
                        <ThemeConfig>
                            {({ renderViewSourceLinkText }: IThemeConfig) => renderViewSourceLinkText(entry)}
                        </ThemeConfig>
                    </a>
                </small>
                {this.props.children}
            </div>
        );
    }

    private renderInheritance() {
        if (isTsClass(this.props) || isTsInterface(this.props)) {
            const extendsTypes = maybeJoinArray("extends", this.props.extends);
            const implementsTypes = maybeJoinArray("implements", this.props.implements);
            return this.props.renderType(`${extendsTypes} ${implementsTypes}`);
        }
        return "";
    }
}

function maybeJoinArray(title: string, array: string[] | undefined): string {
    if (array == null || array.length === 0) {
        return "";
    }
    return `${title} ${array.join(", ")}`;
}
