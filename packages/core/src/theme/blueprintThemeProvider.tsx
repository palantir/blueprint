/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
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

import { memo, useEffect, useId, useMemo, useState } from "react";

import { Classes } from "../common";

import {
    BLUEPRINT_THEME_V1_SCHEMA_URL,
    type BlueprintThemeV1,
    type BlueprintThemeValidationResult,
    parseBlueprintTheme,
} from "./blueprintTheme";
import { BlueprintThemeContext, type BlueprintThemeContextValue } from "./blueprintThemeContext";
import { compileBlueprintTheme } from "./compileBlueprintTheme";

export type BlueprintThemeColorScheme = "light" | "dark";

export interface BlueprintThemeProviderProps {
    readonly children?: React.ReactNode;
    readonly colorScheme?: BlueprintThemeColorScheme;
    /** A typed theme, decoded unknown input, or JSON string. Invalid updates keep the provider usable. */
    readonly theme?: unknown;
}

const EMPTY_THEME: BlueprintThemeV1 = {
    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
    components: {},
    tokens: {},
};

/** Applies one Blueprint V1 theme over BP6 defaults to a DOM subtree and its Blueprint portals. */
export const BlueprintThemeProvider = memo(function BlueprintThemeProviderFn({
    children,
    colorScheme = "light",
    theme = EMPTY_THEME,
}: BlueprintThemeProviderProps) {
    const reactId = useId();
    // React IDs contain punctuation that is valid in HTML but awkward in CSS selectors; the prefix also guarantees a letter.
    const scopeId = useMemo(() => `bp-theme-${reactId.replace(/[^A-Za-z0-9_-]/g, "")}`, [reactId]);
    const validationResult = useMemo<BlueprintThemeValidationResult>(() => parseBlueprintTheme(theme), [theme]);
    const emptyCss = useMemo(() => compileBlueprintTheme({ scopeId, theme: EMPTY_THEME }), [scopeId]);
    const compiledCss = useMemo(() => {
        return validationResult.isValid ? compileBlueprintTheme({ scopeId, theme: validationResult.theme }) : undefined;
    }, [scopeId, validationResult]);
    const [lastValidCss, setLastValidCss] = useState(emptyCss);

    useEffect(
        function cacheLastValidTheme() {
            if (compiledCss !== undefined) {
                setLastValidCss(compiledCss);
            }
        },
        [compiledCss],
    );

    const css = compiledCss ?? lastValidCss;
    const className = colorScheme === "dark" ? Classes.DARK : undefined;
    const contextValue = useMemo<BlueprintThemeContextValue>(() => ({ colorScheme, scopeId }), [colorScheme, scopeId]);

    return (
        <BlueprintThemeContext.Provider value={contextValue}>
            <div className={className} data-bp-color-scheme={colorScheme} data-bp-theme={scopeId}>
                <style data-bp-theme-styles={scopeId}>{css}</style>
                {children}
            </div>
        </BlueprintThemeContext.Provider>
    );
});
