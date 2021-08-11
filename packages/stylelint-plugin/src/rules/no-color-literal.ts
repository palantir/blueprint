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

import postcss, { Root, Result } from "postcss";
import valueParser from "postcss-value-parser";
import stylelint, { RuleTesterContext } from "stylelint";
import type { Plugin } from "stylelint";

import { Colors } from "@blueprintjs/core";

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
    expected: (unfixed: string, fixed: string) => `Use the \`${fixed}\` variable instead of the \`${unfixed}\` literal`,
});

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
                variablesImportPath: isCssSyntaxToStringMap,
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
            const normalizedHex = normalizeHexColor(value);
            if (hexToColorName[normalizedHex] == null) {
                return;
            }
            const fixed = BpVariablePrefixMap[cssSyntax] + hexToColorName[normalizedHex].toLocaleLowerCase();
            if ((context as any).fix && !disableFix) {
                assertBpVariablesImportExists(cssSyntax);
                node.value = fixed;
                needsFix = true;
            } else {
                stylelint.utils.report({
                    index: declarationValueIndex(decl) + node.sourceIndex,
                    message: messages.expected(value, fixed),
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
}) as Plugin);

function declarationValueIndex(decl: postcss.Declaration) {
    const beforeColon = decl.toString().indexOf(":");
    const afterColon = decl.raw("between").length - decl.raw("between").indexOf(":");
    return beforeColon + afterColon;
}

function getHexToColorName(): { [upperHex: string]: string } {
    const ret: { [key: string]: string } = {};
    for (const [name, hex] of Object.entries(Colors)) {
        ret[normalizeHexColor(hex)] = name;
    }
    return ret;
}

const hexToColorName = getHexToColorName();
