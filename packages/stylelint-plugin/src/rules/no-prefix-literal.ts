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

import { Root, Result } from "postcss";
import selectorParser from "postcss-selector-parser";
import stylelint from "stylelint";
import type { Plugin, RuleTesterContext } from "stylelint";

import { checkImportExists } from "../utils/checkImportExists";
import { insertImport } from "../utils/insertImport";

const ruleName = "@blueprintjs/no-prefix-literal";

const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: (unfixed: string, fixed: string) => `Use the \`${fixed}\` variable instead of the \`${unfixed}\` literal`,
});

const bannedPrefixes = ["bp3", "bp4"];

interface Options {
    disableFix?: boolean;
    variablesImportPath?: Partial<Record<Exclude<CssSyntax, CssSyntax.OTHER>, string>>;
}

export default stylelint.createPlugin(ruleName, ((
    enabled: boolean,
    options: Options | undefined,
    context: RuleTesterContext,
) => (root: Root, result: Result) => {
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
                variablesImportPath: (obj: unknown) => {
                    if (typeof obj !== "object" || obj == null) {
                        return false;
                    }
                    // Check that the keys and their values are correct
                    const allowedKeys = new Set<string>(Object.values(CssSyntax).filter(v => v !== CssSyntax.OTHER));
                    return Object.keys(obj).every(key => allowedKeys.has(key) && typeof (obj as any)[key] === "string");
                },
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
                        const fixed = BpPrefixVariableMap[cssSyntax] + selector.value.substr(bannedPrefix.length);
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
}) as Plugin);

enum CssSyntax {
    SASS = "sass",
    LESS = "less",
    OTHER = "other",
}

const CssExtensionMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "scss",
    [CssSyntax.LESS]: "less",
};

const BpPrefixVariableMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "#{$bp-ns}",
    [CssSyntax.LESS]: "@{bp-ns}",
};

const BpVariableImportMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "~@blueprintjs/core/lib/scss/variables",
    [CssSyntax.LESS]: "~@blueprintjs/core/lib/less/variables",
};

/**
 * Returns the flavor of the CSS we're dealing with.
 */
function getCssSyntax(fileName: string): CssSyntax {
    for (const cssSyntax of Object.keys(CssExtensionMap)) {
        if (fileName.endsWith(`.${CssExtensionMap[cssSyntax as Exclude<CssSyntax, CssSyntax.OTHER>]}`)) {
            return cssSyntax as Exclude<CssSyntax, CssSyntax.OTHER>;
        }
    }
    return CssSyntax.OTHER;
}
