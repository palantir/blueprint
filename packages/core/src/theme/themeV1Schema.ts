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

/* eslint-disable sort-keys -- JSON Schema keywords follow conventional schema-document order. */

import {
    BLUEPRINT_THEME_TARGET_MANIFEST,
    BLUEPRINT_THEME_UNSAFE_CSS_VALUE_PATTERN_SOURCE,
    BLUEPRINT_THEME_V1_SCHEMA_URL,
} from "./blueprintTheme";

const CSS_PROPERTY_NAME_PATTERN = "^(?:[a-z][A-Za-z0-9]*|--bp-theme-[a-z0-9]+(?:-[a-z0-9]+)*)$";
const SAFE_CSS_VALUE_PATTERN = `^(?![\\s\\S]*(?:${BLUEPRINT_THEME_UNSAFE_CSS_VALUE_PATTERN_SOURCE}))(?=\\s*\\S)[\\s\\S]+$`;
const TOKEN_NAME_PATTERN = "^--bp-(?!private(?:-|$))[a-z0-9]+(?:-[a-z0-9]+)*$";

const CSS_VALUE_SCHEMA = {
    type: "string",
    pattern: SAFE_CSS_VALUE_PATTERN,
} as const;

const INTERACTION_DECLARATION_SCHEMA = {
    type: "object",
    propertyNames: { pattern: CSS_PROPERTY_NAME_PATTERN },
    additionalProperties: CSS_VALUE_SCHEMA,
} as const;

const createDeclarationSchema = (interactions: readonly string[]) => ({
    type: "object",
    properties: Object.fromEntries(interactions.map(interaction => [interaction, INTERACTION_DECLARATION_SCHEMA])),
    patternProperties: {
        [CSS_PROPERTY_NAME_PATTERN]: CSS_VALUE_SCHEMA,
    },
    additionalProperties: false,
});

const COMPONENT_TARGET_SCHEMAS = Object.fromEntries(
    Object.entries(BLUEPRINT_THEME_TARGET_MANIFEST).map(([targetName, target]) => [
        targetName,
        {
            type: "object",
            properties: Object.fromEntries(
                target.modifiers.map(modifier => [modifier, createDeclarationSchema(target.interactions)]),
            ),
            additionalProperties: false,
        },
    ]),
);

/** JSON Schema bundled with Core for local validation of Blueprint V1 theme documents. */
export const BLUEPRINT_THEME_V1_SCHEMA = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: BLUEPRINT_THEME_V1_SCHEMA_URL,
    title: "Blueprint V1 theme",
    type: "object",
    required: ["$schema", "tokens", "components"],
    properties: {
        $schema: { const: BLUEPRINT_THEME_V1_SCHEMA_URL },
        tokens: {
            type: "object",
            propertyNames: { pattern: TOKEN_NAME_PATTERN },
            additionalProperties: {
                oneOf: [
                    CSS_VALUE_SCHEMA,
                    {
                        type: "object",
                        required: ["light", "dark"],
                        properties: {
                            light: CSS_VALUE_SCHEMA,
                            dark: CSS_VALUE_SCHEMA,
                        },
                        additionalProperties: false,
                    },
                ],
            },
        },
        components: {
            type: "object",
            properties: COMPONENT_TARGET_SCHEMAS,
            additionalProperties: false,
        },
    },
    additionalProperties: false,
} as const;
