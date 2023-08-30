/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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

import { ESLintUtils } from "@typescript-eslint/utils";

// N.B. We need an explicit type annotation because of the following error:
// The inferred type of 'createRule' cannot be named without a reference to '../../../../../node_modules/@typescript-eslint/utils/dist/ts-eslint/Rule'. This is likely not portable. A type annotation is necessary.ts(2742)

/** Create a rule and automatically fill its url based on the rule name. */
export const createRule: ReturnType<typeof ESLintUtils.RuleCreator> = ESLintUtils.RuleCreator(
    name => `https://github.com/palantir/blueprint/tree/develop/packages/eslint-plugin/src/rules/${name}.ts`,
);
