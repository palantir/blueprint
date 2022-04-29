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

import type { Declaration, Root } from "postcss";
import valueParser from "postcss-value-parser";
import stylelint, { PluginContext, PostcssResult } from "stylelint";

import { Colors } from "@blueprintjs/colors";

import { checkImportExists } from "../utils/checkImportExists";
import {
    BpVariableImportMap,
    BpVariablePrefixMap,
    CssExtensionMap,
    CssSyntax,
    getCssSyntax,
    isCssSyntaxToStringMap,
} from "../utils/cssSyntax";
import { isHexColor, normalizeHexColor } from "../utils/hexColor";
import { insertImport } from "../utils/insertImport";

const ruleName = "@blueprintjs/no-color-literal";

const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: (unfixed: any, fixed: any) => `Use the \`${fixed}\` variable instead of the \`${unfixed}\` literal`,
});

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

        root.walkDecls(decl => {
            let needsFix = false;
            const parsedValue = valueParser(decl.value);
            parsedValue.walk(node => {
                const value = node.value;
                const type = node.type;
                if (type !== "word" || !isHexColor(value)) {
                    return;
                }
                const cssVar = getCssColorVariable(value, cssSyntax);
                if (cssVar == null) {
                    return;
                }
                if (context.fix && !disableFix) {
                    assertBpVariablesImportExists(cssSyntax);
                    node.value = cssVar;
                    needsFix = true;
                } else {
                    const message =
                        typeof messages.expected === "string" ? messages.expected : messages.expected?.(value, cssVar);
                    stylelint.utils.report({
                        index: declarationValueIndex(decl) + node.sourceIndex,
                        message,
                        node: decl,
                        result,
                        ruleName,
                    });
                }
            });
            if (needsFix) {
                decl.value = parsedValue.toString();
            }
        });
    },
);

function declarationValueIndex(decl: Declaration) {
    const beforeColon = decl.toString().indexOf(":");
    const afterColon = decl.raw("between").length - decl.raw("between").indexOf(":");
    return beforeColon + afterColon;
}

/**
 * Returns a CSS color variable for a given hex color, or undefined if one doesn't exist.
 */
function getCssColorVariable(hexColor: string, cssSyntax: CssSyntax.SASS | CssSyntax.LESS): string | undefined {
    const normalizedHex = normalizeHexColor(hexColor);
    if (hexToColorName[normalizedHex] == null) {
        return undefined;
    }
    return BpVariablePrefixMap[cssSyntax] + hexToColorName[normalizedHex].toLocaleLowerCase().split("_").join("-");
}

function getHexToColorName(): { [upperHex: string]: string } {
    const ret: { [key: string]: string } = {};
    for (const [name, hex] of Object.entries(Colors)) {
        ret[normalizeHexColor(hex)] = name;
    }
    return ret;
}

const hexToColorName = getHexToColorName();
