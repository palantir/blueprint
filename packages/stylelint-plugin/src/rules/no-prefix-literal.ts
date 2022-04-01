/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import type { Root } from "postcss";
import selectorParser from "postcss-selector-parser";
import stylelint from "stylelint";
import type { PluginContext, PostcssResult } from "stylelint";

import { checkImportExists } from "../utils/checkImportExists";
import {
    BpPrefixVariableMap,
    BpVariableImportMap,
    CssExtensionMap,
    CssSyntax,
    getCssSyntax,
    isCssSyntaxToStringMap,
} from "../utils/cssSyntax";
import { insertImport } from "../utils/insertImport";

const ruleName = "@blueprintjs/no-prefix-literal";

const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: (unfixed: any, fixed: any) => `Use the \`${fixed}\` variable instead of the \`${unfixed}\` literal`,
});

const bannedPrefixes = ["bp3", "bp4"];

interface Options {
    disableFix?: boolean;
    variablesImportPath?: Partial<Record<Exclude<CssSyntax, CssSyntax.OTHER>, string>>;
}

export default stylelint.createPlugin(
    ruleName,
    (enabled: boolean, options: Options | undefined, context: PluginContext) => (root: Root, result: PostcssResult) => {
        if (!enabled) {
            return;
        }

        const validOptions = stylelint.utils.validateOptions(
            result,
            ruleName,
            {
                actual: enabled,
                optional: false,
                possible: [true, false],
            },
            {
                actual: options,
                optional: true,
                possible: {
                    disableFix: [true, false],
                    variablesImportPath: [isCssSyntaxToStringMap],
                },
            },
        );

        if (!validOptions) {
            return;
        }

        const disableFix = options?.disableFix ?? false;

        const cssSyntax = getCssSyntax(root.source?.input.file || "");
        if (cssSyntax === CssSyntax.OTHER) {
            return;
        }

        let hasBpVariablesImport: boolean | undefined; // undefined means not checked yet
        function assertBpVariablesImportExists(cssSyntaxType: CssSyntax.SASS | CssSyntax.LESS) {
            const importPath = options?.variablesImportPath?.[cssSyntaxType] ?? BpVariableImportMap[cssSyntaxType];
            const extension = CssExtensionMap[cssSyntaxType];
            if (hasBpVariablesImport == null) {
                hasBpVariablesImport = checkImportExists(root, [importPath, `${importPath}.${extension}`]);
            }
            if (!hasBpVariablesImport) {
                insertImport(root, context, importPath);
                hasBpVariablesImport = true;
            }
        }

        root.walkRules(rule => {
            rule.selector = selectorParser(selectors => {
                selectors.walkClasses(selector => {
                    for (const bannedPrefix of bannedPrefixes) {
                        if (!selector.value.startsWith(`${bannedPrefix}-`)) {
                            continue;
                        }
                        if ((context as any).fix && !disableFix) {
                            assertBpVariablesImportExists(cssSyntax);
                            const fixed =
                                BpPrefixVariableMap[cssSyntax] +
                                selector.value.substring(bannedPrefix.length, selector.value.length - 1);
                            // Note - selector.value = "#{$var}" escapes special characters and produces "\#\{\$var\}",
                            // and to work around that we use selector.toString instead.
                            selector.toString = () => `.${fixed}`;
                        } else {
                            stylelint.utils.report({
                                // HACKHACK - offset by one because otherwise the error is reported at a wrong position
                                index: selector.sourceIndex + 1,
                                message: messages.expected(bannedPrefix, BpPrefixVariableMap[cssSyntax]),
                                node: rule,
                                result,
                                ruleName,
                            });
                        }
                    }
                });
            }).processSync(rule.selector);
        });
    },
);
