/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
 * Return a function which, when provided with a fixer, will produce a RuleFix to replace the
 * specified `fromImportName` with `toImportName` from the specified `packageName` at the top of the file.
 */
export const replaceImportInFile =
    (
        program: TSESTree.Program,
        options: {
            fromName: string;
            toName: string;
            alias?: string;
            moduleSpecifier: string;
        },
    ): TSESLint.ReportFixFunction =>
    fixer => {
        const fileImports = program.body.filter(
            node => node.type === AST_NODE_TYPES.ImportDeclaration,
        ) as TSESTree.ImportDeclaration[];
        const importToModify = fileImports.find(node => node.source.value === options.moduleSpecifier);

        if (importToModify === undefined) {
            throw new Error(`Unable to find import from "${options.moduleSpecifier}" while fixing lint error`);
        }

        const nodeToReplace = importToModify.specifiers.find(
            specifier =>
                specifier.type === AST_NODE_TYPES.ImportSpecifier && specifier.imported.name === options.fromName,
        ) as TSESTree.ImportSpecifier;

        if (nodeToReplace === undefined) {
            throw new Error(
                `Unable to find import { ${options.fromName} } from "${options.moduleSpecifier}" while fixing lint error`,
            );
        } else if (options.alias !== undefined && nodeToReplace.local.name !== nodeToReplace.imported.name) {
            throw new Error(
                `Existing import '${nodeToReplace.imported.name}' is already aliased as '${nodeToReplace.local.name}', refusing to rename with new alias '${options.alias}'`,
            );
        }

        const newText = options.alias !== undefined ? `${options.toName} as ${options.alias}` : options.toName;

        return fixer.replaceText(nodeToReplace, newText);
    };
