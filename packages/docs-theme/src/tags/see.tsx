/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITag } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";

export const SeeTag: React.SFC<ITag> = ({ value }, { renderType }: IDocumentationContext) => (
    <p>See: {renderType(value)}</p>
);
SeeTag.contextTypes = DocumentationContextTypes;
SeeTag.displayName = "Docs.SeeTag";
