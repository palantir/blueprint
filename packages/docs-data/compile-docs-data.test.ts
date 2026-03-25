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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { interpolateClassNamespace, transformDocumentalistData } from "./compile-docs-data.mts";

describe("interpolateClassNamespace", () => {
    it("replaces #{$ns} and @ns with the default class namespace", () => {
        expect(interpolateClassNamespace("#{$ns}-button")).toBe("bp6-button");
        expect(interpolateClassNamespace("@ns-icon")).toBe("bp6-icon");
        expect(interpolateClassNamespace("#{$ns}-card @ns-elevation")).toBe("bp6-card bp6-elevation");
    });
});

describe("transformDocumentalistData", () => {
    it('keeps only the highest version per major and reverses the list when key is "versions"', () => {
        const versions = ["1.0.0", "1.2.3", "2.0.0", "2.1.0", "3.0.0-beta.1", "3.0.0", "3.1.4"];
        const result = transformDocumentalistData("versions", versions);
        expect(result).toEqual(["3.1.4", "2.1.0", "1.2.3"]);
    });

    it("returns non-string, non-versions values unchanged", () => {
        const obj = { foo: "bar" };
        expect(transformDocumentalistData("someKey", obj)).toBe(obj);
        expect(transformDocumentalistData("count", 42)).toBe(42);
    });
});
