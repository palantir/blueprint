/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "import statement forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new IconComponentsWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
// tslint:disable-next-line:max-classes-per-file
class IconComponentsWalker extends Lint.RuleWalker {
    public visitJsxAttribute(node: ts.JsxAttribute) {
        console.log(node.name.text, node.initializer);
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

        // call the base version of this visitor to actually parse this node
        super.visitJsxAttribute(node);
    }
}
