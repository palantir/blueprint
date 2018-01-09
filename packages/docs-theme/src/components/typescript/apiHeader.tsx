/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isTsClass, isTsInterface, ITsDocBase } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";

export const ApiHeader: React.SFC<ITsDocBase> = (data, { renderType }: IDocumentationContext) => {
    const inheritance =
        isTsClass(data) || isTsInterface(data)
            ? maybeJoinArray("extends", data.extends) + " " + maybeJoinArray("implements", data.implements)
            : "";
    return (
        <div className="docs-interface-header">
            <div className="docs-interface-name">
                <small>{data.kind}</small> {data.name} <small>{renderType(inheritance)}</small>
            </div>
            <small className="docs-package-name">
                <a href={GITHUB_URL + data.fileName.slice(3)} target="__blank">
                    @blueprintjs/{data.fileName.split("/", 2)[1]}
                </a>
            </small>
            {data.children}
        </div>
    );
};
ApiHeader.contextTypes = DocumentationContextTypes;
ApiHeader.displayName = "Docs.ApiHeader";

function maybeJoinArray(title: string, array: string[] | undefined): string {
    if (array == null || array.length === 0) {
        return "";
    }
    return `${title} ${array.join(", ")}`;
}

const GITHUB_URL = "https://github.com/palantir/blueprint/tree/master/packages/";
