/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Utils } from "../src/common/utils";
import { expect } from "chai";

describe("Utils", () => {
    describe("toBase26Alpha", () => {
        it("converts to spreadsheet-like base26", () => {
            expect(Utils.toBase26Alpha(0)).to.equal("A");
            expect(Utils.toBase26Alpha(25)).to.equal("Z");
            expect(Utils.toBase26Alpha(26)).to.equal("AA");
            expect(Utils.toBase26Alpha(27)).to.equal("AB");
            expect(Utils.toBase26Alpha((26 + 1) * 26 - 1)).to.equal("ZZ");
            expect(Utils.toBase26Alpha((26 + 1) * 26)).to.equal("AAA");
        });
    });

    describe("binarySearch", () => {
        it("returns 0 for empty list", () => {
            const arr = [] as number[];
            const lookup = (i: number) => arr[i];

            expect(Utils.binarySearch(10, 0, lookup)).to.equal(0);
            expect(Utils.binarySearch(0, 0, lookup)).to.equal(0);
            expect(Utils.binarySearch(-10, 0, lookup)).to.equal(0);
        });

        it("returns max index if number is high", () => {
            const arr = [10, 20, 30, 30, 40];
            const lookup = (i: number) => arr[i];

            expect(Utils.binarySearch(1000, arr.length, lookup)).to.equal(arr.length);
        });

        it("returns min index if number is low", () => {
            const arr = [10, 20, 30, 30, 40];
            const lookup = (i: number) => arr[i];

            expect(Utils.binarySearch(-1000, arr.length, lookup)).to.equal(0);
        });

        it("returns index of exact match", () => {
            const arr = [10, 20, 30, 30, 40];
            const lookup = (i: number) => arr[i];

            expect(Utils.binarySearch(20, arr.length, lookup)).to.equal(1);
            expect(Utils.binarySearch(40, arr.length, lookup)).to.equal(4);
        });

        it("returns lowest index of multiple exact matches", () => {
            expect(Utils.binarySearch(30, 5, (i: number) => [10, 20, 30, 30, 40][i])).to.equal(2);
            expect(Utils.binarySearch(30, 5, (i: number) => [10, 11, 12, 30, 30][i])).to.equal(3);
            expect(Utils.binarySearch(30, 5, (i: number) => [30, 30, 30, 50, 60][i])).to.equal(0);
        });

        it("returns insertion index if no match", () => {
            const arr = [10, 20, 30, 30, 40];
            const lookup = (i: number) => arr[i];

            expect(Utils.binarySearch(19, arr.length, lookup)).to.equal(1);
            expect(Utils.binarySearch(21, arr.length, lookup)).to.equal(2);
        });
    });

    describe("times", () => {
        it("returns empty array for 0", () => {
            const arr = Utils.times(0, () => "test");
            expect(arr).to.deep.equal([]);
        });

        it("returns array of correct length", () => {
            const arr = Utils.times(4, () => "test");
            expect(arr).to.deep.equal(["test", "test", "test", "test"]);
        });

        it("uses argument length", () => {
            const arr = Utils.times(4, (i: number) => "test" + i);
            expect(arr).to.deep.equal(["test0", "test1", "test2", "test3"]);
        });
    });

    describe("arrayOfLength", () => {
        it("truncates if too long", () => {
            const original = Utils.times(5, () => "A");
            const result = Utils.arrayOfLength(original, 2, "B");

            expect(result).to.have.lengthOf(2);
            expect(result).to.deep.equal(["A", "A"]);
        });

        it("expands if too short", () => {
            const original = Utils.times(2, () => "A");
            const result = Utils.arrayOfLength(original, 5, "B");

            expect(result).to.have.lengthOf(5);
            expect(result).to.deep.equal(["A", "A", "B", "B", "B"]);
        });

        it("just copies if length is correct", () => {
            const original = Utils.times(5, () => "A");
            const result = Utils.arrayOfLength(original, 5, "B");

            expect(result).to.not.equal(original);
            expect(result).to.have.lengthOf(5);
            expect(result).to.deep.equal(["A", "A", "A", "A", "A"]);
        });
    });

    describe("assignSparseValues", () => {
        it("checks null and array length", () => {
            const defaults = Utils.times(3, () => "A");

            expect(Utils.assignSparseValues(defaults, null)).to.equal(defaults);
            expect(Utils.assignSparseValues(defaults, ["B"])).to.equal(defaults);
        });

        it("overrides with sparse values", () => {
            const defaults = Utils.times(3, () => "A");
            const result = Utils.assignSparseValues(defaults, [null, "B", null]);

            expect(result).to.deep.equal(["A", "B", "A"]);
        });
    });

});
