/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

export enum CssSyntax {
    SASS = "sass",
    LESS = "less",
    OTHER = "other",
}

export const CssExtensionMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "scss",
    [CssSyntax.LESS]: "less",
};

export const BpVariablePrefixMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "$",
    [CssSyntax.LESS]: "@",
};

export const BpPrefixVariableMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "#{$bp-ns}",
    [CssSyntax.LESS]: "@{bp-ns}",
};

export const BpVariableImportMap: Record<Exclude<CssSyntax, CssSyntax.OTHER>, string> = {
    [CssSyntax.SASS]: "~@blueprintjs/core/lib/scss/variables",
    [CssSyntax.LESS]: "~@blueprintjs/core/lib/less/variables",
};

/**
 * Returns the flavor of the CSS we're dealing with.
 */
export function getCssSyntax(fileName: string): CssSyntax {
    for (const cssSyntax of Object.keys(CssExtensionMap)) {
        if (fileName.endsWith(`.${CssExtensionMap[cssSyntax as Exclude<CssSyntax, CssSyntax.OTHER>]}`)) {
            return cssSyntax as Exclude<CssSyntax, CssSyntax.OTHER>;
        }
    }
    return CssSyntax.OTHER;
}

export const isCssSyntaxToStringMap = (obj: unknown): obj is { [S in CssSyntax]?: string } => {
    if (typeof obj !== "object" || obj == null) {
        return false;
    }
    // Check that the keys and their values are correct
    const allowedKeys = new Set<string>(Object.values(CssSyntax).filter(v => v !== CssSyntax.OTHER));
    return Object.keys(obj).every(key => allowedKeys.has(key) && typeof (obj as any)[key] === "string");
};
