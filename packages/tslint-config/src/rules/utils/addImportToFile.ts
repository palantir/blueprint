/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Replacement } from "tslint";
import * as utils from "tsutils";
import * as ts from "typescript";

export function addImportToFile(file: ts.SourceFile, imports: string[], packageName: string) {
    const packageToModify = file.statements.find(
        statement => utils.isImportDeclaration(statement) && statement.moduleSpecifier.getText() === `"${packageName}"`,
    ) as ts.ImportDeclaration;
    if (
        packageToModify &&
        packageToModify.importClause &&
        packageToModify.importClause.namedBindings &&
        utils.isNamedImports(packageToModify.importClause.namedBindings)
    ) {
        const existingImports = packageToModify.importClause.namedBindings.elements.map(el => el.name.getText());
        // Poor man's lodash.uniq without the dep.
        const newImports = Array.from(new Set(existingImports.concat(imports))).sort();
        const importString = `{ ${newImports.join(", ")} }`;
        return Replacement.replaceNode(packageToModify.importClause.namedBindings, importString);
    } else {
        // we always place the import in alphabetical order. If imports are already alpha-ordered, this will act nicely
        // with existing lint rules. If imports are not alpha-ordered, this may appear weird.
        const allImports = file.statements.filter(utils.isImportDeclaration);
        const newImportIndex = allImports.findIndex(imp => {
            // slice the quotes off each module specifier
            return compare(imp.moduleSpecifier.getText().slice(1, -1), packageName) === 1;
        });
        const startIndex = newImportIndex === -1 ? 0 : allImports[newImportIndex].getStart();
        return Replacement.appendText(startIndex, `import { ${imports.sort().join(", ")} } from "${packageName}";\n`);
    }
}

function isLow(value: string) {
    return value[0] === "." || value[0] === "/";
}

// taken from tslint orderedImportRules
function compare(a: string, b: string): 0 | 1 | -1 {
    if (isLow(a) && !isLow(b)) {
        return 1;
    } else if (!isLow(a) && isLow(b)) {
        return -1;
    } else if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }
    return 0;
}
