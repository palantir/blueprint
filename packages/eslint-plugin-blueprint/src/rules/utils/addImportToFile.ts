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

import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/experimental-utils";
import { RuleFix, RuleFixer } from "@typescript-eslint/experimental-utils/dist/ts-eslint";

export function addImportToFile(
    program: TSESTree.Program,
    fixer: RuleFixer,
    imports: string[],
    packageName: string,
): RuleFix {
    const fileImports = program.body.filter(
        node => node.type === AST_NODE_TYPES.ImportDeclaration,
    ) as TSESTree.ImportDeclaration[];
    const nodeToModify = fileImports.find(node => node.source.value === packageName);

    if (
        nodeToModify !== undefined &&
        nodeToModify.specifiers.every(node => node.type === AST_NODE_TYPES.ImportSpecifier)
    ) {
        // module imports
        const existingImports = nodeToModify.specifiers.map(node => node.local.name);
        const newImports = Array.from(new Set(existingImports.concat(imports))).sort();
        const importString = `import { ${newImports.join(", ")} } from "${nodeToModify.source.value}";`;
        return fixer.replaceText(nodeToModify, importString);
    } else {
        // default imports

        // if we are adding the first import, add a 2nd new line afterwards
        const onlyImport = fileImports.length === 0;
        return fixer.insertTextBefore(
            program.body[0],
            `import { ${imports.sort().join(", ")} } from "${packageName}";\n${onlyImport ? "\n" : ""}`,
        );
    }
}