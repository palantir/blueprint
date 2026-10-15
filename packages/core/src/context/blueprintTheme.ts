/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { createContext, type CSSProperties, useMemo } from "react";

/** Theme settings translated to Blueprint CSS tokens. Unspecified settings retain Blueprint defaults. */
export interface BlueprintTheme {
    borderRadius?: "SQUARE" | "REGULAR" | "ROUNDED";
}

export type BlueprintThemeTokens = CSSProperties & Record<`--bp-${string}`, string>;

/** Apply these tokens to the application's root element to theme non-portal content. */
export const BlueprintThemeContext = createContext<BlueprintThemeTokens | undefined>(undefined);

export function useBlueprintTheme(theme: BlueprintTheme | undefined, enabled: boolean) {
    return useMemo(() => {
        if (!enabled || theme == null) {
            return undefined;
        }
        const result: BlueprintThemeTokens = {};
        switch (theme.borderRadius) {
            case "SQUARE":
                result["--bp-surface-border-radius"] = "0px";
                break;
            case "REGULAR":
                result["--bp-surface-border-radius"] = "4px";
                break;
            case "ROUNDED":
                result["--bp-surface-border-radius"] = "8px";
                break;
        }
        return result;
    }, [enabled, theme]);
}
