/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

// @ts-check

require("@blueprintjs/test-commons/bootstrap");
const React = require("react");

const { generateIsomorphicTests } = require("@blueprintjs/test-commons");

const Popover2Package = require("../lib/cjs");

const requiredChild = React.createElement("button");

describe("Core isomorphic rendering", () => {
    generateIsomorphicTests(Popover2Package, {
        Popover2: {
            children: requiredChild,
        },
        ResizeSensor2: {
            children: requiredChild,
            className: false,
        },
        Tooltip2: {
            props: { content: React.createElement("h1", {}, "content") },
            children: requiredChild,
        },
    });
});
