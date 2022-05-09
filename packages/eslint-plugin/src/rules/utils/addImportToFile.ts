/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";

/**
 * Return a function which when provided with a fixer will produce a RuleFix to add the
 * specified imports from the specified packageName at the top of the file (in alphabetical order)
 */
export const addImportToFile =
    (program: TSESTree.Program, imports: string[], packageName: string): TSESLint.ReportFixFunction =>
    fixer => {
        const fileImports = program.body.filter(
            node => node.type === AST_NODE_TYPES.ImportDeclaration,
        ) as TSESTree.ImportDeclaration[];
        const nodeToModify = fileImports.find(node => node.source.value === packageName);

        if (
            nodeToModify !== undefined &&
            nodeToModify.specifiers.every(node => node.type === AST_NODE_TYPES.ImportSpecifier)
        ) {
            // Module imports
            const existingImports = nodeToModify.specifiers.map(node => node.local.name);
            const newImports = Array.from(new Set(existingImports.concat(imports))).sort();
            const importString = `import { ${newImports.join(", ")} } from "${nodeToModify.source.value}";`;
            return fixer.replaceText(nodeToModify, importString);
        } else {
            // Default imports

            // Find the node thats alphabetically after the new one, so we can insert before it
            const followingImportNode = fileImports.find(imp => {
                return imp.source.value != null && compare(imp.source.value.toString(), packageName) === 1;
            });

            const onlyImport = fileImports.length === 0;
            return fixer.insertTextBefore(
                followingImportNode !== undefined ? followingImportNode : program.body[0],
                // If we are adding the first import, add a 2nd new line afterwards
                `import { ${imports.sort().join(", ")} } from "${packageName}";\n${onlyImport ? "\n" : ""}`,
            );
        }
    };

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
