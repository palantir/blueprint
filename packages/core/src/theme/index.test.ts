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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    BLUEPRINT_BP7_THEME,
    BLUEPRINT_BP7_THEME_TOKENS,
    BLUEPRINT_THEME_TARGET_MANIFEST,
    BLUEPRINT_THEME_V1_SCHEMA,
    BLUEPRINT_THEME_V1_SCHEMA_URL,
    BlueprintThemeProvider,
    compileBlueprintTheme,
    parseBlueprintTheme,
} from "../index";

describe("Blueprint theme public API", () => {
    it("exports the V1 contract, parser, compiler, BP7 preset, and provider from Core", () => {
        expect(BLUEPRINT_THEME_V1_SCHEMA.$id).toBe(BLUEPRINT_THEME_V1_SCHEMA_URL);
        expect(BLUEPRINT_THEME_TARGET_MANIFEST.button).toBeDefined();
        expect(BLUEPRINT_BP7_THEME_TOKENS["--bp-button-font-size"]).toBeDefined();
        expect(BLUEPRINT_BP7_THEME.tokens).toBe(BLUEPRINT_BP7_THEME_TOKENS);
        expect(parseBlueprintTheme).toBeTypeOf("function");
        expect(compileBlueprintTheme).toBeTypeOf("function");
        expect(BlueprintThemeProvider).toBeDefined();
    });
});
