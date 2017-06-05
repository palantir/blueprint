/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { IKeyBlacklist, IKeyWhitelist, Utils } from "../src/common/utils";

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

    describe("guideIndexToReorderedIndex", () => {
        describe("leaving the thing in place", () => {
            runTest(0, 0, 1, 0);
            runTest(1, 1, 2, 1);
            runTest(10, 10, 5, 10);
        });

        describe("moving the thing one place to the right", () => {
            runTest(0, 2, 1, 1);
            runTest(0, 3, 2, 1);
            runTest(0, 6, 5, 1);
        });

        // test moving the thing one place to the left
        describe("moving the thing one place to the left", () => {
            runTest(1, 0, 1, 0);
            runTest(4, 3, 2, 3);
            runTest(20, 19, 5, 19);
        });

        describe("moving the thing two places to the right", () => {
            runTest(0, 3, 1, 2);
            runTest(4, 8, 2, 6);
            runTest(10, 17, 5, 12);
        });

        describe("moving the thing two places to the left", () => {
            runTest(2, 0, 1, 0);
            runTest(4, 2, 2, 2);
            runTest(20, 18, 5, 18);
        });

        describe("moving the thing within itself (no-op)", () => {
            runTest(2, 3, 2, 2);
            runTest(10, 14, 5, 10);
        });

        function runTest(oldIndex: number, newIndex: number, length: number, expectedResult: number) {
            it(`(oldIndex: ${oldIndex}, newIndex: ${newIndex}, length: ${length}) => ${expectedResult}`, () => {
                const actualResult = Utils.guideIndexToReorderedIndex(oldIndex, newIndex, length);
                expect(actualResult).to.equal(expectedResult);
            });
        }
    });

    describe("reorderedIndexToGuideIndex", () => {
        describe("leaving the thing in place", () => {
            runTest(0, 0, 1, 0);
            runTest(1, 1, 2, 1);
            runTest(10, 10, 5, 10);
        });

        describe("moving the thing one place to the right", () => {
            runTest(0, 1, 1, 2);
            runTest(0, 1, 2, 3);
            runTest(0, 1, 5, 6);
        });

        describe("moving the thing one place to the left", () => {
            runTest(1, 0, 1, 0);
            runTest(4, 3, 2, 3);
            runTest(20, 19, 5, 19);
        });

        describe("moving the thing two places to the right", () => {
            runTest(0, 2, 1, 3);
            runTest(4, 6, 2, 8);
            runTest(10, 12, 5, 17);
        });

        describe("moving the thing two places to the left", () => {
            runTest(2, 0, 1, 0);
            runTest(4, 2, 2, 2);
            runTest(20, 18, 5, 18);
        });

        function runTest(oldIndex: number, newIndex: number, length: number, expectedResult: number) {
            it(`(oldIndex: ${oldIndex}, newIndex: ${newIndex}, length: ${length}) => ${expectedResult}`, () => {
                const actualResult = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
                expect(actualResult).to.equal(expectedResult);
            });
        }
    });

    describe("isLeftClick", () => {
        const LEFT_BUTTON_CODE = 0;
        const RIGHT_BUTTON_CODE = 1;

        it("returns true for left click", () => {
            expect(Utils.isLeftClick({ button: LEFT_BUTTON_CODE } as MouseEvent)).to.be.true;
        });

        it("returns false for right click", () => {
            expect(Utils.isLeftClick({ button: RIGHT_BUTTON_CODE } as MouseEvent)).to.be.false;
        });
    });

    describe("reorderArray", () => {
        const ARRAY_STRING = "ABCDEFG";
        const ARRAY = ARRAY_STRING.split("");
        const ARRAY_LENGTH = ARRAY.length;
        const FIRST_INDEX = 0;
        const LAST_INDEX = ARRAY_LENGTH - 1;
        const LENGTH = 3;

        describe("reorders a single element properly", () => {
            it("when moved from index 0", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, FIRST_INDEX, 2), "BCADEFG");
            });
            it("when moved from a middle index leftward", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 3, 1), "ADBCEFG");
            });
            it("when moved from a middle index rightward", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 3, 5), "ABCEFDG");
            });
            it("when moved from the end", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, LAST_INDEX, LAST_INDEX - 2), "ABCDGEF");
            });
        });

        describe("reorders multiple elements properly", () => {
            it("when moved from index 0", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, FIRST_INDEX, 2, LENGTH), "DEABCFG");
            });
            it("when moved from a middle index leftward", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 3, 1, LENGTH), "ADEFBCG");
            });
            it("when moved from a middle index rightward", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 2, 4, LENGTH), "ABFGCDE");
            });
            it("when moved from the end", () => {
                const fromIndex = LAST_INDEX - LENGTH + 1; // the index that yields the last LENGTH elements
                assertArraysEqual(Utils.reorderArray(ARRAY, fromIndex, fromIndex - 2, LENGTH), "ABEFGCD");
            });
        });

        describe("edge cases", () => {
            it("returns undefined if length < 0", () => {
                expect(Utils.reorderArray(ARRAY, 0, 1, -1)).to.be.undefined;
            });
            it("returns undefined if length > array.length", () => {
                expect(Utils.reorderArray(ARRAY, 0, 1, ARRAY_LENGTH + 1)).to.be.undefined;
            });
            it("returns undefined if from + length > array.length", () => {
                const fromIndex = LAST_INDEX - LENGTH + 2; // one spot too far to the right
                expect(Utils.reorderArray(ARRAY, fromIndex, fromIndex - 1, LENGTH)).to.be.undefined;
            });
            it("returns an unchanged copy of the array if length === 0", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 0, 1, 0), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 0, 2, 0), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 1, 3, 0), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 3, 1, 0), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, LAST_INDEX, LAST_INDEX - 1, 0), ARRAY_STRING);
            });
            it("returns an unchanged copy of the array if length === array.length", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 0, 1, ARRAY_LENGTH), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 0, 2, ARRAY_LENGTH), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 1, 3, ARRAY_LENGTH), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 3, 1, ARRAY_LENGTH), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, LAST_INDEX, LAST_INDEX - 1, ARRAY_LENGTH), ARRAY_STRING);
            });
            it("returns an unchanged copy of the array if from === to", () => {
                assertArraysEqual(Utils.reorderArray(ARRAY, 0, 0), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 1, 1), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 3, 3, ARRAY_LENGTH), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, 4, 4, ARRAY_LENGTH), ARRAY_STRING);
                assertArraysEqual(Utils.reorderArray(ARRAY, LAST_INDEX, LAST_INDEX), ARRAY_STRING);
            });
        });

        function assertArraysEqual(result: string[], expected: string) {
            // use .eql to deeply compare arrays
            expect(result).to.eql(expected.split(""));
        }
    });

    describe("deepCompareKeys", () => {
        // tslint:disable:max-classes-per-file
        class DVD {
            public constructor() { /* Empty */ }
        }

        class VHSTape {
            public constructor() { /* Empty */ }
        }
        // tslint:enable:max-classes-per-file

        describe("with `keys` defined", () => {
            describe("returns true if only the specified values are deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new DVD();

                runTest(true, { a: 1 }, { a: 1 }, ["a", "b", "c", "d"]);
                runTest(true, { a: customInstance1 }, { a: customInstance2 }, ["a"]);
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, ["b", "c"]);
                runTest(true, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 1 }}, ["b", "c"]);
            });

            describe("returns false if any specified values are not deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new VHSTape();

                runTest(false, { a: [1, "2", true] }, { a: [1, "2", false] }, ["a"]);
                runTest(false, { a: customInstance1 }, { a: customInstance2 }, ["a"]);
                runTest(false, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 2 }}, ["a", "b", "c"]);
            });

            describe("edge cases that return true", () => {
                runTest(true, undefined, null, []);
                runTest(true, undefined, undefined, ["a"]);
                runTest(true, null, null, ["a"]);
                runTest(true, {}, {}, ["a"]);
            });

            describe("edge cases that return false", () => {
                runTest(false, {}, undefined, []);
                runTest(false, {}, [], []);
            });

            function runTest(expectedResult: boolean, a: any, b: any, keys: string[]) {
                it(`${JSON.stringify(a)} and ${JSON.stringify(b)} (keys: ${JSON.stringify(keys)})`, () => {
                    expect(Utils.deepCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` not defined", () => {
            describe("returns true if values are deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new DVD();

                runTest(true, { a: 1, b: "2", c: true }, { a: 1, b: "2", c: true });
                runTest(true, { a: 1, b: "2", c: { a: 1, b: "2" } }, { a: 1, b: "2", c: { a: 1, b: "2" } });
                runTest(true, [1, "2", true], [1, "2", true]);
                runTest(true, 1, 1);
                runTest(true, customInstance1, customInstance2);
                runTest(true, "2", "2");
                runTest(true, undefined, undefined);
                runTest(true, null, undefined);
            });

            describe("returns false if values are not deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new VHSTape();

                runTest(false, undefined, {});
                runTest(false, null, {});
                runTest(false, {}, []);
                runTest(false, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: "1" }});
                runTest(false, customInstance1, customInstance2);
            });

            describe("returns false if keys are different", () => {
                runTest(false, {}, { a: 1 });
                runTest(false, { a: 1, b: "2" }, { b: "2" });
                runTest(false, { a: 1, b: "2", c: true}, { b: "2", c: true, d: 3 });
            });

            describe("returns true if same deeply-comparable instance is reused in both objects", () => {
                const deeplyComparableThing1 = { a: 1 };
                const deeplyComparableThing2 = [1, "2", true];
                runTest(true, { a: 1, b: deeplyComparableThing1 }, { a: 1, b: deeplyComparableThing1 });
                runTest(true, { a: 1, b: deeplyComparableThing2 }, { a: 1, b: deeplyComparableThing2 });
            });

            function runTest(expectedResult: boolean, a: any, b: any) {
                it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
                    expect(Utils.deepCompareKeys(a, b)).to.equal(expectedResult);
                });
            }
        });
    });

    describe("shallowCompareKeys", () => {
        interface IKeys {
            a?: any;
            b?: any;
            c?: any;
            d?: any;
        }

        describe("with `keys` defined as whitelist", () => {
            describe("returns true if only the specified values are shallowly equal", () => {
                runTest(true, { a: 1 }, { a: 1 }, wl(["a", "b", "c", "d"]));
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, wl(["a", "c"]));
                runTest(true, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 1 }}, wl(["a", "b"]));
            });

            describe("returns false if any specified values are not shallowly equal", () => {
                runTest(false, { a: [1, "2", true] }, { a: [1, "2", true] }, wl(["a"]));
                runTest(false, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 1 }}, wl(["a", "b", "c"]));
                runTest(false, { a: 1, c: { a: 1 }}, { a: 1, b: "2" }, wl(["a", "b"]));
            });

            describe("edge cases that return true", () => {
                runTest(true, undefined, null, wl([]));
                runTest(true, undefined, undefined, wl(["a"]));
                runTest(true, null, null, wl(["a"]));
                runTest(true, {}, {}, wl(["a"]));
            });

            describe("edge cases that return false", () => {
                runTest(false, {}, undefined, wl([]));
                runTest(false, {}, [], wl([]));
                runTest(false, [], [], wl([]));
            });

            function runTest(expectedResult: boolean,
                             a: any,
                             b: any,
                             keys: IKeyBlacklist<IKeys> | IKeyWhitelist<IKeys>) {
                it(`${JSON.stringify(a)} and ${JSON.stringify(b)} (keys: ${JSON.stringify(keys)})`, () => {
                    expect(Utils.shallowCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` defined as blacklist", () => {
            describe("returns true if only the specified values are shallowly equal", () => {
                runTest(true, { a: 1 }, { a: 1 }, bl(["b", "c", "d"]));
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, bl(["b"]));
                runTest(true, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 1 }}, bl(["c"]));
            });

            describe("returns false if any specified values are not shallowly equal", () => {
                runTest(false, { a: [1, "2", true] }, { a: [1, "2", true] }, bl(["b, c"]));
                runTest(false, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 1 }}, bl(["a", "b", "d"]));
                runTest(false, { a: 1, c: { a: 1 }}, { a: 1, b: "2" }, bl(["c"]));
            });

            describe("edge cases that return true", () => {
                runTest(true, undefined, null, bl([]));
                runTest(true, undefined, undefined, bl(["a"]));
                runTest(true, null, null, bl(["a"]));
                runTest(true, {}, {}, bl(["a"]));
            });

            describe("edge cases that return false", () => {
                runTest(false, {}, undefined, bl([]));
                runTest(false, {}, [], bl([]));
                runTest(false, [], [], bl([]));
            });

            function runTest(expectedResult: boolean,
                             a: any,
                             b: any,
                             keys: IKeyBlacklist<IKeys> | IKeyWhitelist<IKeys>) {
                it(`${JSON.stringify(a)} and ${JSON.stringify(b)} (keys: ${JSON.stringify(keys)})`, () => {
                    expect(Utils.shallowCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` not defined", () => {
            describe("returns true if values are shallowly equal", () => {
                runTest(true, { a: 1, b: "2", c: true}, { a: 1, b: "2", c: true});
                runTest(true, undefined, undefined);
                runTest(true, null, undefined);
            });

            describe("returns false if values are not shallowly equal", () => {
                runTest(false, undefined, {});
                runTest(false, null, {});
                runTest(false, {}, []);
                runTest(false, { a: 1, b: "2", c: { a: 1 }}, { a: 1, b: "2", c: { a: 1 }});
            });

            describe("returns false if keys are different", () => {
                runTest(false, {}, { a: 1 });
                runTest(false, { a: 1, b: "2" }, { b: "2" });
                runTest(false, { a: 1, b: "2", c: true}, { b: "2", c: true, d: 3 });
            });

            describe("returns true if same deeply-comparable instance is reused in both objects", () => {
                const deeplyComparableThing1 = { a: 1 };
                const deeplyComparableThing2 = [1, "2", true];
                runTest(true, { a: 1, b: deeplyComparableThing1 }, { a: 1, b: deeplyComparableThing1 });
                runTest(true, { a: 1, b: deeplyComparableThing2 }, { a: 1, b: deeplyComparableThing2 });
            });

            function runTest(expectedResult: boolean, a: any, b: any) {
                it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
                    expect(Utils.shallowCompareKeys(a, b)).to.equal(expectedResult);
                });
            }
        });

        /**
         * A compactly named function for converting a string array to a key blacklist.
         */
        function bl(keys: string[]) {
            return { exclude: keys } as IKeyBlacklist<IKeys>;
        }

        /**
         * A compactly named function for converting a string array to a key whitelist.
         */
        function wl(keys: string[]) {
            return { include: keys } as IKeyWhitelist<IKeys>;
        }
    });

    describe("arraysEqual", () => {
        describe("no compare function provided", () => {
            describe("should return true if the arrays are shallowly equal", () => {
                runTest(true, undefined, undefined);
                runTest(true, undefined, null);
                runTest(true, [3, "1", true], [3, "1", true]);
            });

            describe("should return false if the arrays are not shallowly equal", () => {
                runTest(false, null, [3]);
                runTest(false, [3, 1, 2], [3, 1]);
                runTest(false, [{ x: 1 }], [{ x: 1 }]);
            });
        });

        describe("compare function provided", () => {
            const COMPARE_FN = (a: any, b: any) => a.x === b.x;

            describe("should return true if the arrays are equal using a custom compare function", () => {
                runTest(true, undefined, undefined, COMPARE_FN);
                runTest(true, undefined, null, COMPARE_FN);
                runTest(true, [{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }], COMPARE_FN);
            });

            describe("should return false if the arrays are not equal using custom compare function", () => {
                runTest(false, null, [], COMPARE_FN);
                runTest(false, [{ x: 1 }, {}], [{ x: 1 }, { x: 2 }], COMPARE_FN);
            });
        });

        function runTest(expectedResult: boolean, a: any, b: any, compareFn?: (a: any, b: any) => boolean) {
            it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
                expect(Utils.arraysEqual(a, b, compareFn)).to.equal(expectedResult);
            });
        }
    });
});
