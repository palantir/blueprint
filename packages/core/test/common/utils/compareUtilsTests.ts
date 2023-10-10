/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable max-classes-per-file */

import { expect } from "chai";

import type { KeyAllowlist, KeyDenylist } from "../../../src/common/utils";
import * as CompareUtils from "../../../src/common/utils/compareUtils";

describe("CompareUtils", () => {
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
            it(getCompareTestDescription(a, b), () => {
                expect(CompareUtils.arraysEqual(a, b, compareFn)).to.equal(expectedResult);
            });
        }
    });

    describe("shallowCompareKeys", () => {
        describe("with `keys` defined as whitelist", () => {
            describe("returns true if only the specified values are shallowly equal", () => {
                runTest(true, { a: 1 }, { a: 1 }, wl(["a", "b", "c", "d"]));
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, wl(["a", "c"]));
                runTest(true, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, wl(["a", "b"]));
            });

            describe("returns false if any specified values are not shallowly equal", () => {
                runTest(false, { a: [1, "2", true] }, { a: [1, "2", true] }, wl(["a"]));
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, wl(["a", "b", "c"]));
                runTest(false, { a: 1, c: { a: 1 } }, { a: 1, b: "2" }, wl(["a", "b"]));
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

            function runTest(expectedResult: boolean, a: any, b: any, keys: KeyDenylist<Keys> | KeyAllowlist<Keys>) {
                it(getCompareTestDescription(a, b), () => {
                    expect(CompareUtils.shallowCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` defined as denylist", () => {
            describe("returns true if only the specified values are shallowly equal", () => {
                runTest(true, { a: 1 }, { a: 1 }, bl(["b", "c", "d"]));
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, bl(["b"]));
                runTest(true, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, bl(["c"]));
            });

            describe("returns false if any specified values are not shallowly equal", () => {
                runTest(false, { a: [1, "2", true] }, { a: [1, "2", true] }, bl(["b, c"]));
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, bl(["a", "b", "d"]));
                runTest(false, { a: 1, c: { a: 1 } }, { a: 1, b: "2" }, bl(["c"]));
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

            function runTest(expectedResult: boolean, a: any, b: any, keys: KeyDenylist<Keys> | KeyAllowlist<Keys>) {
                it(getCompareTestDescription(a, b), () => {
                    expect(CompareUtils.shallowCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` not defined", () => {
            describe("returns true if values are shallowly equal", () => {
                runTest(true, { a: 1, b: "2", c: true }, { a: 1, b: "2", c: true });
                runTest(true, undefined, undefined);
                runTest(true, null, undefined);
            });

            describe("returns false if values are not shallowly equal", () => {
                runTest(false, undefined, {});
                runTest(false, null, {});
                runTest(false, {}, []);
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } });
            });

            describe("returns false if keys are different", () => {
                runTest(false, {}, { a: 1 });
                runTest(false, { a: 1, b: "2" }, { b: "2" });
                runTest(false, { a: 1, b: "2", c: true }, { b: "2", c: true, d: 3 });
            });

            describe("returns true if same deeply-comparable instance is reused in both objects", () => {
                const deeplyComparableThing1 = { a: 1 };
                const deeplyComparableThing2 = [1, "2", true];
                runTest(true, { a: 1, b: deeplyComparableThing1 }, { a: 1, b: deeplyComparableThing1 });
                runTest(true, { a: 1, b: deeplyComparableThing2 }, { a: 1, b: deeplyComparableThing2 });
            });

            function runTest(expectedResult: boolean, a: any, b: any) {
                it(getCompareTestDescription(a, b), () => {
                    expect(CompareUtils.shallowCompareKeys(a, b)).to.equal(expectedResult);
                });
            }
        });
    });

    describe("deepCompareKeys", () => {
        class DVD {
            public constructor() {
                /* Empty */
            }
        }

        class VHSTape {
            public constructor() {
                /* Empty */
            }
        }

        describe("with `keys` defined", () => {
            describe("returns true if only the specified values are deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new DVD();

                runTest(true, { a: 1 }, { a: 1 }, ["a", "b", "c", "d"]);
                runTest(true, { a: customInstance1 }, { a: customInstance2 }, ["a"]);
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, ["b", "c"]);
                runTest(true, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, ["b", "c"]);
            });

            describe("returns false if any specified values are not deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new VHSTape();

                runTest(false, { a: [1, "2", true] }, { a: [1, "2", false] }, ["a"]);
                runTest(false, { a: customInstance1 }, { a: customInstance2 }, ["a"]);
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 2 } }, ["a", "b", "c"]);
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
                it(getCompareTestDescription(a, b), () => {
                    expect(CompareUtils.deepCompareKeys(a, b, keys)).to.equal(expectedResult);
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
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: "1" } });
                runTest(false, customInstance1, customInstance2);
            });

            describe("returns false if keys are different", () => {
                runTest(false, {}, { a: 1 });
                runTest(false, { a: 1, b: "2" }, { b: "2" });
                runTest(false, { a: 1, b: "2", c: true }, { b: "2", c: true, d: 3 });
            });

            describe("returns true if same deeply-comparable instance is reused in both objects", () => {
                const deeplyComparableThing1 = { a: 1 };
                const deeplyComparableThing2 = [1, "2", true];
                runTest(true, { a: 1, b: deeplyComparableThing1 }, { a: 1, b: deeplyComparableThing1 });
                runTest(true, { a: 1, b: deeplyComparableThing2 }, { a: 1, b: deeplyComparableThing2 });
            });

            function runTest(expectedResult: boolean, a: any, b: any) {
                it(getCompareTestDescription(a, b), () => {
                    expect(CompareUtils.deepCompareKeys(a, b)).to.equal(expectedResult);
                });
            }
        });
    });

    describe("getDeepUnequalKeyValues", () => {
        describe("with `keys` defined", () => {
            describe("returns empty array if only the specified values are deeply equal", () => {
                runTest([], { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, ["b", "c"]);
            });

            describe("returns unequal key/values if any specified values are not deeply equal", () => {
                runTest(
                    [
                        { key: "a", valueA: 2, valueB: 1 },
                        { key: "b", valueA: [2, 3, 4], valueB: [1, 2, 3] },
                    ],
                    { a: 2, b: [2, 3, 4], c: "3" },
                    { b: [1, 2, 3], a: 1, c: "3" },
                    ["a", "b"],
                );
            });
        });

        describe("with `keys` not defined", () => {
            describe("returns empty arrau if values are deeply equal", () => {
                runTest([], { a: 1, b: "2", c: { a: 1, b: "2" } }, { a: 1, b: "2", c: { a: 1, b: "2" } });
            });

            describe("returns unequal key/values if values are not deeply equal", () => {
                runTest(
                    [{ key: "a", valueA: [1, "2", true], valueB: [1, "2", false] }],
                    { a: [1, "2", true] },
                    { a: [1, "2", false] },
                );
            });
        });

        function runTest(expectedResult: any[], a: any, b: any, keys?: string[]) {
            it(getCompareTestDescription(a, b, keys), () => {
                expect(CompareUtils.getDeepUnequalKeyValues(a, b, keys)).to.deep.equal(expectedResult);
            });
        }
    });
});

function getCompareTestDescription(a?: any, b?: any, keys?: any) {
    const baseResult = `${JSON.stringify(a)} and ${JSON.stringify(b)}`;
    return keys != null ? baseResult + ` (keys: ${JSON.stringify(keys)})` : baseResult;
}

interface Keys {
    a?: any;
    b?: any;
    c?: any;
    d?: any;
}

/**
 * A compactly named function for converting a string array to a key denylist.
 */
function bl(keys: string[]): KeyDenylist<Keys> {
    return { exclude: keys as Array<keyof Keys> };
}

/**
 * A compactly named function for converting a string array to a key whitelist.
 */
function wl(keys: string[]): KeyAllowlist<Keys> {
    return { include: keys as Array<keyof Keys> };
}
