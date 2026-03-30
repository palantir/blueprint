/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { describe, expect, it } from "vitest";

import { isHexColor, normalizeHexColor } from "../src/utils/hexColor";

describe("isHexColor", () => {
    it("Accepts valid colors", () => {
        expect(isHexColor("#FFFFFF")).toBe(true);
        expect(isHexColor("#abABab")).toBe(true);
        expect(isHexColor("#abc")).toBe(true);
        expect(isHexColor("#ABc")).toBe(true);
    });

    it("Rejects invalid colors", () => {
        expect(isHexColor("FFFFFF")).toBe(false);
        expect(isHexColor("#FFFFFX")).toBe(false);
        expect(isHexColor("#")).toBe(false);
        expect(isHexColor("#abcde")).toBe(false);
        expect(isHexColor("#FFx")).toBe(false);
    });
});

describe("normalizeHexColor", () => {
    it("Uppercases hex colors", () => {
        expect(normalizeHexColor("#ffaabb")).toBe("#FFAABB");
    });

    it("Converts three letter hexes into six letter hexes", () => {
        expect(normalizeHexColor("#ABC")).toBe("#AABBCC");
    });

    it("Converts lowercase three letter hexes into uppercase six letter hexes", () => {
        expect(normalizeHexColor("#abc")).toBe("#AABBCC");
    });
});
