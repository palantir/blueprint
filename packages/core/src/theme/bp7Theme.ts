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

import { BLUEPRINT_THEME_V1_SCHEMA_URL, type BlueprintThemeTokenValue, type BlueprintThemeV1 } from "./blueprintTheme";
import { BLUEPRINT_BP7_THEME_TOKENS_DARK } from "./generated/bp7ThemeTokensDark";
import { BLUEPRINT_BP7_THEME_TOKENS_LIGHT } from "./generated/bp7ThemeTokensLight";

/** Complete public BP7 token manifest generated from the same sources as Blueprint's `.bp-next` CSS. */
export const BLUEPRINT_BP7_THEME_TOKENS: Readonly<Record<string, BlueprintThemeTokenValue>> = Object.fromEntries(
    Object.entries(BLUEPRINT_BP7_THEME_TOKENS_LIGHT).map(([tokenName, light]) => {
        // Both generated manifests share one Style Dictionary source, but Object.entries erases that key relationship.
        const dark = BLUEPRINT_BP7_THEME_TOKENS_DARK[tokenName as keyof typeof BLUEPRINT_BP7_THEME_TOKENS_DARK];
        return [tokenName, { dark, light }];
    }),
);

/** Complete BP7 token preset for the provider, whose implicit component-style base is BP6. */
export const BLUEPRINT_BP7_THEME: BlueprintThemeV1 = {
    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
    components: {},
    tokens: BLUEPRINT_BP7_THEME_TOKENS,
};
