/*!
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

// tslint:disable: blueprint-classes-constants
// tslint:disable: no-invalid-template-strings

import { TSESLint } from "@typescript-eslint/experimental-utils";
import { classesConstantsRule } from "../classes-constants";

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run("classes-constants", classesConstantsRule, {
    invalid: [
        {
            code: `<div className="pt-fill" />`,
            errors: [{ messageId: "useBlueprintClasses", column: 16, line: 1 }],
            output: `<div className={Classes.FILL} />`,
        },
        {
            code: `<div className="pt-fill and-some-other-things" />`,
            errors: [{ messageId: "useBlueprintClasses", column: 16, line: 1 }],
            output: "<div className={`${Classes.FILL} and-some-other-things`} />",
        },

        {
            code: `<div className={"pt-fill"} />`,
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: `<div className={Classes.FILL} />`,
        },
        {
            code: `<div className={"pt-fill and-some-other-things"} />`,
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: "<div className={`${Classes.FILL} and-some-other-things`} />",
        },

        {
            code: "<div className={`pt-fill`} />",
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: "<div className={Classes.FILL} />",
        },
        {
            code: "<div className={`pt-fill and-some-other-things`} />",
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: "<div className={`${Classes.FILL} and-some-other-things`} />",
        },

        {
            code: `classNames("pt-fill")`,
            errors: [{ messageId: "useBlueprintClasses", column: 12, line: 1 }],
            output: "classNames(Classes.FILL)",
        },

        {
            code: `classNames["pt-fill"] = true`,
            errors: [{ messageId: "useBlueprintClasses", column: 12, line: 1 }],
            output: "classNames[Classes.FILL] = true",
        },
    ],
    valid: [
        "<div className={Classes.FILL} />",
        '<div className="my-own-class" />',
        '<div className={"my-own-class"} />',
        "<div className={`my-own-class`} />",

        // it should not touch icons as theyre handled by a different rule
        '<div className="pt-icon-folder-open" />',
    ],
});
