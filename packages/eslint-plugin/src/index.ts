/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import type { TSESLint } from "@typescript-eslint/utils";

import rules from "./rules";

type ConfigName = "recommended";

const blueprintPlugin = {
    configs: { recommended: {} } as Record<ConfigName, TSESLint.ClassicConfig.Config>,
    flatConfigs: { recommended: {} } as Record<ConfigName, TSESLint.FlatConfig.Config>,
    rules,
};

// The recommended config enables all Blueprint-specific lint rules defined in this package.
const config: TSESLint.ClassicConfig.Config = {
    plugins: ["@blueprintjs"],
    rules: {
        "@blueprintjs/classes-constants": "error",
        "@blueprintjs/html-components": "error",
        "@blueprintjs/no-deprecated-components": "error",
        "@blueprintjs/no-deprecated-type-references": "error",
    },
};
const flatConfig: TSESLint.FlatConfig.Config = {
    ...config,
    plugins: { "@blueprintjs": blueprintPlugin },
};

// Assign the config here so that we can reference blueprintPlugin.
Object.assign(blueprintPlugin.configs.recommended, config);
Object.assign(blueprintPlugin.flatConfigs.recommended, flatConfig);

export = blueprintPlugin;
