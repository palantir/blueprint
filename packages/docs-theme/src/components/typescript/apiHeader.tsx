/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isTsClass, isTsInterface, ITsDocBase } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";

export class ApiHeader extends React.PureComponent<ITsDocBase> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.ApiHeader";

    public context: IDocumentationContext;

    public render() {
        return (
            <div className="docs-interface-header">
                <div className="docs-interface-name">
                    <small>{this.props.kind}</small> {this.props.name} <small>{this.renderInheritance()}</small>
                </div>
                <small className="docs-package-name">
                    <a href={this.props.sourceUrl} target="_blank">
                        {this.context.renderViewSourceLinkText(this.props)}
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
            return this.context.renderType(`${extendsTypes} ${implementsTypes}`);
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
