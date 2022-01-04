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

// tslint:disable object-literal-sort-keys
/* eslint-disable no-template-curly-in-string */

import { TSESLint } from "@typescript-eslint/experimental-utils";
import dedent from "dedent";

import { classesConstantsRule } from "../src/rules/classes-constants";

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

console.info("Testing classes-constants rule...");
ruleTester.run("classes-constants", classesConstantsRule, {
    invalid: [
        // literal string
        {
            code: dedent`<div className="pt-fill" />`,
            errors: [{ messageId: "useBlueprintClasses", column: 16, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                <div className={Classes.FILL} />
            `,
        },
        // literal string with other classes
        {
            code: `<div className="pt-fill and-some-other-things" />`,
            errors: [{ messageId: "useBlueprintClasses", column: 16, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                <div className={${"`${Classes.FILL} and-some-other-things`"}} />
            `,
        },

        // literal string inside curly brackets
        {
            code: `<div className={"pt-fill"} />`,
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                <div className={Classes.FILL} />
            `,
        },
        // literal string and other classes inside curly brackets
        {
            code: `<div className={"pt-fill and-some-other-things"} />`,
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                <div className={${"`${Classes.FILL} and-some-other-things`"}} />
            `,
        },

        // template string
        {
            code: "<div className={`pt-fill`} />",
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                <div className={Classes.FILL} />
            `,
        },
        // template string and other classes
        {
            code: "<div className={`pt-fill and-some-other-things`} />",
            errors: [{ messageId: "useBlueprintClasses", column: 17, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                <div className={${"`${Classes.FILL} and-some-other-things`"}} />
            `,
        },

        // function usage
        {
            code: `classNames("pt-fill");`,
            errors: [{ messageId: "useBlueprintClasses", column: 12, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                classNames(Classes.FILL);
            `,
        },

        // array index usage
        {
            code: `classNames["pt-fill"] = true;`,
            errors: [{ messageId: "useBlueprintClasses", column: 12, line: 1 }],
            output: dedent`
                import { Classes } from "@blueprintjs/core";

                classNames[Classes.FILL] = true;
            `,
        },

        // adding import to existing import

        {
            code: dedent`
                import { Dialog } from "@blueprintjs/core";

                classNames["pt-fill"] = true;
            `,
            errors: [{ messageId: "useBlueprintClasses", column: 12, line: 3 }],
            output: dedent`
                import { Classes, Dialog } from "@blueprintjs/core";

                classNames[Classes.FILL] = true;
            `,
        },

        // adding import in alphabetical order
        {
            code: dedent`
                import { Something } from "@a/somewhere";
                import { SomethingElse } from "somewhere";

                classNames["pt-fill"] = true;
            `,
            errors: [{ messageId: "useBlueprintClasses", column: 12, line: 4 }],
            output: dedent`
                import { Something } from "@a/somewhere";
                import { Classes } from "@blueprintjs/core";
                import { SomethingElse } from "somewhere";

                classNames[Classes.FILL] = true;
            `,
        },
    ],
    valid: [
        "<div className={Classes.FILL} />",
        '<div className="my-own-class" />',
        '<div className={"my-own-class"} />',
        "<div className={`my-own-class`} />",

        // it should not touch icons as theyre handled by a different rule
        '<div className="pt-icon-folder-open" />',

        // don't flag strings in export/import statements
        'import { test } from "packagewithpt-thatshouldnterror";',
        'export { test } from "packagewithpt-thatshouldnterror";',

        // don't flag non applicable strings in function calls
        `myFunction("stringwithpt-thatshouldnt-error");`,
        "myFunction(`stringwithpt-thatshouldnt-error`);",
    ],
});
