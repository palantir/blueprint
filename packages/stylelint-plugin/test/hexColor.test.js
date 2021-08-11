/* Copyright 2020 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require("chai");

const { isHexColor, normalizeHexColor } = require("../lib/utils/hexColor");

describe("isHexColor", () => {
    it("Accepts valid colors", () => {
        expect(isHexColor("#FFFFFF")).to.be.true;
        expect(isHexColor("#abABab")).to.be.true;
        expect(isHexColor("#abc")).to.be.true;
        expect(isHexColor("#ABc")).to.be.true;
    });

    it("Rejects invalid colors", () => {
        expect(isHexColor("FFFFFF")).to.be.false;
        expect(isHexColor("#FFFFFX")).to.be.false;
        expect(isHexColor("#")).to.be.false;
        expect(isHexColor("#abcde")).to.be.false;
        expect(isHexColor("#FFx")).to.be.false;
    });
});

describe("normalizeHexColor", () => {
    it("Uppercases hex colors", () => {
        expect(normalizeHexColor("#ffaabb")).to.be.eq("#FFAABB");
    });

    it("Converts three letter hexes into six letter hexes", () => {
        expect(normalizeHexColor("#ABC")).to.be.eq("#AABBCC");
    });

    it("Converts lowercase three letter hexes into uppercase six letter hexes", () => {
        expect(normalizeHexColor("#abc")).to.be.eq("#AABBCC");
    });
});
