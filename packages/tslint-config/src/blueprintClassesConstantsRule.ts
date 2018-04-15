/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const PATTERN = /^pt-/;

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = "use Blueprint Classes constants instead of literal strings";

    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ClassesConstantsWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class ClassesConstantsWalker extends Lint.RuleWalker {
    visitStringLiteral(node: ts.StringLiteral) {
        if (PATTERN.test(node.getFullText())) {
            // create a failure at the current position
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        // call the base version of this visitor to actually parse this node
        super.visitStringLiteral(node);
    }
}
