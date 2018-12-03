/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Replacement } from "tslint";
import { JsxTagNameExpression } from "typescript";

/** Replace the name of a JSX tag. */
export function replaceTagName(tagName: JsxTagNameExpression, newTagName: string) {
    return new Replacement(tagName.getFullStart(), tagName.getFullWidth(), newTagName);
}
