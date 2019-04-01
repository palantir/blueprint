/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";

import { removeNonHTMLProps } from "../../src/common/props";

describe("Props", () => {
    describe("removeNonHTMLProps", () => {
        let props: { [key: string]: boolean };

        beforeEach(() => {
            props = {
                apple: true,
                banana: true,
                cat: true,
                containerRef: true,
                elementRef: true,
                icon: true,
                intent: true,
                round: true,
                text: true,
            };
        });

        it("removes only from curated blacklist when supplied 1 argument", () => {
            assert.deepEqual(removeNonHTMLProps(props), {
                apple: true,
                banana: true,
                cat: true,
            });
        });

        it("removes only from the supplied array when supplied 2 arguments", () => {
            assert.deepEqual(removeNonHTMLProps(props, ["apple", "banana"]), {
                cat: true,
                containerRef: true,
                elementRef: true,
                icon: true,
                intent: true,
                round: true,
                text: true,
            });
        });

        it("removes from the curated blacklist and the supplied array when shouldMerge=true", () => {
            assert.deepEqual(removeNonHTMLProps(props, ["apple", "banana"], true), { cat: true });
        });
    });
});
